const socket = io();

let fullname;
// let roomid;
let textarea = document.querySelector('#textarea');
let btn = document.querySelector('#btn');

let messagearea = document.querySelector('.message-area');

function insound() {

  var audio = new Audio("/inmsg.mp3");
  audio.play();

  // audio.loop = false;

}
function outsound() {

  var audio = new Audio("/outmsg.mp3");
  audio.play();
  // audio.loop = false;

}

let pass = "adgaur";
function func1(id) {
  while (id != pass)
    id = prompt("The roomid you entered is invalid Try again");
}

do {
  fullname = prompt('Please enter your name');
  roomid = prompt('Please enter the Roomid ');
  func1(roomid);
}
while (!fullname);


textarea.addEventListener('keyup', (e) => {
  if (e.key === "Enter") {
    sendmessage(e.target.value);
  }

});

btn.addEventListener('click', (e) => {
  e.preventDefault();
  sendmessage(textarea.value);
})

function sendmessage(messg) {
  let msg = {
    user: fullname,
    message: messg.trim()
  }

  outsound();

  appendmessage(msg, 'outgoing')
  textarea.value = '';


  socket.emit('message', msg)




}

function appendmessage(msg, type) {
  let maindiv = document.createElement('div');
  let classname = type;
  maindiv.classList.add(classname, 'message')

  let markup =
    `<h4>${msg.user}</h4>
    <p>${msg.message}</p>`

  maindiv.innerHTML = markup;
  messagearea.appendChild(maindiv);
}

socket.on('message', (msg) => {
  console.log(msg);
  appendmessage(msg, 'incoming');
  insound();
})