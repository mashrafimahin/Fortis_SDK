/**
   author  : Mashrafi Mahin
   role    : Founder & CEO
   project : Authentication & Authorization Service (SDK)
   created : 31/07/2026
   modified: 31/07/2026
**/

// dependencies
const request = require("./request");

// package component
class FortisMethods {
  // signup
  signup = async (context, data) => {
    return request("/auth/signup", context, data);
  };

  // login
  login = async (context, data) => {
    return request("/auth/login", context, data);
  };

  // update
  update = async (context, data) => {
    return request("/auth/update", context, data);
  };

  // logout
  logout = async (context, data) => {
    return request("/auth/logout", context, data);
  };

  // reset password
  resetPassword = async (context, data) => {
    return request("/auth/resetPass", context, data);
  };

  // forgot password
  forgotPassword = async (context, data) => {
    return request("/auth/forgotPass", context, data);
  };

  // delete account
  deleteAccount = async (context, data) => {
    return request("/auth/deleteAcc", context, data);
  };
}

// exports
module.exports = new FortisMethods();
