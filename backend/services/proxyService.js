const axios = require("axios");

const proxyRequest = async (req, res) => {
  try {
    const api = req.api;

    if (!api || !api.isActive) {
      return res.status(404).json({ message: "API not active" });
    }

    // 🔥 get endpoint AFTER /gateway/:apiId
    let endpoint = req.originalUrl.split(`/gateway/${api._id}`)[1] || "";

    // 🔥 CLEAN BUG (most important fix)
    endpoint = endpoint.replace(/\n/g, "").trim();

    // 🔥 prevent double slash
    const base = api.baseUrl.endsWith("/")
      ? api.baseUrl.slice(0, -1)
      : api.baseUrl;

    const path = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;

    const targetUrl = `${base}${path}`;

    console.log("==== PROXY DEBUG ====");
    console.log("METHOD:", req.method);
    console.log("TARGET URL:", targetUrl);
    console.log("====================");

    const response = await axios({
      method: req.method,
      url: targetUrl,
      headers: {
        "Content-Type": "application/json",
      },
      data: req.body,
    });

    res.status(response.status).json(response.data);
  } catch (error) {
    console.error("PROXY ERROR FULL:", error.message);

    if (error.response) {
      console.error("AXIOS DATA:", error.response.data);
      return res.status(error.response.status).json(error.response.data);
    }

    res.status(500).json({ message: "Proxy error" });
  }
};

module.exports = proxyRequest;
