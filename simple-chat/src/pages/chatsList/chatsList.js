import './chatsList.css';
import './chatsList_header.css';
import './chatsList_edit-btn.css';
import './chatsList_edit-btn.js'






function loadChats() {
    const chatsContainer = document.querySelector('.chatsList'); // куда вставлять чаты
    chatsContainer.innerHTML = ''; // очищаем старое

    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const chatData = JSON.parse(localStorage.getItem(key)) || [{}];
        console.log(chatData);  


        // пропускаем если данные не похожи на чат
        // if (!chatData || !chatData.name || !chatData.lastMsg) continue;

        // создаём элементы
        const chatEl = document.createElement('div');
        chatEl.className = 'list-item';
        chatEl.dataset.user = key;
        console.log("я:", key);


        chatEl.addEventListener('click', () => {
            window.location.href = `chat.html?user=${encodeURIComponent(key)}`;
        });

        const imgEl = document.createElement('img');
        imgEl.className = 'list-item__img';
        imgEl.src = chatData.avatar || '/avatar.svg';
        imgEl.width = 100;
        imgEl.height = 100;

        const infoEl = document.createElement('div');
        infoEl.className = 'list-item__info';

        const middleContainer = document.createElement('div');
        middleContainer.className = 'middle-container';

        const nameEl = document.createElement('span');
        nameEl.className = 'name';
        nameEl.innerText = key;

        const lastMsgEl = document.createElement('span');
        lastMsgEl.className = 'last-msg';
        lastMsgEl.innerText = chatData[chatData.length - 1].message || '~ сообщений нет ~';

        const endContainer = document.createElement('div');
        endContainer.className = 'end-container';

        const timeEl = document.createElement('span');
        timeEl.className = 'time-msg';
        timeEl.innerText =chatData[chatData.length - 1].time || '-';

        const counterEl = document.createElement('div');
        counterEl.className = 'msg-counter';

        const counterTextEl = document.createElement('span');
        counterTextEl.className = 'msg-counter__text';
        counterTextEl.innerText = chatData.count || 0;

        // склеиваем структуру
        chatsContainer.appendChild(chatEl);
        chatEl.appendChild(imgEl);
        chatEl.appendChild(infoEl);

        infoEl.appendChild(middleContainer);
        middleContainer.appendChild(nameEl);
        middleContainer.appendChild(lastMsgEl);

        infoEl.appendChild(endContainer);
        endContainer.appendChild(timeEl);
        endContainer.appendChild(counterEl);
        counterEl.appendChild(counterTextEl);
        
    }
}


loadChats();