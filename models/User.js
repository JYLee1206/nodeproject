//models/User.js

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    highScore: {
        type: Number,
        default: 0
    }
});

userSchema.statics.deleteAccount = async function (email) {
    try {
        await this.findOneAndDelete({ email });
        return true; // 성공적으로 회원 탈퇴됨
    } catch (err) {
        console.error(err);
        return false; // 오류 발생으로 회원 탈퇴 실패
    }
};

const User = mongoose.model('User', userSchema);

module.exports = User;
