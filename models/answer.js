const mongoose = require("mongoose");

// One student's answer to one door.
const answerSchema = new mongoose.Schema(
    {
        // Links to other collections: we store only the _id, "ref" says which model it belongs to
        door: { type: mongoose.Schema.Types.ObjectId, ref: "Door", required: true },
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

        text: { type: String, required: true, trim: true, maxLength: 500 },

        // pending = not checked yet, correct / wrong = checked
        status: {
            type: String,
            enum: ["pending", "correct", "wrong"],
            default: "pending"
        },

        // true when the coins for this answer have been paid out,
        // so a student never gets paid twice for the same answer
        coinsGiven: { type: Boolean, default: false }
    },
    { timestamps: true }
);

// One answer per student per door (MongoDB refuses a second one)
answerSchema.index({ door: 1, user: 1 }, { unique: true });

// Makes "all correct answers for door X" fast (used by the winner draw)
answerSchema.index({ door: 1, status: 1 });

module.exports = mongoose.model("Answer", answerSchema);
