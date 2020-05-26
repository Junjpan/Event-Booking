const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/user");

require("dotenv").config;

module.exports = {
  createUser: (args) => {
    return User.findOne({ email: args.userInput.email })
      .then((user) => {
        if (user) {
          throw new Error("User exists already");
        }
        return bcrypt.hash(args.userInput.password, 12);
      })
      .then((hashPassword) => {
        const user = new User({
          email: args.userInput.email,
          password: hashPassword,
        });

        return user.save(); //return to make sure async
      })
      .then((result) => {
        return { ...result._doc, password: null };
      }) //don't want to return password,to be abel to do this, we have to do ...result._doc
      .catch((err) => {
        throw err;
      });
  },
  //name has to match to respectively schema's name
  login: async ({ email, password }) => {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("User does not exist!");
    }

    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      throw new Error("Password is incorrect!");
    }

    const token = jwt.sign(
      { userId: (await user).id, email: user.email },
      process.env.TOKEN,
      {expiresIn: "1h"}
    );

    return {userId:user.id,token,tokenExpiration:1 }
  },
};
