const axios = require("axios");
const Api = require("../models/apiModel");

const proxyRequest = async (req, res) => {
  try {
    const api = await Api.findById(req.apiKey.apiId);

    if (!api) {
      return res.status(404).json({ message: "API not found" });
    }

    const targetUrl = api.baseUrl + req.originalUrl.replace(`/gateway/${api._id}`, "");

    const response = await axios({
      method: req.method,
      url: targetUrl,
      data: req.body,
      headers: {
        "Content-Type": "application/json",
      },
    });

    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(500).json({ message: "Proxy error" });
  }
};

module.exports = proxyRequest;