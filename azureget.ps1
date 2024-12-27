param (
    [string]$userPrincipalName
)

# Azure AD에 로그인 정보 설정(대학교 o365에서 계정을 만들고 계정과 비밀번호를 재설정해야함)
$AzureADUsername = "ksyoon@mail.ube.ac.kr"
$AzureADPassword = ConvertTo-SecureString -String "sh01045562881!" -AsPlainText -Force
$AzureADCredential = New-Object -TypeName PSCredential -ArgumentList $AzureADUsername, $AzureADPassword

# Azure AD에 로그인(대학교 azure 테넌트ID로 수정해야함)
Connect-AzureAD -Credential $AzureADCredential -TenantId "9dc4b073-886f-4d92-b077-f5ae7576bef3"

# 입력받은 사용자 프린시펄 이름으로 사용자 조회
Get-AzureADUser -ObjectId $userPrincipalName

