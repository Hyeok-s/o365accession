param(
    [string]$displayname,
    [string]$userprincipalname,
    [string]$password
)

# Azure AD에 로그인 정보 설정(대학교 o365에서 계정을 만들고 계정과 비밀번호를 재설정해야함)
$AzureADUsername = "ksyoon@mail.ube.ac.kr"
$AzureADPassword = ConvertTo-SecureString -String "sh01045562881!" -AsPlainText -Force
$AzureADCredential = New-Object -TypeName PSCredential -ArgumentList $AzureADUsername, $AzureADPassword

# Azure AD에 로그인(대학교 azure 테넌트ID로 수정해야함)
Connect-AzureAD -Credential $AzureADCredential -TenantId "9dc4b073-886f-4d92-b077-f5ae7576bef3"

Connect-MgGraph -Scopes "User.ReadWrite.All", "Organization.Read.All"

# 사용자 생성
$user = @{
    UserPrincipalName = $userPrincipalName
    DisplayName = $displayname
    PasswordProfile = @{
        Password = $password
        ForceChangePasswordNextSignIn = $false  # 변경 여부 설정
    }
    AccountEnabled = $true  # 사용자 계정 활성화 설정
    MailNickname = $userPrincipalName -split '@' | Select-Object -First 1  # @ 앞부분 사용
    UsageLocation = "KR"  # 사용 위치 설정 (ISO 3166-1 국가 코드)
}

#$newUser = New-MgUser @user
New-AzureADUser @user
#$e3Sku = Get-MgSubscribedSku -All | Where SkuPartNumber -eq 'SPE_E3'
#Set-MgUserLicense -UserId "$userPrincipalName" -AddLicenses @{SkuId = $e3Sku.SkuId} -RemoveLicenses @()

