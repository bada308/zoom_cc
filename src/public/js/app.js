const msgList = document.querySelector("ul");
const msgForm = document.querySelector("#message");
const nickForm = document.querySelector("#nickname");

const frontSocket = new WebSocket(`ws://${window.location.host}`);

// type과 값을 저장한 객체를 stringify해서 return
const makeMessage = (type, payload) => {
  const msg = { type, payload };
  return JSON.stringify(msg);
};
// socket open event
frontSocket.addEventListener("open", () => {
  console.log("Connected to Server ✅");
});

// 메세지 받기 event
frontSocket.addEventListener("message", (message) => {
  const newMsg = document.createElement("li");
  newMsg.innerText = message.data;
  msgList.appendChild(newMsg);
});

// socket close event
frontSocket.addEventListener("close", () => {
  console.log("Disconnected from Server ❌");
});

// message submit
const handleSubmit = (event) => {
  event.preventDefault();
  const input = msgForm.querySelector("input");
  frontSocket.send(makeMessage("new_msg", input.value));
  input.value = "";
};

// nickname submit
const handleNickSubmit = (event) => {
  event.preventDefault();
  const input = nickForm.querySelector("input");
  frontSocket.send(makeMessage("nickname", input.value));
  input.value = "";
};

msgForm.addEventListener("submit", handleSubmit);
nickForm.addEventListener("submit", handleNickSubmit);
