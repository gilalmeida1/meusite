document.addEventListener('DOMContentLoaded', function() {
    // Loader
    const loaderWrapper = document.querySelector('.loader-wrapper');
    if (loaderWrapper) {
        window.addEventListener('load', () => {
            loaderWrapper.style.opacity = '0';
            setTimeout(() => loaderWrapper.style.display = 'none', 500);
        });
    }

    // Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
            menuToggle.setAttribute('aria-expanded', !isExpanded);
            navLinks.classList.toggle('active');
        });

        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // Theme Toggle
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    if (themeToggle) {
        const currentTheme = localStorage.getItem('theme');
        if (currentTheme) {
            body.classList.add(currentTheme);
            themeToggle.innerHTML = currentTheme === 'dark-mode' ? '☀️' : '🌙';
        }

        themeToggle.addEventListener('click', () => {
            body.classList.toggle('dark-mode');
            const isDark = body.classList.contains('dark-mode');
            themeToggle.innerHTML = isDark ? '☀️' : '🌙';
            localStorage.setItem('theme', isDark ? 'dark-mode' : 'light-mode');
        });
    }

    // Modal de Projetos
    function createProjectModal(project) {
        const modal = document.createElement('div');
        modal.classList.add('modal');
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close" aria-label="Fechar modal">×</span>
                <h2>${project.title}</h2>
                <p>${project.description}</p>
                <img src="${project.images[0]}" alt="${project.title}" class="main-image">
                <div class="thumbnails">
                    ${project.images.map((img, index) => `<img src="${img}" alt="Thumbnail ${index + 1}" class="thumbnail">`).join('')}
                </div>
            </div>
        `;
        return modal;
    }

    function setupModalInteractions(modal, project) {
        const mainImage = modal.querySelector('.main-image');
        const thumbnails = modal.querySelectorAll('.thumbnail');
        const closeBtn = modal.querySelector('.close');

        thumbnails.forEach((thumb, index) => {
            thumb.addEventListener('click', () => {
                mainImage.src = project.images[index];
                thumbnails.forEach(t => t.classList.remove('active'));
                thumb.classList.add('active');
            });
        });

        closeBtn.addEventListener('click', () => modal.remove());
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });
    }

    document.querySelectorAll('.btn-details').forEach(button => {
        button.addEventListener('click', () => {
            const projectCard = button.closest('.project-card');
            const projectData = JSON.parse(projectCard.dataset.project);
            const modal = createProjectModal(projectData);
            document.body.appendChild(modal);
            setupModalInteractions(modal, projectData);
        });
    });

    // Animações
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.project-card, .gallery-item, .banner-content').forEach(el => observer.observe(el));

    // Validação e Envio do Formulário de Contato
    const contactForm = document.getElementById('contact-form');
    const formMessage = document.getElementById('form-message');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();

            // Validação dos campos
            if (!name || !email || !message) {
                formMessage.textContent = 'Por favor, preencha todos os campos.';
                formMessage.style.color = 'red';
                return;
            }

            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                formMessage.textContent = 'Por favor, insira um e-mail válido.';
                formMessage.style.color = 'red';
                return;
            }

            // Envio com EmailJS
            emailjs.send('service_hv0a23e', 'template_oeh15m5', {
                from_name: name,
                from_email: email,
                message: message
            })
            .then(() => {
                formMessage.textContent = 'Mensagem enviada com sucesso!';
                formMessage.style.color = 'green';
                contactForm.reset();
            }, (error) => {
                formMessage.textContent = 'Erro ao enviar a mensagem. Tente novamente.';
                formMessage.style.color = 'red';
                console.error('Erro no EmailJS:', error);
            });
        });
    }
});