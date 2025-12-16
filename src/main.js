document.addEventListener("DOMContentLoaded", () => {
    // 1. Инициализация иконок и плавного скролла
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

    // 2. Three.js Hero Animation (Умная Материя)
    initThreeJS();

    // 3. GSAP Анимации
    initGSAP();

    // 4. Мобильное меню
    initMobileMenu();

    // 5. Логика формы
    initForm();

    // 6. Cookie Popup
    initCookies();
});

// --- THREE.JS HERO ---
function initThreeJS() {
    const container = document.getElementById('canvas-container');
    if (!container) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xF3F3F1); // Цвет фона сайта
    scene.fog = new THREE.Fog(0xF3F3F1, 10, 50);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 30;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Частицы
    const geometry = new THREE.BufferGeometry();
    const count = 1500;
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count * 3; i++) {
        positions[i] = (Math.random() - 0.5) * 40; // Разброс
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
        color: 0x111111, // Цвет частиц (черный)
        size: 0.15,
        transparent: true,
        opacity: 0.7
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Мышь
    let mouseX = 0;
    let mouseY = 0;
    
    // Эффект волны
    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    });

    // Анимация
    const clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);
        const elapsedTime = clock.getElapsedTime();

        // Плавное вращение всей системы
        particles.rotation.y = elapsedTime * 0.05;
        particles.rotation.x = mouseY * 0.1;
        particles.rotation.y += mouseX * 0.1;

        // "Дыхание" частиц (Drift)
        const positions = particles.geometry.attributes.position.array;
        for(let i = 0; i < count; i++) {
            // Легкая вибрация
            // Тут можно добавить сложную математику, но для перфоманса оставим вращение
        }
        
        renderer.render(scene, camera);
    }
    animate();

    // Ресайз
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

// --- GSAP ANIMATIONS ---
function initGSAP() {
    gsap.registerPlugin(ScrollTrigger);

    // Hero Text Reveal
    gsap.from(".reveal-text", {
        y: 100,
        opacity: 0,
        duration: 1.2,
        stagger: 0.1,
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

    // Innovation Image Reveal (Clip Path Animation)
    // Эффект: Картинка раскрывается из ничего при скролле
    const imgWrapper = document.querySelector('.image-reveal-wrapper');
    const img = document.querySelector('.innovations__img');

    if (imgWrapper && img) {
        gsap.set(imgWrapper, { clipPath: "inset(100% 0 0 0)" }); // Скрыто снизу
        gsap.to(imgWrapper, {
            clipPath: "inset(0% 0 0 0)", // Полное раскрытие
            duration: 1.5,
            ease: "power4.out",
            scrollTrigger: {
                trigger: ".innovations",
                start: "top 70%",
                end: "top 30%",
                scrub: 1 // Привязка к скроллу
            }
        });
        
        // Параллакс эффект для самой картинки внутри
        gsap.to(img, {
            scale: 1,
            scrollTrigger: {
                trigger: ".innovations",
                start: "top 70%",
                scrub: 1
            }
        });
    }

    // Блог - появление карточек
    gsap.from(".blog__card", {
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        scrollTrigger: {
            trigger: ".blog",
            start: "top 80%"
        }
    });
}

// --- MOBILE MENU ---
function initMobileMenu() {
    const burger = document.querySelector('.header__burger');
    const menu = document.querySelector('.mobile-menu');
    const header = document.querySelector('.header');
    const links = document.querySelectorAll('.mobile-menu__link');
    const burgerLines = document.querySelectorAll('.burger-line');

    let isOpen = false;

    burger.addEventListener('click', toggleMenu);
    
    // Закрытие при клике на ссылку
    links.forEach(link => {
        link.addEventListener('click', toggleMenu);
    });

    function toggleMenu() {
        isOpen = !isOpen;
        
        if (isOpen) {
            menu.classList.add('active');
            header.classList.add('menu-open');
            // Анимация пунктов меню
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
            // Сброс позиций
            gsap.to(links, {
                y: 20,
                opacity: 0,
                duration: 0.3
            });
        }
    }
}

// --- FORM HANDLING ---
function initForm() {
    const form = document.getElementById('main-form');
    if (!form) return;

    // Генерация капчи
    const n1 = Math.floor(Math.random() * 10);
    const n2 = Math.floor(Math.random() * 10);
    const sum = n1 + n2;
    document.getElementById('captcha-label').textContent = `Сколько будет ${n1} + ${n2}?`;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const phone = document.getElementById('phone');
        const captcha = document.getElementById('captcha');
        const phoneError = document.getElementById('phone-error');
        const captchaError = document.getElementById('captcha-error');
        let isValid = true;

        // Валидация телефона (Только цифры)
        if (!/^\d+$/.test(phone.value)) {
            phoneError.classList.add('visible');
            isValid = false;
        } else {
            phoneError.classList.remove('visible');
        }

        // Валидация Капчи
        if (parseInt(captcha.value) !== sum) {
            captchaError.classList.add('visible');
            isValid = false;
        } else {
            captchaError.classList.remove('visible');
        }

        if (isValid) {
            // Имитация AJAX
            const btn = form.querySelector('button[type="submit"]');
            const originalText = btn.textContent;
            btn.textContent = "Отправка...";
            btn.disabled = true;

            setTimeout(() => {
                form.style.display = 'none';
                document.getElementById('form-success').style.display = 'block';
                // Сброс (если нужно)
                // form.reset();
            }, 1500);
        }
    });
}

// --- COOKIES ---
function initCookies() {
    const popup = document.getElementById('cookie-popup');
    const btn = document.getElementById('cookie-accept');
    
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