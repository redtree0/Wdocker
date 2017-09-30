# Wave

Wave는 웹 기반 원격 Docker 관리 도구입니다.
웹으로 다음 컨텐츠들을 관리할 수 있습니다.
- 컨테이너
- 네트워크
- 이미지
- 볼륨
- 스웜 & 노드
- 서비스
- 테스크

### 1.2.1. 장점
	1. 간결하다.
	2. 별도의 도구없이 작성가능하다.
	3. 다양한 형태로 변환이 가능하다.
	3. 텍스트(Text)로 저장되기 때문에 용량이 적어 보관이 용이하다.
	4. 텍스트파일이기 때문에 버전관리시스템을 이용하여 변경이력을 관리할 수 있다.
	5. 지원하는 프로그램과 플랫폼이 다양하다.
OS
HypriotOS

H/W
라즈베리파이3

mongoDB 설치

<code>
   sudo apt-get install -y mongodb
</code>

<code>
  sudo mkdir /var/lib/mongodb/data
  sudo mkdir /var/lib/mongodb/log  
</code>

mongoDB 실행

<code>
sudo mongod --fork --dbpath /var/lib/mongodb/data --logpath /var/lib/mongodb/log/log.txt
</code>


Node.js 설치

<code>
  curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash - sudo apt-get install -y nodejs
</code>

<code>
   npm install
</code>
<code>
  openssl genrsa 1024 > key.pem  
  sudo bash -c "openssl genrsa 1024 > key.pem"

  openssl req -x509 -new -key key.pem > cert.pem
  sudo bash -c "openssl req -x509 -new -key key.pem > cert.pem"   
</code>

<code>
 npm install -g webpack
 webpack
 cd app
 sudo node index.js
</code>

시연 영상

[![IMAGE ALT TEXT HERE](https://img.youtube.com/vi/c-Oy501Wf6A&feature=youtu.be/0.jpg)](https://www.youtube.com/watch?v=c-Oy501Wf6A&feature=youtu.be)
