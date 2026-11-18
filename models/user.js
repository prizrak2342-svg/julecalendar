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

        balance: {
            type: Number,
            required: true,
            default: 0,
            min: 0,
            validate: {
                validator: Number.isSafeInteger,
                message: "Balance must be a safe integer"
            },

        }
    },
    {
        timestamps: true,
    }
);

userSchema.index({ email: 1 }, { unique: true });

const User = mongoose.model('User',userSchema);

module.exports = User;