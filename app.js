// DOM Elements
const registrationForm = document.getElementById('registration-form');
const registrationOverlay = document.getElementById('registration-overlay');
const registerBtn = document.getElementById('register-btn');
const registerNav = document.getElementById('register-nav');
const registerFooter = document.getElementById('register-footer');
const closeFormBtn = document.getElementById('close-form');
const formStatus = document.getElementById('form-status');
const hamburger = document.getElementById('hamburger');
const nav = document.getElementById('nav');
const header = document.getElementById('header');

// Google Apps Script URL (you need to deploy your Google Apps Script as a web app)
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwfQMsU4BEkn-_nKU4d_nlAHygx8foVVZaMEKtAqrmAjTR0MeyJ3tnO5wnCnUhFbh93/exec';

// Show/Hide Registration Form
function toggleRegistrationForm() {
    registrationOverlay.classList.toggle('show');
    document.body.style.overflow = registrationOverlay.classList.contains('show') ? 'hidden' : 'auto';
}

// Mobile Navigation
function toggleNav() {
    nav.classList.toggle('active');
    hamburger.classList.toggle('active');
    
    const icon = hamburger.querySelector('i');
    if (nav.classList.contains('active')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
    } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    }
}
// Function to get a cookie
function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i].trim();
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}
function setCookie(name, value, days) {
    const d = new Date();
    d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + d.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
}
async function handleFormSubmission(e) {
    e.preventDefault();
    

    if (getCookie("formSubmittedtecnovision25") === "true") {
        formStatus.textContent = 'Already registered.';
        formStatus.className = 'form-status error';
        return; // Stop submission
    }




    // Reset status message
    formStatus.className = 'form-status';
    formStatus.style.display = 'none';
    formStatus.textContent = '';
    
    // Get form data
    const formData = new FormData(registrationForm);
    const enrollmentNumber = formData.get('enrollment');
    const email = formData.get('email');
    
    try {
        // Show loading message
        formStatus.textContent = 'Processing your registration...';
        formStatus.className = 'form-status';
        formStatus.style.display = 'block';
        
        // Check for duplicates in one call
        const checkResponse = await fetch(SCRIPT_URL, {
            method: 'POST',
            body: JSON.stringify({
                action: 'checkDuplicates',
                enrollment: enrollmentNumber,
                email: email
            })
        });
        
        const checkResult = await checkResponse.json();
        
        // Handle duplicate enrollment
        if (checkResult.duplicateEnrollment) {
            formStatus.textContent = 'This enrollment number is already registered.';
            formStatus.className = 'form-status error';
            return;
        }
        
        // Handle duplicate email
        if (checkResult.duplicateEmail) {
            formStatus.textContent = 'This email address is already registered.';
            formStatus.className = 'form-status error';
            return;
        }
        
        function formatIndianDate(date) {
            const options = {
                day: '2-digit', month: '2-digit', year: 'numeric',
                hour: '2-digit', minute: '2-digit', second: '2-digit',
                hour12: true, timeZone: 'Asia/Kolkata'
            };
        
            return new Intl.DateTimeFormat('en-IN', options).format(date).replace(',', '');
        }
        // Proceed with registration if no duplicates found
        const data = {
            action: 'register',
            name: formData.get('name'),
            enrollment: enrollmentNumber,
            phone: formData.get('phone'),
            email: email,
            department: formData.get('department'),
            semester: formData.get('semester'),
            section: formData.get('section'),
            timestamp: formatIndianDate(new Date())

         
        };
        
        // Submit to Google Apps Script
        const response = await fetch(SCRIPT_URL, {
            method: 'POST',
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (result.success) {
            // Success
            formStatus.textContent = 'Registration successful! You will receive a confirmation email shortly.';
            formStatus.className = 'form-status success';
            registrationForm.reset();
            setCookie("formSubmittedtecnovision25", "true", 30);

            
            // Auto close form after 3 seconds
            setTimeout(() => {
                toggleRegistrationForm();
            }, 3000);
        } else {
            // Error
            formStatus.textContent = result.error || 'An error occurred. Please try again.';
            formStatus.className = 'form-status error';
        }
    } catch (error) {
        console.error('Error:', error);
        formStatus.textContent = 'An error occurred. Please try again later.';
        formStatus.className = 'form-status error';
    }
}

// Scroll Header Effect
function scrollHeader() {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
}

// Matrix Rain Animation (Optional visual effect)
function setupMatrixRain() {
    const canvas = document.createElement('canvas');
    canvas.classList.add('matrix-rain');
    document.querySelector('.hero').appendChild(canvas);
    const ctx = canvas.getContext('2d');

    // Set canvas dimensions
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Characters for the matrix rain
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789{}[]=<>/\\|;:+-*&^%$#@!~`'.split('');
    
    // Array of drops
    const drops = [];
    
    // Number of columns
    const columns = Math.floor(canvas.width / 20);
    
    // Initialize drops
    for (let i = 0; i < columns; i++) {
        drops[i] = Math.random() * -500;
    }

    function drawMatrixRain() {
        // Black background with opacity
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Green text
        ctx.fillStyle = '#00FF00';
        ctx.font = '15px monospace';

        // Draw characters
        for (let i = 0; i < drops.length; i++) {
            // Random character
            const text = chars[Math.floor(Math.random() * chars.length)];
            
            // Draw the character
            ctx.fillText(text, i * 20, drops[i] * 1);
            
            // Reset if drop reaches bottom or randomly
            if (drops[i] * 1 > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            
            // Move the drop down
            drops[i]++;
        }
    }

    // Animation loop
    function animate() {
        drawMatrixRain();
        requestAnimationFrame(animate);
    }

    animate();
    
    // Resize handler
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        if (this.getAttribute('href') !== '#') {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
            
            // Close mobile nav if open
            if (nav.classList.contains('active')) {
                toggleNav();
            }
        }
    });
});

// Event Listeners
window.addEventListener('load', () => {
    // Initialize particles.js
    particlesJS("particles-js", {
        particles: {
            number: { value: 80, density: { enable: true, value_area: 800 } },
            color: { value: "#00ff00" },
            shape: { type: "circle" },
            opacity: { value: 0.5, random: true },
            size: { value: 3, random: true },
            line_linked: {
                enable: true,
                distance: 150,
                color: "#00ff00",
                opacity: 0.4,
                width: 1
            },
            move: {
                enable: true,
                speed: 2,
                direction: "none",
                random: true,
                out_mode: "out"
            }
        },
        interactivity: {
            detect_on: "canvas",
            events: {
                onhover: { enable: true, mode: "repulse" },
                onclick: { enable: true, mode: "push" }
            },
            modes: {
                repulse: { distance: 100, duration: 0.4 },
                push: { particles_nb: 4 }
            }
        }
    });
    
    // Setup Matrix Rain effect
    setupMatrixRain();
});

// Form related events
registerBtn.addEventListener('click', toggleRegistrationForm);
registerNav.addEventListener('click', toggleRegistrationForm);
registerFooter.addEventListener('click', toggleRegistrationForm);
closeFormBtn.addEventListener('click', toggleRegistrationForm);
registrationForm.addEventListener('submit', handleFormSubmission);

// Mobile nav toggle
hamburger.addEventListener('click', toggleNav);

// Scroll events
window.addEventListener('scroll', scrollHeader);