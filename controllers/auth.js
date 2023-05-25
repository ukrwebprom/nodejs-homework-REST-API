const {User} = require('../models/user')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const HttpError = require("../Helpers/HttpError");
const ctrlWrapper = require("../Helpers/ctrlWrapper");
const {SECRET_KEY} = process.env;

const register = async (req, res) => {
    const {email, password} = req.body;
    const user = await User.findOne({'email':email});

    if(user){
      throw HttpError(409, 'Email in use');
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({...req.body, password:hashPassword});
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
  const user = await User.findByIdAndUpdate(req.user._id, {subscription});
  res.status(200).json({
    "email": user.email,
    "subscription": user.subscription
});
}

module.exports = {
    register: ctrlWrapper(register),
    login: ctrlWrapper(login),
    logout: ctrlWrapper(logout),
    current: ctrlWrapper(current),
    update: ctrlWrapper(update)
}