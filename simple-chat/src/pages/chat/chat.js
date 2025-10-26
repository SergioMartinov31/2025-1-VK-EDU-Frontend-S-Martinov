import './header.js';
import './header.css';


import './chat_main.js';
import './chat_main.css';

const params = new URLSearchParams(window.location.search);
const userName = params.get('user');



const form = document.querySelector('form');
const input = document.querySelector('.form-input');
const message = document.querySelector('.message');
const container = document.querySelector('.message-container');
const headerName = document.querySelector('.name');

headerName.innerText = userName;


function loadMessages(showLastOnly = false) {
    let messagesList = JSON.parse(localStorage.getItem(`${userName}`)) || [];
    console.log(messagesList);
    if (showLastOnly && messagesList.length > 0){
        let item = messagesList[messagesList.length - 1]
        const messageEl = document.createElement('div');
        const messageTimeEl = document.createElement('span');
        messageEl.className = 'message';
        messageEl.innerText = item.message;

        messageTimeEl.className = "message-time";
        messageTimeEl.innerText = item.time;

        container.appendChild(messageEl);
        messageEl.appendChild(messageTimeEl);
    } else {
    messagesList.forEach((item) => {
        if (item.message !== undefined){
        const messageEl = document.createElement('div');
        const messageTimeEl = document.createElement('span');
        messageEl.className = 'message';
        messageEl.innerText = item.message;

        messageTimeEl.className = "message-time";
        messageTimeEl.innerText = item.time;

        container.appendChild(messageEl);
        messageEl.appendChild(messageTimeEl);
        }
    })
    }
}

function handleKeyPress (event) {
    if (event.keyCode === 13) {
        event.preventDefault()
        let text = input.value;
        input.value = '';

        const newMessage = {
            message: text,
            name: userName,
            time: `23:41`
        };
        const messagesList = JSON.parse(localStorage.getItem(`${userName}`)) || [];
        messagesList.push(newMessage);
        localStorage.setItem(`${userName}`, JSON.stringify(messagesList));
        form.dispatchEvent(new Event('submit'));
    }
}

function handleSubmit (event) {
    event.preventDefault();
    loadMessages(true);
}

form.addEventListener('submit', handleSubmit);
form.addEventListener('keypress',  handleKeyPress);

container.innerHTML = '';
loadMessages(false);