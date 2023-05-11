const HttpError = require("./HttpError");
const Joi = require("joi");
const postSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
});

const putSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string().email(),
  phone: Joi.string(),
}).or("name", "email", "phone");

const postValidate = () => {
  const func = (req, res, next) => {
    const { error } = postSchema.validate(req.body);
    if (error) {
      next(HttpError(400, `missing required ${error.details[0].path} field`));
    }
    next();
  };
  return func;
};

const putValidate = () => {
  const func = (req, res, next) => {
    const { error } = putSchema.validate(req.body);
    if (error) {
      console.log(error);
      next(HttpError(400, "missing fields"));
    }
    next();
  };
  return func;
};

module.exports = {
  postValidate,
  putValidate,
};
