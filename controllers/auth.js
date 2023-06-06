const {User} = require('../models/user')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const HttpError = require("../Helpers/HttpError");
const ctrlWrapper = require("../Helpers/ctrlWrapper");
const gravatar = require('gravatar');
const Jimp = require("jimp");
const fs = require('fs/promises');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const sendEmail = require('../Helpers/sendEmail');
const {SECRET_KEY} = process.env;


const register = async (req, res) => {
    const {email, password} = req.body;
    const user = await User.findOne({'email':email});

    if(user){
      throw HttpError(409, 'Email in use');
    }
    const verificationToken = uuidv4();
    const avatarURL = gravatar.url(email, {protocol: 'https', s:250})
    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({...req.body, password:hashPassword, avatarURL, verificationToken});
    const data = {
      to: email,
      subject: 'Email verification',
      text: "Let's verify your email so you can start storing contacts.",
      html: `<p>Follow this <a href='${process.env.BASE_URL}/users/verify/${verificationToken}'>link</a> to verify your email.</p>`
    };
    sendEmail(data);
    res.status(201).json({
        "user": {
          "email": newUser.email,
          "subscription": newUser.subscription
        }});
}

const login = async (req, res) => {
  const {email, password} = req.body;
  const user = await User.findOne({email});
  if(!user) throw HttpError(401, 'Email or password is wrong');

  if(!user.verify) throw HttpError(401, 'Email is not verified');

  const passCompare = await bcrypt.compare(password, user.password);
  if(!passCompare) throw HttpError(401, 'Email or password is wrong');

  const payload = {
    id:user._id,
  }
  const token = jwt.sign(payload, SECRET_KEY, {expiresIn:'11h'});
  await User.findByIdAndUpdate(user._id, {token});
  res.status(200).json({
    token,
    "user": {
      "email": user.email,
      "subscription": user.subscription
    }
  });
}

const logout = async (req, res) => {
  const user = await User.findById(req.user._id);
  if(!user) throw HttpError(401, 'Not authorized');
  await User.findByIdAndUpdate(user._id, {token:null});
  res.status(204).send();
}

const current = async (req, res) => {
  res.status(200).json({
      "email": req.user.email,
      "subscription": req.user.subscription
  });
}

const update = async (req, res) => {
  const {subscription} = req.body;
  const user = await User.findByIdAndUpdate(req.user._id, {subscription}, {new: true});
  res.status(200).json({
    "email": user.email,
    "subscription": user.subscription
});
}

const updateAvatar = async (req, res) => {
  if(!req.file) throw HttpError(400, 'Bad Request');
  const tmpPath = req.file.path;
  const ava = await Jimp.read(tmpPath);
  await ava.cover(250, 250).write(tmpPath);
  const newName = `${req.user._id}.${ava.getExtension()}`;
  const newPath = path.resolve('public', 'avatars', newName);
  await fs.rename(tmpPath, newPath);
  const user = await User.findByIdAndUpdate(req.user._id, {avatarURL:`/avatars/${newName}`}, {new: true});
  res.status(200).json({
    "avatarURL":user.avatarURL
  });
}

const verifyEmail = async (req, res) => {
  const {verificationToken} = req.params;
  const user = await User.findOne({verificationToken});
  if (!user) throw HttpError(404, "User not found");
  await User.findByIdAndUpdate(user._id, {verificationToken:null, verify:true});
  res.status(200).json({message:'Verification successful'});
}

const resendEmailVerification = async (req, res) => {
  const {email} = req.body;
  const user = await User.findOne({email});
  if (!user) throw HttpError(404, "User not found");
  if (user.verify) throw HttpError(400, "Verification has already been passed");
  const verificationToken = uuidv4();
  await User.findByIdAndUpdate(user._id, {verificationToken});
  const data = {
    to: email,
    subject: 'Email verification',
    text: "Let's verify your email so you can start storing contacts.",
    html: `<p>Follow this <a href='${process.env.BASE_URL}/users/verify/${verificationToken}'>link</a> to verify your email.</p>`
  };
  sendEmail(data);
  res.status(200).json({message:'Verification email sent'});
}

module.exports = {
    register: ctrlWrapper(register),
    login: ctrlWrapper(login),
    logout: ctrlWrapper(logout),
    current: ctrlWrapper(current),
    update: ctrlWrapper(update),
    updateAvatar: ctrlWrapper(updateAvatar),
    verifyEmail: ctrlWrapper(verifyEmail),
    resendEmailVerification: ctrlWrapper(resendEmailVerification)
}