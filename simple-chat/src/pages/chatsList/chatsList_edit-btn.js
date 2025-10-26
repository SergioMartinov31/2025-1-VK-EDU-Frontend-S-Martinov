const editBtn = document.querySelector('.edit-btn');
const modalAddNewChat = document.querySelector('.add-chat-modal');
const input = document.querySelector('#username-input');
const createBtn = document.querySelector('#create-chat-btn')
const cancelBtn = document.querySelector('#cancel-btn')



editBtn.addEventListener('click', () => {
    modalAddNewChat.classList.toggle('hidden');
})

createBtn.addEventListener('click', () => {
    const userName = input.value.trim();
    input.value = '';
    localStorage.setItem(userName,  JSON.stringify([{}]));
    document.querySelector('.add-chat-modal').classList.add('hidden');
    
})

cancelBtn.addEventListener('click', () =>{
     modalAddNewChat.classList.toggle('hidden');
})

