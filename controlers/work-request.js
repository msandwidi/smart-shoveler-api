const WorkRequest = require("../models/WorkRequest");
const utils = require("../utils");

/**
 * user post a work request
 * @param {*} req
 * @param {*} res
 */
const post_add_request = async (req, res) => {
  try {
    const {
      details,
      date,
      type,
      isRecurrent,
      isHome,
      hasDriveway,
      hasSidewalk,
			address,
			price
    } = req.body;

    let request = new WorkRequest({
			price,
      details,
      address,
      type,
      date,
      isRecurrent,
			isHome,
			hasDriveway,
			hasSidewalk
    });

    request = await request.save();

    res.status(200).json({
      success: true,
      request
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "An unknown error occured"
    });
  }
};

/**
 * find and update an request
 * @param {*} req
 * @param {*} res
 */
const put_update_request = async (req, res) => {
  try {
    const { email, description, date, type, isRecurrent } = req.body;

    const number = req.params.id;

    let request = await WorkRequest.findOne({
      number
    });

    if (!request) {
      res.status(404).json({
        success: false,
        message: "We could not find your request"
      });
    }

    request.email = email;
    request.description = description;
    request.data = date;
    request.isRecurrent = isRecurrent;
    request.type = type;

    request = await request.save();

    res.status(200).json({
      success: true,
      request
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "An unknown error occured"
    });
  }
};

/**
 * get current active works
 * @param {*} req
 * @param {*} res
 */
const get_requests = async (req, res) => {
  try {
    const requests = await WorkRequest.find({ isDeleted: false });

    res.status(200).json({
      success: true,
      requests
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "An unknown error occured"
    });
  }
};

/**
 * search an request
 * @param {*} req
 * @param {*} res
 */
const post_search_request = async (req, res) => {
  try {
    const { email, requestNumber: number } = req.body;

    let request = await WorkRequest.findOne({
      number,
      email
    });

    if (!request) {
      res.status(404).json({
        success: false,
        message: "We could not find your request"
      });
    }

    res.status(200).json({
      success: true,
      request
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "An unknown error occured"
    });
  }
};

module.exports = app => {
  app.get("/api/v1/requests", get_requests);
  app.post("/api/v1/requests", post_add_request);
  app.put("/api/v1/requests/:id", put_update_request);
  app.post("/api/v1/requests/search", post_search_request);
};
