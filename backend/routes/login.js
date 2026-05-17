const express = require("express");
const router = express.Router();
const User = require("../models/user");

//Add new user
router.post("/register", async (req, res) => {
    try {
        const newUser = new User(req.body);

        const saved = await newUser.save();
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
        const user = await User.findOne({ email: req.body.email });
        if (!user) return res.send({ message: "User not found" });
        if (user.password !== req.body.password)
            return res.send({ message: "Email or Password is incorrect" });

        return res.status(200).json({
            message: "User found",
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
