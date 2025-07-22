import bcrypt from "bcryptjs";
import { z } from "zod";
import jwt from "jsonwebtoken";

import { User } from "../models/user.model.js";
import { Course } from "../models/course.model.js";
import { Purchase } from "../models/purchase.model.js";

export const signup = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    const userSchema = z.object({
      firstName: z.string(),
      lastName: z.string(),
      email: z.email(),
      password: z
        .string()
        .min(6, { message: "Password must be atleast 6 character long" }),
    });

    const validatedData = userSchema.safeParse(req.body);
    if (!validatedData.success) {
      return res
        .status(400)
        .json({ error: validatedData.error.issues.map((err) => err.message) });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await User.findOne({ email: email });

    if (existingUser) {
      return res.status(400).json({ error: "user already exist" });
    }

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    if (!user) {
      return res.status(400).json({ error: "error in creating a user" });
    }

    if (user) {
      return res
        .status(201)
        .json({ message: "User signup successfully", user });
    }
  } catch (error) {
    console.error("Error in signup", error);
    return res.status(500).json({ errors: "Error in signup " });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(403).json({ error: "User not registered" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(403).json({ error: "Password is incorrect" });
    }

    // jwt code
    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    const cookieOptions = {
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    };

    res.cookie("jwt", token, cookieOptions);
    return res
      .status(201)
      .json({ message: "User logged in successfully", user, token });
  } catch (error) {
    console.error("Error in login", error);
    return res.status(500).json({ errors: "Error in login " });
  }
};

export const logout = async (req, res) => {
  try {
    if (!req.cookies.jwt) {
      return res.status(400).json({ error: "kindly login first" });
    }

    res.clearCookie("jwt");
    res.status(200).json({ message: "User Logout successfull" });
  } catch (error) {
    console.error("Error in logout", error);
    return res.status(500).json({ errors: "Error in logout " });
  }
};

export const purchases = async (req, res) => {
  try {
    const userId = req.userId;

    const purchased = await Purchase.find({ userId });

    let purchasedCourseId = [];

    for (let i = 0; i < purchased.length; i++) {
      purchasedCourseId.push(purchased[i].courseId);
    }

    const courseData = await Course.find({
      _id: { $in: purchasedCourseId },
    });

    return res.status(200).json({ purchased, courseData });
  } catch (error) {
    console.error("Error in purchases", error);
    return res.status(500).json({ errors: "Error in purchases " });
  }
};
