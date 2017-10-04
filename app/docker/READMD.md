
#docker tls 디렉토리
ca.pem, cert.pem, key.pem 파일을 sftp로 Wave 서버에 옮긴다.
Wave서버에 "Wave 경로 설치 경로"/app/docker/$HOST에 넣는다.

ex)
 - 192.168.0.100에 dokcer daemon tls 설정
 - wave 메인 서버 /app/docker/192.168.0.100 디렉토리 생성
 - 192.168.0.100에 있는 ca.pem, cert.pem, key.pem 파일을 wave 메인서버에 ftp 서비스로 넣는다.
