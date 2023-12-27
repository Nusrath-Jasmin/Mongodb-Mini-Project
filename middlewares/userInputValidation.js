const validator = require('validator');

const validateEmail = (email) => validator.isEmail(email);

const validatePassword = (password) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}<>])[A-Za-z\d!@#$%^&*(),.?":{}<>]{8,}$/.test(password);

const validateUserInput = (req, res, next) => {
  const { email, password } = req.body;

  if (!validateEmail(email)) {
    req.session.message = "Invalid email";
      return res.redirect("/");
  }

  if (!validatePassword(password)) {
    req.session.message = "Password must contain upper and lower case values,special characters and number";
    return res.redirect("/");
  }

  // If validation passes, proceed to the next middleware or route handler
  next();
};

module.exports = validateUserInput;