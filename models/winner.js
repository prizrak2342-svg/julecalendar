const mongoose = require("mongoose");

// The winner of one door, picked at random among the correct answers.
const winnerSchema = new mongoose.Schema({
    door: { type: mongoose.Schema.Types.ObjectId, ref: "Door", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    answer: { type: mongoose.Schema.Types.ObjectId, ref: "Answer", required: true },

    // Date.now WITHOUT () : Mongoose calls it for every new winner.
    // Date.now() would give every winner the time the server started.
    drawnAt: { type: Date, default: Date.now }
});

// Only one winner per door
winnerSchema.index({ door: 1 }, { unique: true });

module.exports = mongoose.model("Winner", winnerSchema);
