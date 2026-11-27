const mongoose = require ('mongoose');

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            minLength: 2,
            maxLength: 80
        },

        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            maxLength: 254,
            match: [/.+@.+\..+/, 'Please enter a valid email address'],
        },

        passwordHash: {
            type: String,
            required: true,
            select: false
        },

        role: {
            type: String,
            enum: ["student", "admin"],
            default: "student",
            required: true
        },

        coins: {
            type: Number,
            default: 0,
            min: 0, // the balance can never go below zero
            validate: {
                validator: Number.isInteger,
                message: "Coins must be a whole number"
            }
        },

        openedGifts: [{       // doors whose gift this user has bought
            type: mongoose.Schema.Types.ObjectId,
            ref: "Door"
        }]
    },

    {
        timestamps: true,
    }
);

userSchema.index({ email: 1 }, { unique: true });

const User = mongoose.model('User',userSchema);

module.exports = User;