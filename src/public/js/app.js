const frontSocket = io();

const myFace = document.querySelector("#myFace");
const muteBtn = document.querySelector("#mute");
const cameraBtn = document.querySelector("#camera");
const cameraSelect = document.querySelector("#cameras");
const call = document.querySelector("#call");

call.hidden = true;

let myStream;
let muted = false;
let cameraOff = false;
let roomName = "";
let myPeerConnection;

// media

async function getCamera() {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const cameras = devices.filter((device) => device.kind === "videoinput");
    const currentCamera = myStream.getVideoTracks()[0];
    cameras.forEach((camera) => {
      const option = document.createElement("option");
      option.value = camera.deviceId;
      option.innerText = camera.label;
      if (currentCamera.label === camera.label) {
        option.selected = true;
      }
      cameraSelect.appendChild(option);
    });
  } catch (e) {
    console.log(e);
  }
}

async function getMedia(deviceId) {
  const initialConstrains = {
    audio: true,
    video: { facingMode: "user" },
  };
  const cameraConstraints = {
    audio: true,
    video: { deviceId: { exact: deviceId } },
  };
  try {
    myStream = await navigator.mediaDevices.getUserMedia(
      deviceId ? cameraConstraints : initialConstrains
    );
    myFace.srcObject = myStream;
    if (!deviceId) {
      await getCamera();
    }
  } catch (e) {
    console.log(e);
  }
}

getMedia();

// handle Function

const handleClickMute = () => {
  myStream
    .getAudioTracks()
    .forEach((track) => (track.enabled = !track.enabled));
  if (!muted) {
    muteBtn.innerText = "Unmute";
    muted = true;
  } else {
    muteBtn.innerText = "Mute";
    muted = false;
  }
};

const handleClickCamera = () => {
  myStream
    .getVideoTracks()
    .forEach((track) => (track.enabled = !track.enabled));
  if (!cameraOff) {
    cameraBtn.innerText = "Turn Camera Off";
    cameraOff = true;
  } else {
    cameraBtn.innerText = "Turn Camera On";
    cameraOff = false;
  }
};

async function handleCameraChange() {
  await getMedia(cameraSelect.value);
}

muteBtn.addEventListener("click", handleClickMute);
cameraBtn.addEventListener("click", handleClickCamera);
cameraSelect.addEventListener("input", handleCameraChange);

// Welcome Form (join a room)

const welcome = document.querySelector("#welcome");
const welcomeForm = welcome.querySelector("form");

async function initCall() {
  welcome.hidden = true;
  call.hidden = false;
  await getMedia();
  makeConnection();
}

async function handleWelcomeSubmit(event) {
  event.preventDefault();
  const input = welcomeForm.querySelector("input");
  roomName = input.value;
  await initCall();
  frontSocket.emit("join_room", roomName);
  input.value = "";
}

welcomeForm.addEventListener("submit", handleWelcomeSubmit);

// Socket Code
frontSocket.on("welcome", async () => {
  const offer = await myPeerConnection.createOffer();
  myPeerConnection.setLocalDescription(offer);
  frontSocket.emit("offer", offer, roomName);
  console.log("sent the offer");
});

frontSocket.on("offer", async (offer) => {
  console.log("received the offer");
  myPeerConnection.setRemoteDescription(offer);
  const answer = await myPeerConnection.createAnswer();
  myPeerConnection.setLocalDescription(answer);
  frontSocket.emit("answer", answer, roomName);
  console.log("sent the answer");
});

frontSocket.on("answer", (answer) => {
  console.log("received the answer");
  myPeerConnection.setRemoteDescription(answer);
});

frontSocket.on("ice", (ice) => {
  console.log("received candidate");
  myPeerConnection.addIceCandidate(ice);
});

// RTC Code
function makeConnection() {
  myPeerConnection = new RTCPeerConnection();
  myPeerConnection.addEventListener("icecandidate", handleIce);
  myPeerConnection.addEventListener("addstream", handleAddStream);
  myStream
    .getTracks()
    .forEach((track) => myPeerConnection.addTrack(track, myStream));
}

function handleIce(data) {
  console.log("sent the candidate");
  frontSocket.emit("ice", data.candidate, roomName);
}

function handleAddStream(data) {
  const peerFace = document.querySelector("#peerFace");
  peerFace.srcObject = data.stream;
}
