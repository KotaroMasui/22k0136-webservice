
// public/index.js
window.addEventListener('DOMContentLoaded', (event) => {
    document.querySelectorAll('.item-name').forEach((elem) => {
        elem.addEventListener('click', (event) => {
            alert(event.target.innerHTML);
        });
    });

    document.querySelector('.send-button').addEventListener('click', (event) => {
        const name = document.querySelector('#name').value;
        const quantity = document.querySelector('#quantity').value;
        fetch('/api/item', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: name, quantity: parseInt(quantity, 10) }) })
    });
});
