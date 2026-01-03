// DOMContentLoaded - Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    // Actualizar año actual en el footer
    document.getElementById('currentYear').textContent = new Date().getFullYear();
    
    // Inicializar EmailJS con tu clave pública
    emailjs.init('HQmVYyQx46yJHwo-U');
    
    // Menú móvil
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    // Cerrar menú al hacer clic en un enlace
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            
            // Actualizar enlace activo
            navLinks.forEach(item => item.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Carousel de flota
    const carouselTrack = document.querySelector('.carousel-track');
    const fleetItems = document.querySelectorAll('.fleet-item');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    let currentIndex = 0;
    const itemsPerView = getItemsPerView();
    
    function getItemsPerView() {
        if (window.innerWidth < 576) return 1;
        if (window.innerWidth < 768) return 2;
        if (window.innerWidth < 992) return 3;
        return 4;
    }
    
    function updateCarousel() {
        const itemWidth = fleetItems[0].offsetWidth + 30;
        const translateX = -currentIndex * itemWidth;
        carouselTrack.style.transform = `translateX(${translateX}px)`;
        
        // Actualizar estado de los botones
        prevBtn.disabled = currentIndex === 0;
        nextBtn.disabled = currentIndex >= fleetItems.length - itemsPerView;
    }
    
    function nextSlide() {
        if (currentIndex < fleetItems.length - itemsPerView) {
            currentIndex++;
            updateCarousel();
        }
    }
    
    function prevSlide() {
        if (currentIndex > 0) {
            currentIndex--;
            updateCarousel();
        }
    }
    
    // Event listeners para botones del carousel
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);
    
    // Actualizar carousel al redimensionar ventana
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function() {
            const newItemsPerView = getItemsPerView();
            if (newItemsPerView !== itemsPerView) {
                currentIndex = Math.min(currentIndex, Math.max(0, fleetItems.length - newItemsPerView));
                updateCarousel();
            }
        }, 250);
    });
    
    // Inicializar carousel
    updateCarousel();
    
    // Formulario de contacto
    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const submitText = document.getElementById('submitText');
    const submitSpinner = document.getElementById('submitSpinner');
    const formMessage = document.getElementById('form-message');
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Obtener valores del formulario
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const service = document.getElementById('service').value;
        const message = document.getElementById('message').value.trim();
        
        // Validación básica
        if (!name || !email || !phone || !service || !message) {
            showFormMessage('Por favor, complete todos los campos requeridos.', 'error');
            return;
        }
        
        // Validar email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showFormMessage('Por favor, ingrese un correo electrónico válido.', 'error');
            return;
        }
        
        // Mostrar estado de carga
        submitBtn.disabled = true;
        submitText.textContent = 'Enviando...';
        submitSpinner.style.display = 'inline-block';
        
        // Preparar datos para EmailJS
        const templateParams = {
            from_name: name,
            from_email: email,
            phone: phone,
            service: service,
            message: message,
            date: new Date().toLocaleString('es-EC', {
                timeZone: 'America/Guayaquil',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })
        };
        
        // Enviar el correo usando EmailJS
        emailjs.send('service_vqrkhse', 'template_6l140wl', templateParams)
            .then(function(response) {
                console.log('SUCCESS!', response.status, response.text);
                
                // Mostrar mensaje de éxito
                showFormMessage('¡Mensaje enviado con éxito! Te contactaremos pronto.', 'success');
                
                // Limpiar el formulario
                contactForm.reset();
                
                // Restaurar botón
                resetSubmitButton();
                
                // Mostrar notificación global
                showNotification('¡Mensaje enviado con éxito!', 'success');
                
            }, function(error) {
                console.error('FAILED...', error);
                
                // Mostrar mensaje de error
                showFormMessage('Error al enviar el mensaje. Por favor, inténtalo de nuevo.', 'error');
                
                // Restaurar botón
                resetSubmitButton();
                
                // Mostrar notificación global
                showNotification('Error al enviar el mensaje. Por favor, inténtalo de nuevo.', 'error');
            });
    });
    
    // Función para restaurar el botón de envío
    function resetSubmitButton() {
        submitBtn.disabled = false;
        submitText.textContent = 'Enviar Mensaje';
        submitSpinner.style.display = 'none';
    }
    
    // Función para mostrar mensajes en el formulario
    function showFormMessage(message, type) {
        formMessage.textContent = message;
        formMessage.className = '';
        formMessage.classList.add(type === 'success' ? 'message-success' : 'message-error');
        formMessage.style.display = 'block';
        
        // Ocultar el mensaje después de 5 segundos
        setTimeout(() => {
            formMessage.style.display = 'none';
        }, 5000);
    }
    
    // Función para mostrar notificaciones globales
    function showNotification(message, type) {
        // Crear elemento de notificación
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        // Agregar al DOM
        document.body.appendChild(notification);
        
        // Remover después de 5 segundos
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 5000);
    }
    
    // Efecto de scroll suave para enlaces internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href === '#') return;
            
            e.preventDefault();
            const targetElement = document.querySelector(href);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Cambiar estilo del header al hacer scroll
    window.addEventListener('scroll', function() {
        const header = document.querySelector('.header');
        if (window.scrollY > 100) {
            header.style.boxShadow = '0 5px 20px rgba(13, 27, 38, 0.1)';
            header.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
        } else {
            header.style.boxShadow = '0 5px 20px rgba(13, 27, 38, 0.08)';
            header.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
        }
    });
    
    // Efecto de aparición suave para elementos al hacer scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observar elementos para animación
    const animatedElements = document.querySelectorAll('.service-card, .fleet-item, .about-text, .contact-container');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(el);
    });
    
    // Inicializar tooltips para puntos del mapa
    const mapPoints = document.querySelectorAll('.map-point');
    mapPoints.forEach(point => {
        point.addEventListener('mouseenter', function() {
            const label = this.querySelector('.point-label');
            label.style.opacity = '1';
            label.style.top = '-40px';
        });
        
        point.addEventListener('mouseleave', function() {
            const label = this.querySelector('.point-label');
            label.style.opacity = '0';
            label.style.top = '-30px';
        });
    });
});