const express = require('express');
// const cookieParser = require("cookie-parser");
const app = express();
const indexRouter = require('./routes/indexRoutes.js');
const env = require('dotenv');
env.config();

app.use(express.json());
// app.use(cookieParser())
app.use('/api', indexRouter);

app.get('/', (req, res) => {
  console.log('CICD test');
});

app.listen(process.env.PORT, () => {
  console.log(process.env.PORT, '포트로 서버가 열렸어요!');
});
