const WorkRequest = require("../models/WorkRequest");

const get_all_request = async (req, res) => {
  const requests = await WorkRequest.find();
  res.status(200).json({
    success: true,
    requests
  });
};


module.exports = app => {
  app.get("/api/v1/requests/directory", get_all_request);
};
