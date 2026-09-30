// Toggle button interactive logic
const toggleBtn = document.querySelector('.toggle-btn');
toggleBtn.addEventListener('click', () => {
    // Basic interaction feedback
    console.log("Theme switched!");
});

// Simple animation trigger (optional)
document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transition = 'opacity 0.5s ease';
        setTimeout(() => {
            card.style.opacity = '1';
        }, index * 200);
    });
});