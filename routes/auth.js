const express = require('express');
const router = express.Router();
const User = require('../schemas/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.post('/signup', async (req, res) => {
  try {
    const { id, password, name, studentId } = req.body;

    // 새로운 사용자 생성
    const user = new User({ id, password, name, studentId });
    await user.save();

    res.status(201).json({ message: '회원가입 성공' });
  } catch (error) {
    res.status(400).json({ error: '회원가입 실패', details: error });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { id, password } = req.body;

    // 사용자를 데이터베이스에서 찾음
    const user = await User.findOne({ id });
    if (!user) {
      return res.status(404).json({ error: '사용자를 찾을 수 없음' });
    }

    // 비밀번호 확인
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: '비밀번호가 일치하지 않습니다' });
    }

    // JWT 토큰 생성
    const token = jwt.sign({ userId: user._id }, 'your_secret_key', {
      expiresIn: '1h',
    });

    res.json({ message: '로그인 성공', token });
  } catch (error) {
    res.status(400).json({ error: '로그인 실패', details: error });
  }
});

module.exports = router;
