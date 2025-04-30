const express = require('express');
const notesRouter = require('./routes/notes'); // 노트 라우터 가져오기
const connectDB = require('./config/db');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const https = require('https');
const fs = require('fs');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;
const host = process.env.HOST || '0.0.0.0'; // 환경 변수에서 호스트 설정을 가져옴

// SSL 인증서 설정
const options = {
    key: fs.readFileSync('path/to/private.key'),  // SSL 프라이빗 키 경로
    cert: fs.readFileSync('path/to/certificate.crt')  // SSL 인증서 경로
};

// 서버 시작 전 로깅 추가
console.log('서버 설정:');
console.log(`- 포트: ${port}`);
console.log(`- 호스트: ${host}`);
console.log(`- 환경: ${process.env.NODE_ENV || 'development'}`);

// 보안 설정
app.use(helmet({
    crossOriginOpenerPolicy: false,
    crossOriginResourcePolicy: false,
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: false,
    hsts: false
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15분
    max: 100 // IP당 최대 요청 수
});
app.use(limiter);

// CORS 설정
app.use(cors({
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware 설정
app.use(express.json()); // 요청 본문의 JSON 파싱
app.use(express.urlencoded({ extended: true })); // URL-encoded 데이터 파싱

// 정적 파일 제공
app.use(express.static('public'));

// 기본 라우트
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>노트 앱 서버</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests">
      </head>
      <body>
        <h1>노트 앱 서버에 오신 것을 환영합니다!</h1>
        <p>서버가 정상적으로 실행 중입니다.</p>
      </body>
    </html>
  `);
});

// API 라우트 연결 ('/api/notes' 경로로 들어오는 요청은 notesRouter가 처리)
app.use('/api/notes', notesRouter);

// 에러 핸들링 미들웨어
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        message: '서버 에러가 발생했습니다',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// MongoDB 연결
connectDB();

// HTTP 서버 시작
app.listen(port, host, () => {
  console.log(`HTTP 서버가 http://${host}:${port} 에서 실행 중입니다.`);
  console.log(`로컬 접속: http://localhost:${port}`);
  console.log(`외부 접속: http://119.194.212.219:${port}`);
  console.log('방화벽 설정이 필요할 수 있습니다. 3000번 포트가 열려있는지 확인하세요.');
});

// HTTPS 서버 시작
https.createServer(options, app).listen(443, host, () => {
  console.log(`HTTPS 서버가 https://${host}:443 에서 실행 중입니다.`);
});
