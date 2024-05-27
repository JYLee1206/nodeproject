// routes/main.js
const express = require('express');
const router = express.Router();

// 메인 페이지 라우트
router.get('/', (req, res) => {
    const isAuthenticated = req.session.isAuthenticated || false;
    const userEmail = req.session.userEmail || '';
    const username = req.session.userEmail || '';


    res.render('index.njk', {
        isAuthenticated,
        userEmail,
        username
    });
});

module.exports = router;