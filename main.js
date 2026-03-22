document.addEventListener('DOMContentLoaded', () => {
    // 1. Current Year in Footer
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // 2. Header Scroll Effect
    const header = document.getElementById('header');
    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;

        // Add blur and shadow background when scrolled
        if (currentScrollY > 50) {
            header.style.boxShadow = '0 10px 30px rgba(0,0,0,0.03)';
            header.style.background = 'rgba(255, 255, 255, 0.9)';
        } else {
            header.style.boxShadow = 'none';
            header.style.background = 'rgba(255, 255, 255, 0.8)';
        }

        lastScrollY = currentScrollY;
    }, { passive: true });

    // 3. Simple & Elegant Revealer
    const revealOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, revealOptions);

    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // 4. IT Particles / Sparkles effect for #moving-bg
    const bg = document.getElementById('moving-bg');
    if (bg) {
        // Create 35 subtle sparkles
        for(let i=0; i<35; i++) {
            let sp = document.createElement('div');
            sp.className = 'sparkle';
            // Random horizontal position
            sp.style.left = (Math.random() * 100) + 'vw';
            // Random varied duration between 8s and 20s
            sp.style.animationDuration = (Math.random() * 12 + 8) + 's';
            // Random delay to stagger the start
            sp.style.animationDelay = (Math.random() * 10) + 's';
            
            // Random slightly different sizes
            const size = Math.random() * 4 + 3;
            sp.style.width = size + 'px';
            sp.style.height = size + 'px';

            bg.appendChild(sp);
        }
    }
});
