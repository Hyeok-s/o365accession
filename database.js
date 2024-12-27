const sql = require('mssql');

const config = {
  user: 'sa',
  password: '1234',
  server: 'localhost',
  database: 'members',
  options: {
    encrypt: true,
    trustServerCertificate: true,
    validateBulkLoadParameters: false,
    enableArithAbort: true,
  },
};

function connectToDatabase(callback) {
  sql.connect(config, (err) => {
    if (err) {
      console.error('MSSQL 연결 중 오류:', err);
      callback(err, null);
    } else {
      callback(null, sql);
    }
  });
}

function addUser(formData, callback) {
  connectToDatabase((err, connection) => {
    if (err) {
      callback(err, null);
    } else {
      const currentDate = new Date();
      const offset = currentDate.getTimezoneOffset(); // 로컬 시간대 오프셋(분)

      // 로컬 시간대로 조정
      const localDate = new Date(currentDate.getTime() - offset * 60 * 1000);

      // SQL Server에 전달할 DATETIME 형식의 문자열 생성
      const formattedDate = localDate.toISOString()

      const query = `
        INSERT INTO dbo.users_table (userprincipalname, displayname, institution, registrationdate)
        VALUES ('${formData.userprincipalname}', '${formData.displayname}', '${formData.institution}', '${formattedDate}');
      `;

      const request = new connection.Request();
      request.query(query, (sqlErr, result) => {
        if (sqlErr) {
          console.error('MSSQL 쿼리 실행 중 오류:', sqlErr);
          callback(sqlErr, null);
        } else {
          callback(null, result);
        }
        connection.close();
      });
    }
  });
}

function getUser(useraccount, password, callback) {
    connectToDatabase((err, connection) => {
      if (err) {
        callback(err, null);
      } else {
        const query = `
          SELECT * FROM dbo.admin_account
          WHERE useraccount = '${useraccount}';
        `;
  
        const request = new connection.Request();
        request.query(query, (sqlErr, result) => {
          if (sqlErr) {
            console.error('MSSQL 쿼리 실행 중 오류:', sqlErr);
            callback(sqlErr, null);
          } else {
            // 결과가 존재하는 경우 사용자 정보를 콜백으로 전달
            if (result.recordset.length > 0) {
              const user = result.recordset[0];
  
              // 비밀번호 일치 여부 확인
              if (user.password === password) {
                // 로그인 성공
                callback(null, user);
              } else {
                // 비밀번호 불일치
                callback('유효하지 않은 비밀번호', null);
              }
            } else {
              // 사용자가 존재하지 않는 경우
              callback('유효하지 않은 사용자', null);
            }
          }
          connection.close();
        });
      }
    });
  }

  module.exports = {
    connectToDatabase,
    addUser,
    getUser,
  };