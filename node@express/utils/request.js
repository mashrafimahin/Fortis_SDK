/**
   author  : Mashrafi Mahin
   role    : Founder & CEO
   project : Authentication & Authorization Service (SDK)
   created : 31/07/2026
   modified: 01/10/2026
 **/

// flexible requests
const request = async (path, context, data, opts) => {
  try {
    const gated = !opts || opts.gated !== false;
    const cfg = context._getConfig();
    const baseUrl = context._getBaseUrl();
    let body;
    if (gated) {
      body = {
        configs: {
          projectId: cfg.projectId,
          secret: cfg.secret,
          origin: cfg.origin,
          provider: cfg.provider,
          test: cfg.test,
        },
        info: { ...(data || {}) },
      };
    } else {
      body = { ...(data || {}) };
    }
    const response = await fetch(baseUrl + path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok || result.success === false) {
      const msg = result.message || ("Request failed (" + response.status + ").");
      throw Error(msg);
    }
    return result;
  } catch (err) {
    return { success: false, message: err && err.message };
  }
};

// exports
module.exports = request;
