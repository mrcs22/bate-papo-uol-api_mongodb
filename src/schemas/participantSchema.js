import Joi from "joi";

const signIn = Joi.object({
  name: Joi.string().required(),
});

export { signIn };
