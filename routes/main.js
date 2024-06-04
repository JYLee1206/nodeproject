//routes/main.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');

// 메인 페이지 라우트
router.get('/', async (req, res) => {
    const isAuthenticated = req.session.isAuthenticated || false;
    const userEmail = req.session.userEmail || '';
    let highScore = 0;
    const userName = req.session.userName || '';

    if (isAuthenticated && userEmail) {
        const user = await User.findOne({ email: userEmail });
        if (user) {
            highScore = user.highScore;
        }
    }

    // 점수가 0 이상인 상위 10명의 유저를 조회
    const topUsers = await User.find({ highScore: { $gte: 1 } }).sort({ highScore: -1 }).limit(10);

    res.render('index.njk', {
        userName,
        isAuthenticated,
        userEmail,
        highScore,
        topUsers // topUsers를 뷰로 전달
    });
});



module.exports = router;
