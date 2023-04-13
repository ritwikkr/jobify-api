import User from "../model/userSchema.js";
import { StatusCodes } from "http-status-codes";

async function registerUser(req, res, next) {
  try {
    const { name, email, password, confirmPassword } = req.body;
    if (!name || !email || !password || !confirmPassword) {
      return next({
        statusCode: StatusCodes.BAD_REQUEST,
        message: "Please provide all values",
      });
    }
    if (password !== confirmPassword) {
      return next({
        statusCode: StatusCodes.BAD_REQUEST,
        message: "Both password does not match",
      });
    }
    if (password.length < 6) {
      return next({
        statusCode: StatusCodes.BAD_REQUEST,
        message: "Password length should be greater than 6",
      });
    }
    const isUserAlreadyPresent = await User.findOne({ email });
    if (isUserAlreadyPresent) {
      return next({
        statusCode: StatusCodes.BAD_REQUEST,
        message: "Email Already Present. Please login",
      });
    }
    const nameList = name.split(" ");
    const lastName = nameList[nameList.length - 1];
    const data = await User.create({ name, email, password, lastName });
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
    const name = req.body.name + " " + req.body.lastName;
    const data = await User.findOneAndUpdate(
      { email: req.body.email },
      { name },
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
