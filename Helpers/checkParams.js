const HttpError = require("./HttpError");
const Joi = require("joi");
const {isValidObjectId} = require('mongoose');

const isValidId = (req, res, next) => {
  const {contactId} = req.params;
  if(!isValidObjectId(contactId)) {
    next(HttpError(400, `${contactId} is not valid id`));
  }
  next();
}

const postSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
  favorite: Joi.boolean(),
});

const putSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string().email(),
  phone: Joi.string(),
  favorite: Joi.boolean(),
}).or("name", "email", "phone");

const favSchema = Joi.object({
  favorite: Joi.boolean().required(),
});

const postValidate = (req, res, next) => {
    const { error } = postSchema.validate(req.body);
    if (error) {
      next(HttpError(400, `missing required ${error.details[0].path} field`));
    }
    next();
};

const putValidate = (req, res, next) => {
    const { error } = putSchema.validate(req.body);
    if (error) {
      console.log(error);
      next(HttpError(400, "missing fields"));
    }
    next();
  };

const favoriteValidate = (req, res, next) => {
  const { error } = favSchema.validate(req.body);
  if (error) {
    next(HttpError(400, 'missing field favorite'));
  }
  next();
}

module.exports = {
  postValidate,
  putValidate,
  favoriteValidate,
  isValidId
};
