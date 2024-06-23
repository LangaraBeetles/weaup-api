import TokenGenerator from "../models/TokenGenerator.js";

export const signObject = (payload) => {
  try {
    const generator = new TokenGenerator();
    const token = generator.sign(payload);

    return token;
  } catch (error) {
    console.log(error.message);
    return null;
  }
};

export const decodeToken = (token) => {
  try {
    const generator = new TokenGenerator();
    const data = generator.validate(token);

    return data;
  } catch (error) {
    console.log(error.message);
    return null;
  }
};

export const refreshToken = (token) => {
  try {
    const generator = new TokenGenerator();
    const data = generator.refresh(token);

    return data;
  } catch (error) {
    console.log(error.message);
    return null;
  }
};
