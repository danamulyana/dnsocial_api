const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        min: 3,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        min: 6
    },
    numberPhone: {
        type: Number,
        default: "",
        max: 14,
    },
    profilePicture: {
        type: String,
        default: "",
    },
    coverPicture: {
        type: String,
        default: "",
    },
    followers: {
        type: Array,
        default: [],
    },
    followings: {
        type: Array,
        default: [],
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    desc: {
        type: String,
        max: 100,
    },
    city: {
        type: String,
        max: 100,
    },
    from: {
        type: String,
        max: 100,
    },
    relationship: {
        type: Number,
        enum: [1,2,3],
    },
}, 
{ 
    timestamps: true 
});

module.exports = mongoose.model("user",UserSchema);