import Joi from "joi";

const validMessageTypes = ["message", "private_message"];
const saveNew = Joi.object({
  from: Joi.string().required(),
  to: Joi.string().required(),
  text: Joi.string().required(),
  type: Joi.string()
    .valid(...validMessageTypes)
    .required(),
});

export { saveNew };
