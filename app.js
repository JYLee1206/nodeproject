// app.js
const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const nunjucks = require('nunjucks');
const bcrypt = require('bcrypt');
const app = express();

// 세션 미들웨어 설정
app.use(session({
    secret: 'mySecret', // 세션 암호화에 사용되는 비밀 키
    resave: false,
    saveUninitialized: false
}));

// MongoDB 연결
mongoose.connect('mongodb://localhost:27017/myapp', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB 연결 성공'))
    .catch(err => console.error('MongoDB 연결 실패', err));
// 에러 및 연결 끊김 이벤트 리스너
mongoose.connection.on('error', (error) => {
    console.error('몽고디비 연결 에러', error);
  });
  
  mongoose.connection.on('disconnected', () => {
    console.error('몽고디비 연결이 끊겼습니다. 연결을 재시도합니다.');
    connect();
  });

// 뷰 엔진 설정
nunjucks.configure('views', {
    autoescape: true,
    express: app
});

// 미들웨어 설정
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// 라우트 설정
const mainRoutes = require('./routes/main');
app.use('/', mainRoutes);

const authRoutes = require('./routes/auth');
app.use('/', authRoutes);

// 서버 시작
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});