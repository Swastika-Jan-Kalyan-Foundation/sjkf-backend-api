import jwt from "jsonwebtoken";

const SESSION_HOURS = Number(process.env.SESSION_HOURS || 6);
const SESSION_SECONDS = SESSION_HOURS * 60 * 60;

function signToken(user) {
  return jwt.sign(
    {
      sub: user._id.toString(),
      tv: user.tokenVersion, 
    },
    process.env.JWT_SECRET,
    { expiresIn: SESSION_SECONDS }
  );
}

function verifyToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}

export { signToken, verifyToken, SESSION_SECONDS };
