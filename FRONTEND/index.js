const socket = io();
const bar = document.querySelector(".bar");
const sideBar = document.querySelector(".siderbar-container");
const closx = document.querySelector(".fa-times");
const overlay = document.querySelector(".overlay");
const chatContainer = document.querySelector(".chat-container");
const text = document.querySelector(".text");
const send = document.querySelector(".send");
const search = document.URL;
const matched = new URLSearchParams(search.match(/(\?.*)/)[1]);
const user = {
  username: matched.get("username"),
  group: matched.get("group"),
};

// SOCKET
socket.on("visit", (obj) => {
  userMessage(obj);
});
socket.emit("user", user);
// user group
document.querySelector(".group-name").innerHTML = user.group;
socket.on("users", (users) => {
  getUsers(users);
});
// if message avalaible
send.addEventListener("click", () => {
  if (text.value) {
    socket.emit("message", text.value);
    text.value = "";
    text.focus();
  }
});
socket.on("message", (message) => {
  userMessage(message);
  chatContainer.scrollTop = chatContainer.scrollHeight;
  window.scrollTo(0, document.body.clientHeight + 10);
});

// const singleMessage = (obj) => {
//   const chat = document.createElement("div");
//   chat.classList.add("chat");
//   chat.innerHTML = `
//           <p class="chat-message">
//            ${obj.message}
//           </p>
//           <p class="time">${obj.time}</p>`;
//   chatContainer.appendChild(chat);
// };
// const initSingle = (obj) => {
//   const chat = document.createElement("div");
//   const link = `<a href=single.html?user=${obj.id}>join chat</a>`;
//   chat.classList.add("chat");
//   chat.innerHTML = `<p class="name">${link}</p>
//           <p class="chat-message">
//            ${obj.message}
//           </p>
//           <p class="time">${obj.time}</p>`;
//   chatContainer.appendChild(chat);
// };
//take all user from backend
const getUsers = (users) => {
  console.log(users);
  const group = document.querySelector(".group");

  const newUser = users
    .map((user) => {
      return `<a href="single.html?${user.username}=${user.id}"><li class="user">${user.username}</li></a>`;
    })
    .join(" ");
  group.innerHTML = newUser;
};
const userMessage = (obj) => {
  const chat = document.createElement("div");
  chat.classList.add("chat");
  chat.innerHTML = `<p class="name">${obj.username ? obj.username : ""}</p>
          <p class="chat-message">
           ${obj.message}
          </p>
          <p class="time">${obj.time}</p>`;
  chatContainer.appendChild(chat);
};
const showSide = () => {
  sideBar.classList.add("show");
  overlay.classList.add("show-overlay");
};
const closeSide = () => {
  sideBar.classList.remove("show");
  overlay.classList.remove("show-overlay");
};

bar.addEventListener("click", showSide);
closx.addEventListener("click", closeSide);
