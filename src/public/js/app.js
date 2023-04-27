const frontSocket = io();

const welcome = document.querySelector("#welcome");
const welForm = welcome.querySelector("form");

const room = document.querySelector("#room");
const nameForm = room.querySelector("#name");
const msgForm = room.querySelector("#msg");

// 방에 참가하기 전에 room div 숨기기
room.hidden = true;
let nickName = "Anon";
let roomName;

/**
 * 메세지를 받아 room div ul에 li로 추가한다
 *
 * @param {string} message 문자열 타입의 메세지
 * @returns {void}
 */
const addMessage = (message) => {
  const ul = room.querySelector("ul");
  const li = document.createElement("li");
  li.innerText = message;
  ul.appendChild(li);
};

// handle function

/**
 * welcome div 내의 form에서 submit 이벤트가 발생하면 "enter_room" 소캣 이벤트를 발생시킨다
 * showRoom 함수를 실행시킨다.
 * 전역변수 roomName의 값을 사용자가 입력한 input.value로 설정한다.
 *
 *
 * @param {object} event 발생한 이벤트를 설명하는 Event 기반 객체
 * @returns {void}
 */
const handleWelcomeSubmit = (event) => {
  event.preventDefault();
  const input = welForm.querySelector("input");
  roomName = input.value;
  frontSocket.emit("enter_room", input.value, showRoom);
  input.value = "";
};

/**
 * room div 내의 name form에서 submit 이벤트가 발생하면 "nickname" 소캣 이벤트를 발생시킨다
 *
 * @param {object} event 발생한 이벤트를 설명하는 Event 기반 객체
 * @returns {void}
 */
const handleNicknameSubmit = (event) => {
  event.preventDefault();
  const input = nameForm.querySelector("input");
  nickName = input.value;
  frontSocket.emit("nickname", input.value);
  input.value = "";
};

/**
 * room div 내의 msg form에서 submit 이벤트가 발생하면 "new_message" 소캣 이벤트를 발생시킨다
 * addMessage 함수를 실행시키고 매개변수로 사용자가 입력한 값을 넘긴다. -> 엄밀히 말하면 "실행 버튼을 누르는 건" 서버 측, 함수를 실행하는 건 클라이언트 측
 *
 * @param {object} event
 * @returns {void}
 */
const handleMessageSubmit = (event) => {
  event.preventDefault();
  const input = msgForm.querySelector("input");
  const value = input.value;
  frontSocket.emit("new_message", value, roomName, () => {
    addMessage(`You: ${value}`);
  });
  input.value = "";
};

/**
 * welcome div의 hidden을 활성화하고 room div의 hidden을 헤제한다.
 * room div 내의 h3의 값을 전역변수 roomName으로 설정한다.
 *
 * @param {void}
 * @returns {void}
 */
const showRoom = () => {
  welForm.hidden = true;
  room.hidden = false;
  const h3 = room.querySelector("h3");
  h3.innerText = `Room : ${roomName}`;
};

// addEventListener
welForm.addEventListener("submit", handleWelcomeSubmit);
msgForm.addEventListener("submit", handleMessageSubmit);
nameForm.addEventListener("submit", handleNicknameSubmit);

// socket on
frontSocket.on("welcome", (user, newCount) => {
  const h3 = room.querySelector("h3");
  h3.innerText = `Room : ${roomName} (${newCount})`;
  addMessage(`${user} arrived!`);
});

frontSocket.on("bye", (user, newCount) => {
  const h3 = room.querySelector("h3");
  h3.innerText = `Room : ${roomName} (${newCount})`;
  addMessage(`${user} left..`);
});
frontSocket.on("new_message", addMessage);
frontSocket.on("room_change", (rooms) => {
  const roomList = welcome.querySelector("ul");
  roomList.innerHTML = "";
  rooms.forEach((room) => {
    const li = document.createElement("li");
    li.innerText = room;
    roomList.appendChild(li);
  });
});
