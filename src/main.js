document.addEventListener("DOMContentLoaded", () => {
    // 1. Инициализация иконок и скролла
    lucide.createIcons();

    const lenis = new Lenis({
        smooth: true,
        lerp: 0.1
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // 2. Инициализация секций
    initThreeJS();
    initGSAP();
    initMobileMenu();
    initForm();
    initCookies();
});

// --- THREE.JS HERO ---
function initThreeJS() {
    const container = document.getElementById('canvas-container');
    if (!container) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xF3F3F1);
    scene.fog = new THREE.Fog(0xF3F3F1, 10, 50);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 30;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const geometry = new THREE.BufferGeometry();
    const count = 1500;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) {
        positions[i] = (Math.random() - 0.5) * 40;
    }
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
        color: 0x111111,
        size: 0.15,
        transparent: true,
        opacity: 0.7
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    let mouseX = 0;
    let mouseY = 0;
    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    });

    const clock = new THREE.Clock();
    function animate() {
        requestAnimationFrame(animate);
        const elapsedTime = clock.getElapsedTime();
        particles.rotation.y = elapsedTime * 0.05;
        particles.rotation.x = mouseY * 0.1;
        particles.rotation.y += mouseX * 0.1;
        renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

// --- GSAP ANIMATIONS ---
function initGSAP() {
    gsap.registerPlugin(ScrollTrigger);

    // Hero Text
    gsap.from(".reveal-text", {
        y: 100,
        opacity: 0,
        duration: 1.2,
        stagger: 0.15,
        ease: "power3.out",
        delay: 0.5
    });

    gsap.from(".reveal-text-delay", {
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out",
        delay: 1.2
    });

    // Платформа (Каждая карточка отдельно)
    gsap.utils.toArray('.platform__card').forEach((card) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: "top 85%"
            },
            y: 50,
            opacity: 0,
            duration: 0.8,
            ease: "power2.out"
        });
    });

    // Инновации (Список)
    gsap.utils.toArray('.innovations__list li').forEach((item, i) => {
        gsap.from(item, {
            scrollTrigger: {
                trigger: item,
                start: "top 90%"
            },
            x: -30,
            opacity: 0,
            duration: 0.6,
            delay: i * 0.1
        });
    });

    // Картинка Инноваций
    const imgWrapper = document.querySelector('.image-reveal-wrapper');
    const img = document.querySelector('.innovations__img');

    if (imgWrapper && img) {
        gsap.set(imgWrapper, { clipPath: "inset(100% 0 0 0)" });
        gsap.to(imgWrapper, {
            clipPath: "inset(0% 0 0 0)",
            duration: 1.5,
            ease: "power4.out",
            scrollTrigger: {
                trigger: ".innovations",
                start: "top 75%",
                end: "top 20%",
                scrub: 1
            }
        });
        gsap.to(img, {
            scale: 1,
            scrollTrigger: {
                trigger: ".innovations",
                start: "top 75%",
                scrub: 1
            }
        });
    }

    // Блог (Каждая карточка отдельно)
    gsap.utils.toArray('.blog__card').forEach((card) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: "top 85%"
            },
            y: 60,
            opacity: 0,
            duration: 0.8,
            ease: "power2.out"
        });
    });
}

// --- MOBILE MENU ---
function initMobileMenu() {
    const burger = document.querySelector('.header__burger');
    const menu = document.querySelector('.mobile-menu');
    const header = document.querySelector('.header');
    const links = document.querySelectorAll('.mobile-menu__link');

    let isOpen = false;

    const toggle = () => {
        isOpen = !isOpen;
        if (isOpen) {
            menu.classList.add('active');
            header.classList.add('menu-open');
            gsap.to(links, {
                y: 0,
                opacity: 1,
                duration: 0.5,
                stagger: 0.1,
                delay: 0.3,
                ease: "power2.out"
            });
        } else {
            menu.classList.remove('active');
            header.classList.remove('menu-open');
            gsap.to(links, {
                y: 20,
                opacity: 0,
                duration: 0.3
            });
        }
    };

    if(burger) {
        burger.addEventListener('click', toggle);
        links.forEach(link => link.addEventListener('click', toggle));
    }
}

// --- FORM HANDLING (ИСПРАВЛЕНО) ---
function initForm() {
    const form = document.getElementById('main-form');
    const successMsg = document.getElementById('form-success');
    
    if (!form || !successMsg) return;

    // Генерация капчи
    const n1 = Math.floor(Math.random() * 10);
    const n2 = Math.floor(Math.random() * 10);
    const sum = n1 + n2;
    const captchaLabel = document.getElementById('captcha-label');
    if(captchaLabel) captchaLabel.textContent = `Сколько будет ${n1} + ${n2}?`;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const phone = document.getElementById('phone');
        const captcha = document.getElementById('captcha');
        const phoneError = document.getElementById('phone-error');
        const captchaError = document.getElementById('captcha-error');
        
        let isValid = true;

        // Валидация
        if (!/^\d+$/.test(phone.value)) {
            if(phoneError) phoneError.classList.add('visible');
            isValid = false;
        } else {
            if(phoneError) phoneError.classList.remove('visible');
        }

        if (parseInt(captcha.value) !== sum) {
            if(captchaError) captchaError.classList.add('visible');
            isValid = false;
        } else {
            if(captchaError) captchaError.classList.remove('visible');
        }

        if (isValid) {
            const btn = form.querySelector('button[type="submit"]');
            btn.textContent = "Отправка...";
            btn.disabled = true;

            setTimeout(() => {
                // Скрываем форму и показываем успех
                form.style.display = 'none';
                successMsg.style.display = 'block';
                
                // Переинициализируем иконки Lucide внутри нового блока
                lucide.createIcons();
            }, 1000);
        }
    });
}

// --- COOKIES ---
function initCookies() {
    const popup = document.getElementById('cookie-popup');
    const btn = document.getElementById('cookie-accept');
    
    if (!popup || !btn) return;

    if (!localStorage.getItem('cookiesAccepted')) {
        setTimeout(() => {
            popup.classList.add('show');
        }, 2000);
    }

    btn.addEventListener('click', () => {
        localStorage.setItem('cookiesAccepted', 'true');
        popup.classList.remove('show');
    });
}