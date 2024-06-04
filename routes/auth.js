// routes/auth.js
const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const User = require('../models/User');

// 로그인 페이지 라우트
router.get('/login', (req, res) => {
    if (req.session.isAuthenticated) {
        return res.redirect('/');
    }
    res.render('login.njk');
});

// 로그인 양식 제출 처리
router.post('/login', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).send('이메일 또는 비밀번호가 올바르지 않습니다.');
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).send('이메일 또는 비밀번호가 올바르지 않습니다.');
        }
        
        // 쿠키 설정
        res.cookie("user", email, {
            expires: new Date(Date.now() + 900000),
            httpOnly: true
        });

        // 로그인 성공 시 세션에 사용자 정보 저장
        req.session.isAuthenticated = true;
        req.session.userEmail = email;
        req.session.userName = username;

        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.status(500).send('서버 오류가 발생했습니다.');
    }
});


// 회원가입 페이지 라우트
router.get('/signup', (req, res) => {
    if (req.session.isAuthenticated) {
        return res.redirect('/');
    }
    res.render('signup.njk');
});

// 회원가입 양식 제출 처리
router.post('/signup', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, email, password: hashedPassword });
        await user.save();
        res.redirect('/'); // 회원가입 성공 시 메인 페이지로 이동
    } catch (err) {
        console.error(err);
        res.redirect('/'); // 회원가입 실패 시 메인 페이지로 이동
    }
});

// 로그아웃 라우트
router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error(err);
            return res.status(500).send('로그아웃 중 오류가 발생했습니다.');
        }
        res.clearCookie('sid'); // 사용자 정보 쿠키 삭제
        res.redirect('/');
    });
});

router.get('/highscore', async (req, res) => {
    try {
        const topUsers = await User.find({}).sort({ highScore: -1 }).limit(10);
        res.render('highscore.njk', { topUsers });
    } catch (err) {
        console.error(err);
        res.status(500).send('서버 오류가 발생했습니다.');
    }
});

router.post('/updateHighScore', async (req, res) => {
    if (req.session.isAuthenticated) {
        const userEmail = req.session.userEmail;
        const { score } = req.body;
        const user = await User.findOne({ email: userEmail });
        if (user && score > user.highScore) {
            user.highScore = score;
            await user.save();
        }
        res.sendStatus(200);
    } else {
        res.sendStatus(401);
    }
});

module.exports = router;
