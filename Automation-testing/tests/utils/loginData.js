const loginData = {
  validUser: {
    email: "user@gmail.com",
    password: "User@123"
  },

  invalidUser: {
    email: "invalid@gmail.com",
    password: "Wrong@123"
  },

  invalidPassword: {
    email: "user@gmail.com",
    password: "Wrong@123"
  },

  invalidEmail: {
    email: "wronguser@gmail.com",
    password: "User@123"
  },

  // Email with leading and trailing spaces
  spaces: {
    email: "   user@gmail.com   ",
    password: "User@123"
  },

  emptyUser: {
    email: "",
    password: ""
  }
};

module.exports = loginData;