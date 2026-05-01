const axios = require("axios");

const proxyRequest = async (req, res) => {
  const startTime = Date.now();

  try {
    const api = req.api; // ✅ from middleware

    // 🎯 Build target URL
    const path = req.originalUrl.replace(`/gateway/${api._id}`, "");
    const targetUrl = api.baseUrl + path;

    // 🔁 Forward request
    const response = await axios({
      method: req.method,
      url: targetUrl,
      data: req.body,
      headers: {
        ...req.headers,
        host: undefined, // remove host header
      },
      timeout: 5000,
    });

    const latency = Date.now() - startTime;

    // 📊 (future: usage log yahan store hoga)
    console.log("API HIT:", {
      apiId: api._id,
      status: response.status,
      latency,
    });

    res.status(response.status).json(response.data);
  } catch (error) {
    const latency = Date.now() - startTime;

    console.error("Proxy Error:", {
      message: error.message,
      latency,
    });

    res.status(error.response?.status || 500).json({
      message: "Proxy error",
      error: error.response?.data || error.message,
    });
  }
};

module.exports = proxyRequest;
