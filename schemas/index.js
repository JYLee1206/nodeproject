const mongoose = require('mongoose');

const connect = () => {
  if (process.env.NODE_ENV !== 'production') {
    mongoose.set('debug', true);
  }
  
  // MongoDB에 연결
  mongoose.connect('mongodb://root:1234@localhost:27017/', {
    dbName: 'nodeproject',
  })
  .then(() => {
    console.log('몽고디비 연결 성공');
  })
  .catch((error) => {
    console.log('몽고디비 연결 에러', error);
  });
};

// 에러 및 연결 끊김 이벤트 리스너
mongoose.connection.on('error', (error) => {
  console.error('몽고디비 연결 에러', error);
});

mongoose.connection.on('disconnected', () => {
  console.error('몽고디비 연결이 끊겼습니다. 연결을 재시도합니다.');
  connect();
});

module.exports = connect;
