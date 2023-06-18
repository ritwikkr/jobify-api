import User from "../model/userSchema.js";
import { StatusCodes } from "http-status-codes";

async function registerUser(req, res, next) {
  try {
    // TODO: See the userModel (firstName is required)
    const { name, email, password, confirmPassword } = req.body;
    if (!name || !email || !password || !confirmPassword) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json("Please provide all details");
    }
    if (password !== confirmPassword) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json("Both passwords does not match");
    }
    if (password.length < 6) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json("Password length should be greater than 6");
    }
    const isUserAlreadyPresent = await User.findOne({ email });
    if (isUserAlreadyPresent) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json("Email Already Present. Please Login");
    }
    const data = await User.create({ name, email, password });
    data.password = undefined;
    const token = await data.createJWT();
    return res.status(StatusCodes.CREATED).json({ data, token });
  } catch (error) {
    next(error);
  }
}

async function loginUser(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return next({
        statusCode: StatusCodes.BAD_REQUEST,
        message: "Please provide all values",
      });
    }
    const data = await User.findOne({ email });
    if (!data) {
      return next({
        statusCode: StatusCodes.BAD_REQUEST,
        message: "Email Or Password Incorrect",
      });
    }
    const isPasswordCorrect = await data.comparePassword(password);
    if (!isPasswordCorrect) {
      return next({
        statusCode: StatusCodes.BAD_REQUEST,
        message: "Email Or Password Incorrect",
      });
    }
    const token = await data.createJWT();
    data.password = undefined;
    return res.status(200).json({ data, token });
  } catch (error) {
    console.log(error);
  }
}

async function updateUser(req, res, next) {
  try {
    const isUserPresent = await User.findOne({ email: req.body.email });
    if (!isUserPresent) {
      return next({
        statusCode: StatusCodes.BAD_REQUEST,
        message: "Email Not Present",
      });
    }
    const data = await User.findOneAndUpdate(
      { email: req.body.email },
      { firstName: req.body.firstName, lastName: req.body.lastName },
      { new: true }
    );
    const token = await data.createJWT();
    res.status(200).json({ data, token });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
}

export { registerUser, loginUser, updateUser };
