const bcrypt = require("bcryptjs");
const { registerCheck, loginCheck } = require("../controller/validateData");
const UserSchema = require("../schema/user");
const router = require("express").Router();
const jwt = require("jsonwebtoken");
const verifyToken = require("../controller/tokenCheck");

// Get User
router.get("/", verifyToken, async (req, res) => {
  try {
    const user = await UserSchema.findById(req.user.userId).select("-password");
    return res.json(user);
  } catch (error) {
    console.log("Get User", error.message);
    return res.status(500).send("Server Error");
  }
});

router.post("/register", registerCheck, async (req, res) => {
  try {
    const { username, password, email } = req.body;
    const existUser = await UserSchema.exists({ email });
    if (existUser) return res.status(409).send("User Already Exist");
    const encryptPass = bcrypt.hashSync(password, 10);
    const user = await UserSchema.create({
      username,
      email,
      password: encryptPass,
    });
    const token = jwt.sign(
      {
        userId: user._id,
        email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "24h",
      }
    );

    return res.status(200).json({
      user: {
        email: user.email,
        username: user.username,
        token,
      },
    });
  } catch (error) {
    return res.status(500).send(error.message);
  }
});

router.post("/login", loginCheck, async (req, res) => {
  try {
    const { username, password } = req.body;
    let user = await UserSchema.findOne({ username });
    if (!user) user = await UserSchema.findOne({ email: username });
    if (!user) return res.status(404).send("Invalid Credentials");
    const comparePass = bcrypt.compareSync(password, user.password);
    if (!comparePass) return res.status(404).send("Invalid Credentials");
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );
    return res.status(200).json({
      user: {
        email: user.email,
        username: user.username,
        token,
      },
    });
  } catch (error) {
    return res.status(500).send(error.message);
  }
});

// router.get("/all", async (req, res) => {
//   try {
//     const user = await UserSchema.find().select("-password");
//     res.json(user);
//   } catch (error) {
//     res.status(500).send("Server Error");
//   }
// });

module.exports = router;
