# 항해99 1조 FE/BE 주특기 프로젝트 진행

## 기획

주특기 주차에 배운 기술들을 집합하여 TodoList를 구현하였습니다.

S.A 링크 : https://www.notion.so/hangjo0610/1-4b650011dc4046ae82411218ae6d7290

서비스 링크 : [LeeEoPark ToDo](http://mini-project-jay.s3-website.ap-northeast-2.amazonaws.com/)

FE Repository : https://github.com/junho01052/miniproject-hh
BE Repository : https://github.com/Hangju0610/hh99_miniProject

## 목표
0. FE와 BE의 협업을 통해 실제 웹페이지를 구현, 배포하는 것
1. Todolist의 List CRUD API 구현 및 페이지 구현
2. FE와 BE 연결 및 배포 TEST 진행

### 추가 목표
1. Infinite Scroll or Pagenation 구현 (완료)
2. 로그인, 회원가입 구현 (완료) → ~~RefreshToken, AccessToken으로 구현할려 했으나 실패~~
3. ~~Passport social Login~~ (시간 부족으로 인한 패스)

## ERD
![ERD](/miniproject.png)
## 기술 스택
Programing Language

<div align="left">
	<img src="https://img.shields.io/badge/Javascript-F7DF1E?style=flat&logo=Javascript&logoColor=white" />
</div>

Software Framework

<div align="left">
	<img src="https://img.shields.io/badge/Node.js-339933?style=flat&logo=nodedotjs&logoColor=white" />
	<img src="https://img.shields.io/badge/express-000000?style=flat&logo=express&logoColor=white" />
</div>

SERVER & CI/CD

<div align="left">
	<img src="https://img.shields.io/badge/amazonaws-232F3E?style=flat&logo=amazonaws&logoColor=white" />
  <img src="https://img.shields.io/badge/githubactions-2088FF?style=flat&logo=githubactions&logoColor=white" />
  <img src="https://img.shields.io/badge/amazons3-569A31?style=flat&logo=amazons3&logoColor=white" />
	<img src="https://img.shields.io/badge/amazonec2-FF9900?style=flat&logo=amazonec2&logoColor=white" />
  <img src="https://img.shields.io/badge/awscodedeploy-569A31?style=flat&logo=AWS codedeploy3&logoColor=white" />
  <img src="https://img.shields.io/badge/nginx-009639?style=flat&logo=nginx&logoColor=white" />
  <img src="https://img.shields.io/badge/letsencrypt-003A70?style=flat&logo=letsencrypt&logoColor=white" />
</div>

DB

<div align="left">
  <img src="https://img.shields.io/badge/amazonrds-527FFF?style=flat&logo=amazonrds&logoColor=white" />
	<img src="https://img.shields.io/badge/mysql-4479A1?style=flat&logo=mysql&logoColor=white" />
	<img src="https://img.shields.io/badge/sequelize-52B0E7?style=flat&logo=sequelize&logoColor=white" />
</div>

SECURITY

<div align="left">
  <img src="https://img.shields.io/badge/jsonwebtokens-000000?style=flat&logo=jsonwebtokens&logoColor=white" />
</div>

## 기술적 의사 결정
| 사용 기술      | 기술 설명                                                                                                                                                                                                                                                                                                                                                           |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Git Action** | - “프로젝트 스코프”에 따른 통합성과 접근성 </br> - 별도 설치/인프라 확장/운영/문서(리소스) 관리 등에 대한 고려 불필요 </br> - GitHub에서 전체 관리 가능 </br> - 설정 정형화 > 접근성▲                                                                                                                                                                               |
| **Nginx**      | - 비동기 방식을 통해 버퍼 오버플로우 예방과 높은 효율성 보장 </br> - 병렬 처리 속도가 빠르고 안정적이라 Apache 대비 높은 성능 제공 </br> - SSL 인증 지원으로 보안성 확보 </br> - 포트 리다이렉션으로 사용자 요청 안전처리 및 정확도가 향상된 결과 제공                                                                                                                       
| **Bcrypt**     | - 데이터베이스 유출 시 평문 비밀번호의 계정보안 위협 방지 </br> - 사용자 게시글 무단 수정 방지를 위해 비밀번호 해싱으로 보안 강화 </br> - 비교적 낮은 메모리 사용량에 비해 솔트를 활용한 높은 보안성, 직관적 코드사용으로 높은 접근성                                                                                                                               |

## BE 기능 구현
- TodoList CRUD 구현
- Github Action, AWS EC2, AWS S3, AWS codedeploy를 통해 CI/CD 구현
- API SERVER HTTPS 배포
- List 전체 페이지 pagenation Logic 구현
- 로그인, 회원가입 구현 ~~(RefreshToken, AccessToken으로 구현할려 했으나 실패)~~

## Trouble Shooting
<details>
<summary>CORS ERROR 관련</summary>

<br>
  
**`문제`**
FE - BE 연결 시 Cross-Origin Resource Sharing 문제 발생

**`해결`**
BE API Server에서 cors Middleware 적용 후 Error 해결 (Origin : '*', cerdentials : true,)

</details>
<details>
<summary>API 설계 depth 설정 Miss</summary>

<br>

**`문제`**
Back API 초기 설계 시 API URL depth 설정에 미스가 있었으며, FE에서 API 접근이 안되는 상황이 발생하였습니다.

**`해결`**
List 전체 페이지 조회와 List 상세 페이지 조회의 URL이 다른점을 인지하였으며, API depth를 페이지에 따라 다르게 구현하였습니다.

**`조언`**
기술 매니저님의 조언으로는 listsRoutes.js 파일의 router.get의 순서를 변경하면 ERROR가 해결되는 것을 피드백 받았습니다.


</details>
<details>
<summary>CI/CD 구축</summary>
<br>

**`문제`**
첫 CI/CD 구축을 하면서 다양한 AWS IAM 인증 Error, CodeDeploy ERROR를 겪음

**`해결`**
CI/CD 구축 방법 정리
https://www.notion.so/hangjo0610/CI-CD-921bb166465a4fd2a3d2253e5715ea41?pvs=4

**`Github Action과 Jenkins 선택 과정`**
1. Jenkins보다 환경 설정 및 인프라 구축이 간단함
2. Jenkins는 Jenkins 만의 서버를 구축해야하는 불편함이 존재.
3. Jenkins가 많은 플러그인을 지원하고, 환경 변수 관련하여 커스터마이징이 다양하다는 장점이 있지만, 현재 구현 Level은 그 정도의 수준을 원하는 것이 아니기에, 보다 간편하게 구축할 수 있는 GithubAction을 채택

</details>
<details>
<summary>Nginx 구축 및 HTTPS 설정 시 ERROR</summary>
<br>

**`문제`**
AWS EC2 instance에 Nginx 설치 후 IP 주소(Port : 80) 접속 시 Nginx 초기 구성 화면이 아닌, Node Application으로 접속되는 현상이 발생하였습니다.
Node App port 설정은 3000번으로 등록되어 있는 상황이였습니다.

**`해결`**
EC2 iptable net 테이블에 80번 포트를 3000번 포트로 Redirect 시키는 정책이 추가되어 있는 점을 확인하였습니다.(Sparta EC2 초기 설정 시 강의 내역을 똑같이 따라한 점에서 문제 발생)
이러한 점을 확인하여 EC2 iptable net PREROUTING 정책을 삭제하는 코드를 확인하고, 삭제 후 정상 접속하는 것을 확인하였습니다.

</details>
<details>
<summary> 로그인, 회원가입 구축 시 JWT 토큰 관련 ERROR 발생</summary>
<br>

**`문제`**
res.cookie와 res.set으로 Token을 클라이언트에 보내지 못하는 문제점 확인

**`해결`**
1. res.cookie는 클라이언트의 경우 HTTP, 서버의 경우 HTTPS로 구축되어 있어서 Cors 설정을 아무리 변경하여도 되지 않는다는 점을 확인
(브라우저 정책으로 인해 sameSite : None으로 설정하면 secure : true로 설정해야 한다.)
2. res.set으로 Header를 통해 쿠키를 보내는 부분도 되지 않음
→ (토큰 전달이 안되는 이유를 몰라서 추후에 원인 파악 진행)
3. res.json으로 보내는 방법을 채택
→ Response로 보내고, FE 클라이언트에서 Header로 받아 인증 진행
</details>

자세한 내용은 Notion을 확인 부탁드립니다.
Notion : https://www.notion.so/hangjo0610/1-4b650011dc4046ae82411218ae6d7290

## 팀원
|이름|주특기|Github|
|----|------|-----------------------------------------|
|이준호|React|https://github.com/junho01052|
|어민규|Node.Js|https://github.com/fish-minkyu|
|박형주|Node.Js|https://github.com/Hangju0610|
