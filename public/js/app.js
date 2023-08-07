const socket = io();

const form = document.querySelector("form");
const input = document.querySelector("input");

const nickname = prompt("What's your nickname?");
socket.emit("client-nickname", nickname);

form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!input.value) return;
  socket.emit("client-message", input.value);
  input.value = "";
});

socket.on("server-message", (msg) => {
  const messageContainer = document.querySelector(".messages");
  const myMessage = document.createElement("div");
  myMessage.textContent = `${msg.nickname} : ${msg.message}`;
  messageContainer.appendChild(myMessage);
});

document.addEventListener("mousemove", (e) => {
  socket.emit("client-mousemove", { id: socket.id, x: e.clientX, y: e.clientY });
});

socket.on("server-mousemove", (mouse) => {
  if (!mouse.pos.id) return;

  // console.log(`[${mouse.pos.id}] ${mouse.nickname} : ${mouse.pos.x}, ${mouse.pos.y}`);
  const mousesContainer = document.querySelector(".mouses-container");

  const currentMouse = mousesContainer.querySelector(`.mouse#${mouse.pos.id}`);

  if (mouse.pos.id === socket.id) return;

  if (!currentMouse) {
    const mouseDiv = document.createElement("div");
    mouseDiv.textContent = mouse.nickname;
    mouseDiv.id = mouse.pos.id;
    mouseDiv.classList.add("mouse");
    mouseDiv.style.top = `${mouse.pos.y}px`;
    mouseDiv.style.left = `${mouse.pos.x}px`;
    mousesContainer.appendChild(mouseDiv);
  } else {
    currentMouse.style.top = `${mouse.pos.y}px`;
    currentMouse.style.left = `${mouse.pos.x}px`;
  }

  /*
  const mouses = mousesContainer.querySelectorAll(".mouse");
  mouses.forEach((element) => {
    if (!mouse.pos.id) return;

    if (element.id === mouse.pos.id) {
      element.style.top = `${mouse.pos.y}px`;
      element.style.left = `${mouse.pos.x}px`;
    } else {
      const mouseDiv = document.createElement("div");
      mouseDiv.id = mouse.pos.id;
      mouseDiv.classList.add("mouse");
      mouseDiv.style.top = `${mouse.pos.y}px`;
      mouseDiv.style.left = `${mouse.pos.x}px`;
      mousesContainer.appendChild(mouseDiv);
    }
  });
  */
});
