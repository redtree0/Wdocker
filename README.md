# Wave

<hr/>

## 1. Wave 소개

### 1.1. Wave 란?
Wave는 웹 기반 원격 Docker 관리 도구입니다.
웹으로 다음 컨텐츠들을 관리할 수 있습니다.
- 컨테이너
- 네트워크
- 이미지
- 볼륨
- 스웜 & 노드
- 서비스
- 테스크

### 1.2. 장점
	1. 기존 도커의 기능을 웹으로 관리할 수 있다.
	2. 원격 호스트에 있는 도커들을 하나의 웹으로 관리할 수 있다.
	3. Docker Swarm를 Drag & Drop으로 관리할 수 있다.

<hr/>

## 2. 개발 환경

### 2.1. H/W
 서버 - 라즈베리파이3

### 2.2. OS
 OS - HypriotOS
  - 라즈베리파이에 Docker 운영을 위한 OS
 링크: [HypriotOS][HypriotOS]
 [HypriotOS]: https://blog.hypriot.com/downloads/

### 2.3. 데이터베이스
 데이터베이스 - mongoDB
<pre>
 # mongoDB 설치
 sudo apt-get install -y mongodb

 sudo mkdir /var/lib/mongodb/data
 sudo mkdir /var/lib/mongodb/log  

 # mongoDB 실행
 sudo mongod --fork --dbpath /var/lib/mongodb/data --logpath /var/lib/mongodb/log/log.txt
</pre>

### 2.4. Node.js


<pre>
 # Node.js 설치
 curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash - sudo apt-get install -y nodejs
</pre>


### 2.5. git
<pre>
 sudo apt-get install -y git
</pre>

### 2.6. Wave

<pre>
 # Wave 설치
 git clone https://github.com/redtree0/Wdocker.git
 sudo chmod -R 744 Wdocker/ # 파일 권한 설정

 cd Wdocker
 npm install --production # npm 설치

 sudo npm install -g webpack
 webpack
</pre>

### 2.7. Https 설정을 위한 키 생성

<pre>
  openssl genrsa 1024 > key.pem   # key 생성
  openssl req -x509 -new -key key.pem > cert.pem

  # permition defined 뜰 경우 다음과 같이 수행
	sudo bash -c "openssl genrsa 1024 > key.pem"
  sudo bash -c "openssl req -x509 -new -key key.pem > cert.pem"  
 # 위 내용을 수행하는 쉘 스크립트
 ./makeHttpsKey.sh
</pre>

### 2.8. X11 및 VNC 서버 설정

<pre>

 # x11 설정
 sudo curl -sSL https://github.com/hypriot/x11-on-HypriotOS/raw/master/install-x11-basics.sh | bash

 # 완료 후 재부팅
 sudo reboot
</pre>

링크: [x11-on-HypriotOS][x11-on-HypriotOS]
[x11-on-HypriotOS]: https://github.com/hypriot/x11-on-HypriotOS


<pre>
 # VNC 서버 설정
 sudo apt-get install -y tightvncserver
 vncserver
</pre>

### 2.9. Wave 실행

<pre>
 cd app
 sudo node index.js # wave 서비스 실행
</pre>


### 2.10. 원격 호스트 Docker TLS 설정

<pre>
	openssl genrsa -aes256 -out ca-key.pem 4096

	openssl req -new -x509 -days 365 -key ca-key.pem -sha26 -out ca.pem

	openssl genrsa -out server-key.pem 4096

	openssl req -subj "/CN=$HOST" -sha256 -new -key server-key.pem -out server.csr
	# $HOST = 호스트 IP

	echo subjectAltName = IP:$HOST,IP:127.0.0.1 > extfile.cnf
	# $HOST = 호스트 IP

	openssl x509 -req -days 365 -sha256 -in server.csr -CA ca.pem -CAkey ca-key.pem -CAcreateserial -out server-cert.pem -extfile extfile.cnf

	openssl genrsa -out key.pem 4096
	openssl req -subj '/CN=client' -new -key key.pem -out client.csr
	echo extendedKeyUsage = clientAuth > extfile.cnf

	openssl x509 -req -days 365 -sha256 -in client.csr -CA ca.pem -CAkey ca-key.pem -CAcreateserial -out cert.pem -extfile extfile.cnf

	sudo rm -v client.csr server.csr
	chmod -v 0400 ca-key.pem key.pem server-key.pem
	chmod -v 0444 ca.pem server-cert.pem cert.pem

	service docker stop
	# docker tls daemon 실행
	dockerd --tlsverify --tlscacert=ca.pem --tlscert=server-cert.pem --tlskey=server-key.pem -H=0.0.0.0:2376

  # ca.pem, cert.pem, key.pem 파일을 sftp로 Wave 서버에 옮긴다.
	# Wave서버에 "Wave 경로 설치 경로"/app/docker/$HOST에 넣는다.
</pre>
링크: [docker TLS 설정][docker-tls]
[docker-tls]: https://docs.docker.com/engine/security/https/


<hr/>
## 3. 데모 영상

[![IMAGE ALT TEXT HERE](https://img.youtube.com/vi/c-Oy501Wf6A&feature=youtu.be/0.jpg)](https://www.youtube.com/watch?v=c-Oy501Wf6A&feature=youtu.be)
