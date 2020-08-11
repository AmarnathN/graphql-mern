const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { UserInputError } = require("apollo-server");

const User = require("./../../models/User");
const { validateRegisterInput, validateLoginInput } = require("./../../utils/validators");
const SECRET_KEY = process.env.SECRET_KEY;

function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      username: user.username,
    },
    SECRET_KEY,
    { expiresIn: "1h" }
  );
}

module.exports = {
  Mutation: {
    async register(parent, { registerInput: { username, email, password, confirmPassword } }, context, info) {
      //Validate user data
      const { valid, errors } = validateRegisterInput(username, email, password, confirmPassword);
      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }

      // user uniqueness
      const user = await User.findOne({ username });

      if (user) {
        throw new UserInputError("UserName is taken", {
          errors: {
            username: "UserName is already taken",
          },
        });
      }

      // Hash password and create auth token
      password = await bcrypt.hash(password, 12);

      const newUser = new User({
        email,
        username,
        password,
        createdAt: new Date().toISOString(),
      });

      const res = await newUser.save();

      const token = generateToken(res);

      return {
        ...res._doc,
        id: res.id,
        token,
      };
    },

    // no need to destructure as already destructured in typeDef
    async login(_, { username, password }) {
      const { errors, valid } = validateLoginInput(username, password);

      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }
      // user uniqueness
      const user = await User.findOne({ username });

      if (!user) {
        errors.general = "User not found";
        throw new UserInputError("Invalid credentials", {
          errors,
        });
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        errors.general = "Invalid Password";
        throw new UserInputError("Invalid credentials", {
          errors,
        });
      }

      const token = generateToken(user);
      return {
        ...user._doc,
        id: user.id,
        token,
      };
    },
  },
};
