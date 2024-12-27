async function saveToUser() {
    if (!isDuplicateChecked) {
      alert('중복 확인을 해주세요.');
      return;
    }
    // 폼 데이터 가져오기
    var formData = {
      institution: document.getElementById("institution").value,
      displayname: document.getElementById("displayname").value,
      userprincipalname: document.getElementById("userprincipalname").value + '@mail.ube.ac.kr',
      password: document.getElementById("password").value,
      confirmPassword: document.getElementById("confirmpassword").value
    };
  
    // 입력 데이터 유효성 검증
    if (!validatePassword(formData.password)) {
      alert('비밀번호는 영어와 숫자와 특수기호를 포함하여 3가지로 15글자 이내여야 합니다.');
      return;
    }
  
      // 입력한 비밀번호와 비밀번호 확인이 일치하는지 확인
      if (!validatePasswordConfirmation(formData.password, formData.confirmPassword)) {
        alert('비밀번호와 비밀번호 확인이 일치하지 않습니다.');
        return;
    }
  
    showLoadingOverlay();
  
    try {
      const response = await fetch('/saveToUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      const data = await response.json();
  
      if (data.success) {
        console.log(data);
        alert('회원가입이 완료되었습니다.');
  
        // 페이지 이동
        if (data.redirect) {
          window.location.href = data.redirect;
        }
      } else {
        alert('회원가입에 실패하였습니다. 중복된 아이디일 수 있습니다.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('회원가입 중에 오류가 발생했습니다.');
    } finally {
      // 로딩 스피너 숨기기
      hideLoadingOverlay();
    }
  }
  
  // 비밀번호 확인이 일치하는지 확인하는 함수
  function validatePasswordConfirmation(password, confirmPassword) {
    return password === confirmPassword;
  }
  
  // 비밀번호 유효성 검증
  function validatePassword(password) {
    // 영어, 숫자, 특수기호를 포함하여 3가지로 8글자 이상 15글자 이내
    var regex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[a-zA-Z\d!@#$%^&*()_+]{9,15}$/;
    return regex.test(password);
  }
  
  function showLoadingOverlay() {
    var loadingOverlay = document.getElementById('loadingOverlay');
    if (loadingOverlay) {
      loadingOverlay.style.display = 'flex'; // 또는 'block' 등 원하는 디스플레이 속성 사용
    }
  }
  
  function hideLoadingOverlay() {
    var loadingOverlay = document.getElementById('loadingOverlay');
    if (loadingOverlay) {
      loadingOverlay.style.display = 'none';
    }
  }