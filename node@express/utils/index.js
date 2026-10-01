/**
   author  : Mashrafi Mahin
   role    : Founder & CEO
   project : Authentication & Authorization Service (SDK)
   created : 31/07/2026
   modified: 01/10/2026
 **/

// dependencies
const request = require("./request");

// package component
// paths use the public balancer prefix (/auth/...) so they work via :6030;
// point baseUrl at :8142 directly to talk to the processor without the balancer.
class FortisMethods {
  // signup -> POST /auth/signup
  signup = async (context, data, model) => {
    try {
      if (model) {
        const isExists = await model.findOne({ email: data.email });
        if (isExists) throw Error("User already exists in database.");
      }
      const response = await request("/auth/signup", context, data);
      if (!response.success) {
        throw Error(response.message || "Failed to create user documents.");
      }
      if (model) {
        const saveStatus = await model.create(response.result);
        if (!saveStatus) {
          throw Error("Failed to save. Check database url/info carefully.");
        }
      }
      return response;
    } catch (err) {
      return { success: false, message: err && err.message };
    }
  };

  // login -> POST /auth/login (needs stored hash as saltCode)
  login = async (context, data, model) => {
    try {
      let stored = null;
      if (model) {
        stored = await model.findOne({ email: data.email });
      }
      const saltCode = (stored && stored.password) || data.hashedPassword || data.saltCode;
      if (!saltCode) {
        throw Error("No stored password found for this user.");
      }
      const payload = { ...data, saltCode };
      delete payload.hashedPassword;
      const response = await request("/auth/login", context, payload);
      if (!response.success) {
        throw Error(response.message || "Login failed.");
      }
      return response;
    } catch (err) {
      return { success: false, message: err && err.message };
    }
  };

  // update access gate -> POST /auth/update
  update = async (context, data, model) => {
    try {
      const response = await request("/auth/update", context, data);
      if (!response.success) {
        throw Error(response.message || "Update check failed.");
      }
      if (model && response.result && response.result.updateAccess) {
        const updates = { ...data };
        delete updates.email;
        delete updates.password;
        await model.updateOne(
          { email: data.email },
          { $set: updates },
          { new: true },
        );
      }
      return response;
    } catch (err) {
      return { success: false, message: err && err.message };
    }
  };

  // logout -> POST /auth/logout
  logout = async (context, data, model) => {
    try {
      const response = await request("/auth/logout", context, data || {});
      if (!response.success) {
        throw Error(response.message || "Logout failed.");
      }
      if (model && response.result && response.result.removeAccess) {
        const pattern = { accessToken: "", refreshToken: "" };
        await model.updateOne(
          { email: (data || {}).email },
          { $set: pattern },
          { new: true },
        );
      }
      return response;
    } catch (err) {
      return { success: false, message: err && err.message };
    }
  };

  // verify token -> POST /auth/token/checkToken (ungated plain body)
  checkToken = async (context, data) => request("/auth/token/checkToken", context, data, { gated: false });

  // fresh token -> POST /auth/token/newToken (ungated plain body)
  newToken = async (context, data) => request("/auth/token/newToken", context, data, { gated: false });

  // request otp email -> POST /auth/check/createOTP (ungated plain body)
  createOTP = async (context, data) => request("/auth/check/createOTP", context, data, { gated: false });

  // verify otp -> POST /auth/check/checkOTP (ungated plain body)
  checkOTP = async (context, data) => request("/auth/check/checkOTP", context, data, { gated: false });
}

// exports
module.exports = new FortisMethods();
