const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true},
    passphrase: { type: String, required: true},
    minDwellTime:{type: Number},
    maxDwellTime:{type: Number},
    minFlightTime:{type: Number},
    maxFlightTime:{type: Number},
});

module.exports = mongoose.model("User", UserSchema);