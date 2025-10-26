import './index.css';
// Установи картинку после загрузки DOM
document.addEventListener('DOMContentLoaded', function() {
    const img = document.querySelector('img[alt="attach file"]');
    if (img) {
        img.src = attachmentIcon;
    }
});