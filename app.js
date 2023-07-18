const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const indexRouter = require('./routes/indexRoutes.js');
const env = require('dotenv');
const morgan = require('morgan');
const cors = require('cors');
env.config();

app.use(
  cors({
    // process.env 적용이 잘 안되어서 오류 발생
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    credentials: true,
  })
);

app.use(morgan('dev'));

app.use(express.json());
app.use(cookieParser());
app.use('/api', indexRouter);

app.get('/', (req, res) => {
  res.send('CICD 구축 완료');
});

app.listen(process.env.PORT, () => {
  console.log(process.env.PORT, '포트로 서버가 열렸어요!');
});
