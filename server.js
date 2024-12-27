const express = require('express');
const bodyParser = require('body-parser');
const { exec } = require('child_process');
const session = require('express-session');
const path = require('path');
const database = require('./database');
const cors = require('cors');

const app = express();
const port = 3003;

// 정적 파일 서비스 설정
app.use(express.static(__dirname)); // 루트 디렉토리를 정적 파일 서빙으로 지정

// CORS 설정
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const crypto = require('crypto');

let userID = "";
let divide = "";

// AES 복호화 함수
function decryptAES(encryptedData, key) {
  const decipher = crypto.createDecipher('aes-128-cbc', key);
  let decryptedData = decipher.update(encryptedData, 'base64', 'utf8');
  decryptedData += decipher.final('utf8');
  return decryptedData;
}

app.get('/', (req, res) => {
  // GET 요청에서 암호화된 데이터와 AES 키 추출
  const encryptedData = req.query.data;
  const encryptedKey = req.query.key;

  // Base64로 인코딩된 AES 키를 디코딩
  const decodedKey = Buffer.from(encryptedKey, 'base64');

  // AES 키를 사용하여 복호화
  const decipher = crypto.createDecipheriv('aes-128-ecb', decodedKey, '');
  let decryptedData = decipher.update(encryptedData, 'base64', 'utf8');
  decryptedData += decipher.final('utf8');

  // 분리된 데이터를 가져오기
  const dataArray = decryptedData.split('|');
  userID = dataArray[0];
  divide = dataArray[1];

  // 각 변수에 저장된 값을 출력
  console.log('UserIDse:', userID);
  console.log('Divide:', divide);


  if (userID && divide) {
    // 세션 값이 있는 경우 office365.html을 클라이언트로 보냅니다.
    res.sendFile(path.join(__dirname, `office.html`));
  } else {
    // 세션 값이 없는 경우 에러 메시지를 클라이언트로 보냅니다.
    res.status(400).send('잘못된접근입니다.');
  }
});


app.get('/personnaloffice', (req, res) => {
  // GET 요청에서 암호화된 데이터와 AES 키 추출
  const encryptedData = req.query.data;
  const encryptedKey = req.query.key;

  // Base64로 인코딩된 AES 키를 디코딩
  const decodedKey = Buffer.from(encryptedKey, 'base64');

  // AES 키를 사용하여 복호화
  const decipher = crypto.createDecipheriv('aes-128-ecb', decodedKey, '');
  let decryptedData = decipher.update(encryptedData, 'base64', 'utf8');
  decryptedData += decipher.final('utf8');

  // 분리된 데이터를 가져오기
  const dataArray = decryptedData.split('|');
  userID = dataArray[0];
  divide = dataArray[1];

  // 각 변수에 저장된 값을 출력
  console.log('UserIDse:', userID);
  console.log('Divide:', divide);


  if (userID && divide) {
    // 세션 값이 있는 경우 office365.html을 클라이언트로 보냅니다.
    res.sendFile(path.join(__dirname, `personnaloffice.html`));
  } else {
    // 세션 값이 없는 경우 에러 메시지를 클라이언트로 보냅니다.
    res.status(400).send('잘못된접근입니다.');
  }
});

// 라우트: Office 365 가입 페이지 표시
app.get('/signup', (req, res) => {
  if (userID && divide) {
    // 세션 값이 있는 경우 office365.html을 클라이언트로 보냅니다.
    res.sendFile(path.join(__dirname, 'signup.html'));
  } else {
    // 세션 값이 없는 경우 에러 메시지를 클라이언트로 보냅니다.
    res.status(400).send('잘못된접근입니다.');
  }
});


// 라우트: Office 365 가입 페이지 표시
app.get('/personnalsignup', (req, res) => {
  if (userID && divide) {
    // 세션 값이 있는 경우 office365.html을 클라이언트로 보냅니다.
    res.sendFile(path.join(__dirname, 'personnalsignup.html'));
  } else {
    // 세션 값이 없는 경우 에러 메시지를 클라이언트로 보냅니다.
    res.status(400).send('잘못된접근입니다.');
  }
});


//라우트: Office 365 가입 페이지 표시
app.get('/information', (req, res) => {
  if (userID && divide) {
    // 세션 값이 있는 경우 office365.html을 클라이언트로 보냅니다.
    const filePath = path.join(__dirname, 'information.html');
    
    // 사용자 ID와 분류를 함께 보냅니다.
    res.sendFile(filePath, { userID, divide });
  } else {
    // 세션 값이 없는 경우 에러 메시지를 클라이언트로 보냅니다.
    res.status(400).send('잘못된접근입니다.');
  }
});


