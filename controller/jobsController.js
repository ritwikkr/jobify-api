import Job from "../model/jobSchema.js";

async function createJobs(req, res, next) {
  try {
    const { jobDetails, id } = req.body;
    const { position, company, location, status, type } = jobDetails;
    if (!position || !company || !location || !status || !type) {
      return next({ statusCode: 400, message: "Please provide all values" });
    }
    const body = { ...jobDetails, userId: id };
    const data = await Job.create(body);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json(error);
    // return next({ statusCode: 500, message: error });
  }
}

async function getJobs(req, res) {
  try {
    const { userId } = req.params;
    const data = await Job.find({ userId });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json(error);
  }
}

async function deleteJobs(req, res) {
  try {
    const { id } = req.params;
    const data = await Job.findByIdAndDelete(id);
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
  }
}

async function getSingleJob(req, res) {
  try {
    const { id } = req.params;
    const data = await Job.findById(id);
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
  }
}

async function updateJob(req, res) {
  try {
    const {} = req.body;
  } catch (error) {
    console.log(error);
  }
}

export { createJobs, getJobs, deleteJobs, getSingleJob, updateJob };
