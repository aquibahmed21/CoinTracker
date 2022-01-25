const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const bcrycpt = require("bcryptjs");

const User = require("../../models/Users");

// @route 		GET api/users
// @desc 			Register User
// @access 		Public
router.get("/", (req, res) => {
  res.send("User route");
});

router.post(
  "/",
  [
    check("name", "Name is required!").not().isEmpty(),
    check("email", "Please input valid email").isEmail(),
    check(
      "password",
      "Input valid password with minimum 6 characters"
    ).isLength({ min: 5 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { name, email, password } = req.body;

    try {
      // See if user exists
      let user = await User.findOne({ email });
      if (user)
        return res
          .status(400)
          .json({ errors: [{ msg: "User already exists" }] });

      console.log(1);

      user = new User({
        name,
        email,
        password,
      });
      console.log(user);
      console.log(2);

      // Encrypt password
      const salt = await bcrycpt.genSalt(10);
      user.password = await bcrycpt.hash(password, salt);
      await user.save();
      return res.status(200).send("User Registered");

      // return jsonwebtoken
    } catch (error) {
      return res.status(500).send(error);
    }
  }
);

module.exports = router;