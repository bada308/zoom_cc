const frontSocket = io();

const welcome = document.querySelector("#welcome");
const welForm = welcome.querySelector("form");
const room = document.querySelector("#room");

// 방에 참가하기 전에 room div 숨기기
room.hidden = true;
let roomName;

const addMessage = (message) => {
  const ul = room.querySelector("ul");
  const li = document.createElement("li");
  li.innerText = message;
  ul.appendChild(li);
};

const showRoom = () => {
  welcome.hidden = true;
  room.hidden = false;
  const h3 = room.querySelector("h3");
  h3.innerText = `Room : ${roomName}`;
};

welForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const input = welForm.querySelector("input");
  roomName = input.value;
  frontSocket.emit("enter_room", input.value, showRoom);
  input.value = "";
});

frontSocket.on("welcome", () => {
  addMessage("Someone joined!");
});
