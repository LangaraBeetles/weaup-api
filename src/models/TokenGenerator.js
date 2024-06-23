import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
// These values are included in the token, we just need to validate if they match

const PRIVATE = process.env.JWT_PRIVATE;
const PUBLIC = process.env.JWT_PUBLIC;

const AUDIENCE = process.env.JWT_AUDIENCE;
const ISSUER = process.env.JWT_ISSUER;
const SUBJECT = process.env.JWT_SUBJECT;

class TokenGenerator {
  constructor() {
    if (!PRIVATE || !PUBLIC) {
      console.error("JWT KEYS REQUIRED");
    }
    if (!AUDIENCE) {
      console.error("AUDIENCE REQUIRED");
    }
    if (!ISSUER) {
      console.error("ISSUER REQUIRED");
    }
    if (!SUBJECT) {
      console.error("SUBJECT REQUIRED");
    }

    this.secretOrPrivateKey = PRIVATE;
    this.secretOrPublicKey = PUBLIC;
    this.options = {
      audience: AUDIENCE,
      issuer: ISSUER,
      subject: SUBJECT,
    };
  }

  sign(payload, signOptions) {
    const jwtSignOptions = Object.assign({}, signOptions, this.options);
    return jwt.sign(payload, this.secretOrPrivateKey, jwtSignOptions);
  }

  decode(token) {
    return jwt.decode(token);
  }

  validate(token) {
    const payload = jwt.verify(token, this.secretOrPrivateKey, {
      audience: AUDIENCE,
      issuer: ISSUER,
      subject: SUBJECT,
    });

    return payload;
  }

  refresh(token) {
    const payload = this.validate(token);

    delete payload.iat;
    delete payload.exp;
    delete payload.nbf;

    return jwt.sign(payload, this.secretOrPrivateKey);
  }
}

export default TokenGenerator;
