const mongoose = require("mongoose");

// A sub-schema: one picture or video inside a door.
// { _id: false } because these items don't need their own id.
const mediaSchema = new mongoose.Schema(
    {
        type: { type: String, enum: ["image", "video"], required: true },
        url: { type: String, required: true, trim: true },
        alt: { type: String, trim: true, maxLength: 200 }
    },
    { _id: false }
);

const doorSchema = new mongoose.Schema(
    {
        day: { type: Number, required: true, min: 1, max: 24 },
        opensAt: { type: Date, required: true },

        title: { type: String, required: true, trim: true, maxLength: 100 },
        text: { type: String, default: "", maxLength: 5000 },
        media: { type: [mediaSchema], default: [] },

        question: { type: String, required: true, trim: true, maxLength: 500 },
        // select: false = never sent to students unless we ask for it with .select("+correctAnswer")
        correctAnswer: { type: String, trim: true, default: "", select: false },

        // The gift behind the door: a picture from public/img, bought with coins
        giftImage: { type: String, default: "" },
        giftPrice: { type: Number, default: 5, min: 0 }
    },
    { timestamps: true }
);

// Only one door per day
doorSchema.index({ day: 1 }, { unique: true });

module.exports = mongoose.model("Door", doorSchema);
