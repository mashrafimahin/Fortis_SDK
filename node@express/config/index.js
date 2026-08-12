/**
   author  : Mashrafi Mahin
   role    : Founder & CEO
   project : Authentication & Authorization Service (SDK)
   created : 31/07/2026
   modified: 31/07/2026
**/

// singleton instance holder
let instance = null;
// dependencies
const FortisMethods = require("../utils");

// package component
class FortisConfig {
  #project_id;
  #secret_key;
  #db_uri;
  #test;

  constructor(config) {
    if (instance) {
      return instance;
    }

    if (!config || !config.projectId || !config.secret) {
      throw new Error("FortisConfig requires projectId and secret");
    }

    this.#project_id = config.projectId;
    this.#secret_key = config.secret;
    this.#db_uri = config.dbURI;
    this.#test = config.test || false;
    instance = this;
  }

  // internal: expose config data to the SDK's own request layer only
  _getConfig() {
    return {
      projectId: this.#project_id,
      secret: this.#secret_key,
      dbURI: this.#db_uri,
      test: this.#test,
    };
  }

  // signup
  userSignup(signupInfo) {
    return FortisMethods.signup(this, signupInfo);
  }
  // login
  userLogin(loginInfo) {
    console.log("login from config - passed");
    return FortisMethods.login(this, loginInfo);
  }
  // update
  userUpdate(updateInfo) {
    return FortisMethods.update(this, updateInfo);
  }
  // logout
  userLogout(logoutInfo) {
    return FortisMethods.logout(this, logoutInfo);
  }
  // reset password
  userResetPass(resetInfo) {
    return FortisMethods.resetPassword(this, resetInfo);
  }
  // forgot password
  userForgotPass(forgotInfo) {
    return FortisMethods.forgotPassword(this, forgotInfo);
  }
  // delete account
  userDeletion(info) {
    return FortisMethods.deleteAccount(this, info);
  }
}

// exports
module.exports = FortisConfig;
