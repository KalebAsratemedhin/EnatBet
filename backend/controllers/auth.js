import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import "dotenv/config";
import BlacklistedToken from "../models/BlacklistedToken.js";
import DeliveryPerson from "../models/deliveryPerson.js";

export const signup = async (req, res) => {
  try {
    const { name, email, password, phoneNumber, address, role } = req.body;
    const isActive = role === "customer" ? true : false;
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phoneNumber,
      address,
      role,
      isActive,
    });

    console.log("creating user", user);

    if (role === "delivery_person") {
      console.log("creating  deliveryPerson", user);

      await DeliveryPerson.create({
        userId: user._id,
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: Array.isArray(user.role) ? user.role[0] : user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: name,
        email: email,
        role: Array.isArray(user.role) ? user.role[0] : user.role,
      },
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// signin
export const signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email }).select("+password");
    if (!user) throw new Error("Invalid credential");

    //Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Invalid credentials");

    //Generate token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );
    res.json({ token, user: { id: user._id, role: user.role } });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;

    const token = authHeader.split(" ")[1].trim();

    //add to blacklist
    await BlacklistedToken.create({ token: token });

    res.json({ message: "logged out successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    if (!user) throw new Error("User not found");

    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
