// 중복 확인 상태 변수
let isDuplicateChecked = false;

// 중복 확인 함수 수정
async function personcheck() {
    // 입력된 사용자 ID 가져오기
    var userID = document.getElementById('userprincipalname').value;

    // 도메인 설정
    var domain = '@mail.ube.ac.kr';

    // 완전한 이메일 주소 생성
    var userPrincipalName = userID + domain;

    // 서버로 요청 보내기
    fetch('/personcheck', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userPrincipalName: userPrincipalName })
    })
    .then(response => {
        // 서버로부터 응답 받기
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('서버 응답 오류');
        }
    })
    .then(data => {
        // 받은 응답으로 중복 여부 확인
        if (data.isDuplicate) {
            alert('이미 사용 중인 사용자 계정입니다.');
        } else {
            alert('사용 가능한 사용자 계정입니다.');
            // 중복 확인이 완료되면 상태 변수를 true로 설정
            isDuplicateChecked = true;
        }
    })
    .catch(error => {
        // 오류 처리
        console.error('오류 발생:', error);
        alert('서버 오류가 발생했습니다.');
    });
}
