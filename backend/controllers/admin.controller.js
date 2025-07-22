import bcrypt from "bcryptjs";
import { z } from "zod";
import jwt from "jsonwebtoken";

import { Admin } from "../models/admin.model.js";

export const signup = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    const adminSchema = z.object({
      firstName: z.string(),
      lastName: z.string(),
      email: z.email(),
      password: z
        .string()
        .min(6, { message: "Password must be atleast 6 character long" }),
    });

    const validatedData = adminSchema.safeParse(req.body);
    if (!validatedData.success) {
      return res
        .status(400)
        .json({ error: validatedData.error.issues.map((err) => err.message) });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const existingAdmin = await Admin.findOne({ email: email });

    if (existingAdmin) {
      return res.status(400).json({ error: "admin already exist" });
    }

    const admin = await Admin.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    if (!admin) {
      return res.status(400).json({ error: "error in creating a user" });
    }

    if (admin) {
      return res
        .status(201)
        .json({ message: "admin signup successfully", admin });
    }
  } catch (error) {
    console.error("Error in signup", error);
    return res.status(500).json({ errors: "Error in signup " });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email: email });

    if (!admin) {
      return res.status(403).json({ error: "Admin not registered" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, admin.password);

    if (!isPasswordCorrect) {
      return res.status(403).json({ error: "Password is incorrect" });
    }

    // jwt code
    const token = jwt.sign(
      {
        id: admin._id,
      },
      process.env.JWT_ADMIN_SECRET,
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
      .json({ message: "admin logged in successfully", admin, token });
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
    res.status(200).json({ message: "Admin Logout successfull" });
  } catch (error) {
    console.error("Error in logout", error);
    return res.status(500).json({ errors: "Error in logout " });
  }
};
