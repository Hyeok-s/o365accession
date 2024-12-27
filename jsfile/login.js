document.addEventListener('DOMContentLoaded', function () {
    var loginForm = document.getElementById('loginForm');
  
    loginForm.addEventListener('submit', function (event) {
      event.preventDefault();
  
      var loginInput = document.getElementById('loginInput').value;
      var passwordInput = document.getElementById('passwordInput').value;
  
      if (!loginInput || !passwordInput) {
        alert('ID와 비밀번호를 모두 입력해주세요.');
        return;
      }
  
      // 서버로 보낼 데이터
      var data = {
        login: loginInput,
        password: passwordInput
      };
  
      // Fetch API를 사용하여 서버에 POST 요청 보내기
      fetch('/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      .then(response => response.json())
      .then(result => {
        // 서버 응답에 따른 처리
        if (result.success) {
          alert('로그인 성공!');
          // 로그인이 성공하면 리다이렉션 URL을 확인하여 페이지 이동
          if (result.redirectTo) {
            window.location.href = result.redirectTo;
          }
        } else {
          alert('로그인 실패: ' + result.message);
          // 실패 시 사용자에게 메시지 표시
        }
      })
      .catch(error => {
        console.error('로그인 요청 실패:', error);
      });
    });
  });
  