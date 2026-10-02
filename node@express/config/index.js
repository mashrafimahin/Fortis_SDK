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
  #origin;
  #provider;
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
    this.#origin = config.origin;
    this.#provider = config.provider || "emailPass";
    this.#test = config.test || false;
    instance = this;
  }

  // internal: expose config data to the SDK's own request layer only
  _getConfig() {
    return {
      projectId: this.#project_id,
      secret: this.#secret_key,
      origin: this.#origin,
      provider: this.#provider,
      test: this.#test,
    };
  }

  // signup -> POST /auth/signup
  userSignup(signupInfo, dbModel) {
    return FortisMethods.signup(this, signupInfo, dbModel);
  }
  // login -> POST /auth/login
  userLogin(loginInfo, dbModel) {
    return FortisMethods.login(this, loginInfo, dbModel);
  }
  // update access gate -> POST /auth/update
  userUpdate(updateInfo, dbModel) {
    return FortisMethods.update(this, updateInfo, dbModel);
  }
  // logout -> POST /auth/logout
  userLogout(logoutInfo, dbModel) {
    return FortisMethods.logout(this, logoutInfo, dbModel);
  }
  // verify any issued token -> POST /token/checkToken
  checkToken(info) {
    return FortisMethods.checkToken(this, info);
  }
  // issue a fresh token -> POST /token/newToken
  newToken(info) {
    return FortisMethods.newToken(this, info);
  }
  // request an email otp -> POST /check/createOTP
  createOTP(info) {
    return FortisMethods.createOTP(this, info);
  }
  // verify an otp -> POST /check/checkOTP
  checkOTP(info) {
    return FortisMethods.checkOTP(this, info);
  }
}

// exports
module.exports = FortisConfig;
