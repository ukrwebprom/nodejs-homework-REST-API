const {Schema, model} = require('mongoose');
const Joi = require("joi");

const userSchema = new Schema({
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
    },
    subscription: {
      type: String,
      enum: ["starter", "pro", "business"],
      default: "starter"
    },
    token: {
      type: String,
      default: null,
    },
  }, {versionKey:false})

  userSchema.post("save", (error, data, next) => {
    const {name, code} = error;
    error.status = (name==="MongoServerError" && code === 11000) ? 409 : 400;
    next();
})

const User = model("users", userSchema);

const signupSchema = Joi.object({
    password: Joi.string().required(),
    email: Joi.string().email().required(),
    subscription: Joi.string().valid('starter','pro', 'business'),
    token: Joi.string(),
});
const loginSchema = Joi.object({
    password: Joi.string().required(),
    email: Joi.string().email().required(),
});
const updateSubscriptionSchema = Joi.object({
  subscription: Joi.string().valid('starter','pro', 'business').required()
});

module.exports = {
    User,
    signupSchema,
    loginSchema,
    updateSubscriptionSchema
}