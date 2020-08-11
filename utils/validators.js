module.exports.validateRegisterInput = (username, email, password, confirmPassword) => {
  const errors = {};
  if (username.trim() === "") {
    errors.username = "Username cannot be empty";
  }
  if (email.trim() === "") {
    errors.email = "email cannot be empty";
  } else {
    const regEx = /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
    if (!email.match(regEx)) {
      errors.email = "email is not a valid one";
    }
  }
  if (password === "") {
    errors.password = "Password cannot be empty";
  } else if (confirmPassword != password) {
    errors.confirmPassword = "Passwords must match";
  }
  return { errors, valid: Object.keys(errors) < 1 };
};

module.exports.validateLoginInput = (username, password) => {
  const errors = {};
  if (username.trim() === "") {
    errors.username = "Username cannot be empty";
  }
  if (password === "") {
    errors.password = "Password cannot be empty";
  }
  return { errors, valid: Object.keys(errors) < 1 };
};
