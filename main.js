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

// ===== Shared: hamburger menu / scroll progress / spotlight =====
(function () {
    const root = document.documentElement;
    const btn = document.getElementById('menu-btn');
    if (btn) {
        const setOpen = (open) => {
            root.classList.toggle('menu-open', open);
            btn.setAttribute('aria-expanded', open);
            btn.setAttribute('aria-label', open ? 'メニューを閉じる' : 'メニューを開く');
        };
        btn.addEventListener('click', () => setOpen(!root.classList.contains('menu-open')));
        document.querySelectorAll('.gnav a').forEach(a => a.addEventListener('click', () => setOpen(false)));
        document.addEventListener('keydown', e => { if (e.key === 'Escape') setOpen(false); });
        window.addEventListener('resize', () => { if (window.innerWidth > 768) setOpen(false); });
    }

    const bar = document.createElement('div');
    bar.className = 'scroll-progress';
    bar.setAttribute('aria-hidden', 'true');
    document.body.appendChild(bar);
    let ticking = false;
    const update = () => {
        const max = root.scrollHeight - window.innerHeight;
        bar.style.transform = 'scaleX(' + (max > 0 ? Math.min(window.scrollY / max, 1) : 0) + ')';
        ticking = false;
    };
    window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    update();

    // Mouse-follow light on cards (.spot)
    if (window.matchMedia('(hover: hover)').matches) {
        document.querySelectorAll('.spot').forEach(el => {
            el.addEventListener('pointermove', e => {
                const r = el.getBoundingClientRect();
                el.style.setProperty('--mx', (e.clientX - r.left) + 'px');
                el.style.setProperty('--my', (e.clientY - r.top) + 'px');
            });
        });
    }
})();

// ===== Network animation for <canvas class="net-canvas" data-tone="light|dark"> =====
(function () {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.querySelectorAll('canvas.net-canvas').forEach(cv => {
        const ctx = cv.getContext && cv.getContext('2d');
        if (!ctx) return;
        const dark = cv.dataset.tone === 'dark';
        const line = dark ? '120,190,255' : '0,82,255';
        const dot = dark ? 'rgba(140,200,255,.6)' : 'rgba(0,82,255,.42)';
        const host = cv.parentElement;
        let w, h, pts = [], raf = null, visible = true;
        const mouse = { x: -9999, y: -9999 };
        function resize() {
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            w = cv.clientWidth; h = cv.clientHeight;
            cv.width = w * dpr; cv.height = h * dpr;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            const n = Math.min(w < 768 ? 34 : 80, Math.round(w * h / 15000));
            pts = Array.from({ length: n }, () => ({ x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - .5) * .35, vy: (Math.random() - .5) * .35, r: Math.random() * 1.6 + .8 }));
        }
        function frame() {
            ctx.clearRect(0, 0, w, h);
            const max = w < 768 ? 110 : 150;
            for (let i = 0; i < pts.length; i++) {
                const p = pts[i];
                p.x += p.vx; p.y += p.vy;
                if (p.x < 0 || p.x > w) p.vx *= -1;
                if (p.y < 0 || p.y > h) p.vy *= -1;
                for (let j = i + 1; j < pts.length; j++) {
                    const q = pts[j], dx = p.x - q.x, dy = p.y - q.y, d = Math.sqrt(dx * dx + dy * dy);
                    if (d < max) { ctx.strokeStyle = 'rgba(' + line + ',' + ((dark ? .22 : .14) * (1 - d / max)) + ')'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke(); }
                }
                const mx = p.x - mouse.x, my = p.y - mouse.y, md = Math.sqrt(mx * mx + my * my);
                if (md < 190) { ctx.strokeStyle = 'rgba(43,193,255,' + (0.4 * (1 - md / 190)) + ')'; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke(); }
                ctx.fillStyle = dot;
                ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
            }
            raf = (visible && !reduce) ? requestAnimationFrame(frame) : null;
        }
        resize(); frame();
        let rt; window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => { resize(); if (!raf) frame(); }, 150); });
        host.addEventListener('pointermove', e => { const r = cv.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; });
        host.addEventListener('pointerleave', () => { mouse.x = mouse.y = -9999; });
        new IntersectionObserver(es => { visible = es[0].isIntersecting && !document.hidden; if (visible && !raf && !reduce) frame(); }).observe(host);
        document.addEventListener('visibilitychange', () => { visible = !document.hidden; if (visible && !raf && !reduce) frame(); });
    });
})();