//라우트: Office 365 가입 페이지 표시
app.get('/personnalinformation', (req, res) => {

  if (userID && divide) {

    // 세션 값이 있는 경우 office365.html을 클라이언트로 보냅니다.
    res.sendFile(path.join(__dirname, 'personnalinformation.html'));
  } else {
    // 세션 값이 없는 경우 에러 메시지를 클라이언트로 보냅니다.
    res.status(400).send('잘못된접근입니다.');
  }
});


app.post('/membershipcheck', (req, res) => {
  // 클라이언트로부터 받은 사용자 계정 정보
  const hackbun = userID;

  // PowerShell 스크립트를 실행하여 사용자 확인
  const command = `powershell -File ${__dirname}/membershipcheck.ps1 -hackbun "${hackbun}"`;

  exec(command, (error, stdout, stderr) => {
    if (error) {
      // PowerShell 스크립트에서 발생한 오류 처리
      console.error(`오류 발생: ${error.message}`);
      if (error.message.includes("User with department")) {
        // 사용자가 존재하지 않는 경우
        res.json({ isDuplicate: false, message: '사용자가 존재하지 않습니다.' });
      } else {
        res.status(500).json({ error: '서버 오류가 발생했습니다.' });
      }
      return;
    }

    // 사용자가 존재하는 경우
    res.json({ isDuplicate: true, message: '사용 가능한 사용자 계정입니다.' });
  });
});

app.post('/saveToAD', (req, res) => {
  const formData = req.body;
  const hackbun = userID;
  // 1. Azure에 사용자 추가
  const adCommand = `powershell -File ${__dirname}/azuread.ps1 -displayname "${formData.displayname}" -userprincipalname "${formData.userprincipalname}" -hackbun "${hackbun}" -password "${formData.password}"`;

  exec(adCommand, (adError, adStdout, adStderr) => {
    if (adError) {
      console.error('Azure PowerShell 스크립트 실행 중 오류:', adStderr);
      res.status(500).send('Azure PowerShell 스크립트 실행 중 오류');
    } else {
      console.log('Azure와 MSSQL에 사용자가 성공적으로 추가되었습니다.');
      res.json({ success: true, redirect: 'https://login.microsoftonline.com' });
    }
  });
});


app.post('/saveToUser', (req, res) => {
  const formData = req.body;
  const hackbun = userID;
  // 1. Azure에 사용자 추가
  const adCommand = `powershell -File ${__dirname}/personnalad.ps1 -displayname "${formData.displayname}" -userprincipalname "${formData.userprincipalname}" -hackbun "${hackbun}" -password "${formData.password}"`;

  exec(adCommand, (adError, adStdout, adStderr) => {
    if (adError) {
      console.error('Azure PowerShell 스크립트 실행 중 오류:', adStderr);
      res.status(500).send('Azure PowerShell 스크립트 실행 중 오류');
    } else {
      console.log('Azure에 사용자가 성공적으로 추가되었습니다.');
      res.json({ success: true, redirect: 'https://login.microsoftonline.com' });
    }
  });
});


app.post('/checkDuplicateUser', (req, res) => {
  // 클라이언트로부터 받은 사용자 계정 정보
  const userPrincipalName = req.body.userPrincipalName;

  // PowerShell 스크립트를 실행하여 사용자 확인
  const command = `powershell -File ${__dirname}/azureget.ps1 -userprincipalname "${userPrincipalName}"`;

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`오류 발생: ${error.message}`);
      res.status(500).json({ error: '서버 오류가 발생했습니다.' });
      return;
    }

    // PowerShell 스크립트에서 전달된 오류 처리
    if (stderr) {
      // 사용자가 존재하지 않더라도 클라이언트에게 '사용 가능한 사용자 계정입니다.'를 반환
      res.json({ isDuplicate: false });
      return;
    }

    // 사용자가 존재하지 않으면 중복 여부를 false로 설정
    const isDuplicate = stdout.trim() !== '';
    res.json({ isDuplicate });
  });
});

app.post('/personcheck', (req, res) => {
  // 클라이언트로부터 받은 사용자 계정 정보
  const userPrincipalName = req.body.userPrincipalName;

  // PowerShell 스크립트를 실행하여 사용자 확인
  const command = `powershell -File ${__dirname}/azureget.ps1 -userprincipalname "${userPrincipalName}"`;

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`오류 발생: ${error.message}`);
      res.status(500).json({ error: '서버 오류가 발생했습니다.' });
      return;
    }

    // PowerShell 스크립트에서 전달된 오류 처리
    if (stderr) {
      // 사용자가 존재하지 않더라도 클라이언트에게 '사용 가능한 사용자 계정입니다.'를 반환
      res.json({ isDuplicate: false });
      return;
    }
    // 사용자가 존재하지 않으면 중복 여부를 false로 설정
    const isDuplicate = stdout.trim() !== '';
    res.json({ isDuplicate });
  });
});

// 서버 시작
app.listen(port, () => {
  console.log(`서버가 http://o.hit.ac.kr:${port} 에서 실행 중입니다.`);
});