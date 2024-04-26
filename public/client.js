let fullname;
let textarea = document.querySelector('#textarea');
let btn = document.querySelector('#btn');
let messagearea = document.querySelector('.message-area');

function insound() {
  var audio = new Audio("/inmsg.mp3");
  audio.play();
}

function outsound() {
  var audio = new Audio("/outmsg.mp3");
  audio.play();
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

const ably = new Ably.Realtime('URT3Fg.GHgyhQ:j1nh_Z3iQeTl0JYO_wlcXwz-H1FR6Fz0Lc-IIlBPFYE');
const channel = ably.channels.get('chat');

textarea.addEventListener('keyup', (e) => {
  if (e.key === "Enter") {
    sendmessage(e.target.value);
  }
});

btn.addEventListener('click', (e) => {
  e.preventDefault();
  sendmessage(textarea.value);
});

function appendmessage(msg, type) {
  let maindiv = document.createElement('div');
  let classname = type;
  maindiv.classList.add(classname, 'message');

  let markup =
    `<h4>${msg.user}</h4>
    <p>${msg.message}</p>`;

  maindiv.innerHTML = markup;
  messagearea.appendChild(maindiv);

  // Scroll to the bottom of the message area
  messagearea.scrollTop = messagearea.scrollHeight;
}

function sendmessage(messg) {
  let msg = {
    user: fullname,
    message: messg.trim()
  };

  outsound();

  appendmessage(msg, 'outgoing');
  textarea.value = '';

  channel.publish('message', msg);
}



channel.subscribe('message', (msg) => {
  console.log(msg.data);
  if (msg.data.user != fullname) {
    appendmessage(msg.data, 'incoming');
    insound();
  }
});
