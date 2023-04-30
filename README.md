# Noom

Zoom Clone using NodeJS, WebRTC and Websockets.

3. Video Call

- 유저로부터 비디오를 가져와 화면에 비디오를 보여준다
- 마이크 음소거/음소거 해제, 카메라 on/off 버튼 생성
- 전면 후면 카메라 전환 기능 구현

playsinline 속성
: 모바일 유저를 위한 속성, 비디오를 실행할 때 전체화면이 되지 않게 해준다.

navigator.mediaDevices.getUserMedia
: 유저의 유저미디어 string 반환
