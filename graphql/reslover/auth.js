const bcrypt = require("bcryptjs");
const User = require("../../models/user");

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
  }
};
