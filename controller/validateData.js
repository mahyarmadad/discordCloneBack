const Joi = require("joi");

const registerSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
});
const loginSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().min(3).required(),
});
const isEmail = Joi.object({ email: Joi.string().email().required() });

const registerCheck = async (req, res, next) => {
  try {
    await registerSchema.validateAsync(req.body);
    next();
  } catch (error) {
    return res.send(error.message);
  }
};

const loginCheck = async (req, res, next) => {
  try {
    await loginSchema.validateAsync(req.body);
    next();
  } catch (error) {
    return res.send(error.message);
  }
};
const inviteCheck = async (req, res, next) => {
  try {
    let con = isEmail.validate(req.body);
    if (con.error) return res.status(400).send(con.error.message);
    next();
  } catch (error) {
    return res.send(error.message);
  }
};

module.exports = { registerCheck, loginCheck, inviteCheck };
