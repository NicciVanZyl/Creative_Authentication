const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
require("dotenv").config({ path: __dirname + '/.env' });

//Add new user
router.post("/register", async (req, res) => {
    try {
        const { email, password, passphrase } = req.body;

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            email,
            password: hashedPassword,
            passphrase
        });


        const saved = await newUser.save();
        const token = jwt.sign(
            { id: saved._id, email: saved.email },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );
        res.send({ message: "User registered", id: saved.id });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: "Email already registered" });
        }
        return res.status(400).json({ message: error.message });
    }
});

router.put("/:id", async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
            returnDocument: 'after',
            runValidators: true,
        });

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: req.body.email });
        if (!user) return res.send({ message: "User not found" });

        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        
        if (!isMatch)
            return res.send({ message: "Email or Password is incorrect" });
        
        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "1h" });
        return res.status(200).json({
            message: "User found",
            token,
            passphrase: user.passphrase,
            minDwellTime: user.minDwellTime,
            maxDwellTime: user.maxDwellTime,
            minFlightTime: user.minFlightTime,
            maxFlightTime: user.maxFlightTime
        });
    } catch (error) {
    res.status(400).json({ message: error.message });
}
});

module.exports = router;
