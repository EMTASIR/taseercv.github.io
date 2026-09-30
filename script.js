const reducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
);

const effectsLayer = document.createElement('div');
effectsLayer.className = 'effects-layer';
effectsLayer.setAttribute('aria-hidden', 'true');
document.body.appendChild(effectsLayer);

function addEffect(className, x, y, properties = {}) {
    if (reducedMotion.matches || effectsLayer.childElementCount >= 36) {
        return;
    }

    const effect = document.createElement('span');
    effect.className = className;
    effect.style.left = `${x}px`;
    effect.style.top = `${y}px`;

    Object.entries(properties).forEach(([name, value]) => {
        effect.style.setProperty(name, value);
    });

    effectsLayer.appendChild(effect);

    effect.addEventListener('animationend', () => {
        effect.remove();
    }, { once: true });

    // Cleanup fallback
    setTimeout(() => effect.remove(), 1400);
}

// Glow follows the mouse inside each card
document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('pointermove', event => {
        if (reducedMotion.matches || event.pointerType === 'touch') {
            return;
        }

        const bounds = card.getBoundingClientRect();

        card.style.setProperty(
            '--glow-x',
            `${event.clientX - bounds.left}px`
        );

        card.style.setProperty(
            '--glow-y',
            `${event.clientY - bounds.top}px`
        );
    });
});

// Clean expanding ripple on click/tap
document.addEventListener('click', event => {
    // Avoid a misplaced effect for keyboard-generated clicks
    if (event.detail === 0) return;

    addEffect('click-ripple', event.clientX, event.clientY);
});

// Throttled floating particles near the viewport edges
let previousScroll = window.scrollY;
let lastParticleTime = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;
    const delta = currentScroll - previousScroll;
    previousScroll = currentScroll;

    if (reducedMotion.matches || delta === 0) return;

    const now = performance.now();

    if (now - lastParticleTime < 110) return;
    lastParticleTime = now;

    const direction = delta > 0 ? -1 : 1;
    const edgeWidth = Math.min(65, window.innerWidth * 0.12);

    for (let side = 0; side < 2; side++) {
        const edgeOffset = 8 + Math.random() * edgeWidth;

        const x = side === 0
            ? edgeOffset
            : window.innerWidth - edgeOffset;

        const y = window.innerHeight * (
            0.15 + Math.random() * 0.7
        );

        addEffect('scroll-particle', x, y, {
            '--size': `${3 + Math.random() * 3}px`,
            '--drift-x': `${(Math.random() - 0.5) * 35}px`,
            '--drift-y': `${direction * (45 + Math.random() * 65)}px`
        });
    }
}, { passive: true });

reducedMotion.addEventListener('change', () => {
    if (reducedMotion.matches) {
        effectsLayer.replaceChildren();
    }
});
