const { Router } = require("express");
const userRouter = Router();
const z = require("zod");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { userModel } = require("../db");   // <-- Make sure this import exists
const JWT_USER_PASSWORD = "ilovecream";

// ------------------ SIGNUP ------------------

userRouter.post("/signup", async function (req, res) {
  const requiredbody = z.object({
    email: z.string(),
    password: z.string(),
    firstName: z.string(),
    lastName: z.string(),
  });

  const parsed = requiredbody.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      message: "Invalid input",
      errors: parsed.error.errors,
    });
  }

  const { email, password, firstName, lastName } = parsed.data;

  const hashPassword = await bcrypt.hash(password, 10);

  await userModel.create({
    email,
    password: hashPassword,
    firstName,
    lastName,
  });

  res.json({
    message: "signup successful",
  });
});

// ------------------ SIGNIN ------------------

userRouter.post("/signin", async function (req, res) {
  const { email, password } = req.body;

  // Step 1
  const user = await userModel.findOne({ email });

  if (!user) {
    return res.status(403).json({
      message: "Incorrect credentials",
    });
  }

  // Step 2
  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  if (!isPasswordCorrect) {
    return res.status(403).json({
      message: "Incorrect credentials",
    });
  }

  // Step 3
  const token = jwt.sign(
    { id: user._id },
    JWT_USER_PASSWORD
  );

  res.json({
    token: token,
  });
});


userRouter.get("/purchases", function (req, res) {
  res.json({
    message: "Protected purchases route",
  });
});

module.exports = {
  userRouter,
};