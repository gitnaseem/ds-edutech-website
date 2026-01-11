// ========== Load Dynamic Content from Admin Panel ==========
function loadDynamicContent() {
  const adminContent = JSON.parse(localStorage.getItem('adminContent'));
  
  if (adminContent) {
    // Update website name in header/logo
    if (adminContent.name) {
      const logos = document.querySelectorAll('.logo');
      logos.forEach(logo => {
        logo.textContent = adminContent.name;
      });
      
      // Update browser tab title
      const currentTitle = document.title;
      const originalName = 'DS_EDUTECH';
      
      if (currentTitle.includes(originalName)) {
        const newTitle = currentTitle.replace(originalName, adminContent.name);
        document.title = newTitle;
      } else {
        // If title doesn't contain the original name, prepend the new name
        document.title = adminContent.name + ' - ' + currentTitle;
      }
    }
    
    // Update custom tagline if updated in admin panel
    if (adminContent.tagline) {
      const heroH1 = document.querySelector('.hero h1');
      if (heroH1) {
        const taglineParts = adminContent.tagline.split('Digital Future');
        if (taglineParts.length === 2) {
          heroH1.innerHTML = taglineParts[0].trim() + '<span class="gradient-text">Digital Future</span>' + taglineParts[1];
        } else {
          heroH1.textContent = adminContent.tagline;
        }
      }
    }
  }
}

// ========== Mobile Menu Toggle ==========
document.addEventListener('DOMContentLoaded', function() {
  // Load dynamic content from admin panel
  loadDynamicContent();

  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');

  if (menuToggle) {
    menuToggle.addEventListener('click', function() {
      navLinks.classList.toggle('active');
    });

    // Close menu when a link is clicked
    document.querySelectorAll('.nav-links a').forEach(link => {
      link.addEventListener('click', function() {
        navLinks.classList.remove('active');
      });
    });
  }

  // Update active navigation link
  updateActiveNavLink();
});

// ========== Active Navigation Link ==========
function updateActiveNavLink() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.classList.remove('active');
    
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

// ========== Smooth Scrolling ==========
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (href !== '#' && document.querySelector(href)) {
      e.preventDefault();
      const target = document.querySelector(href);
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// ========== Form Submission Handlers ==========
// Contact form handler (if not already in HTML)
function handleContactForm(event) {
  if (event) {
    event.preventDefault();
  }
  
  const name = document.getElementById('name')?.value || '';
  if (!name) return; // Form handler already exists in HTML
  
  const formMessage = document.getElementById('formMessage');
  formMessage.textContent = `Thank you, ${name}! Your message has been received. We'll get back to you shortly.`;
  formMessage.style.display = 'block';
  
  setTimeout(() => {
    document.getElementById('contactForm').reset();
    formMessage.style.display = 'none';
  }, 3000);
}

// ========== Intersection Observer for Animations ==========
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.animation = 'slideUp 0.6s ease forwards';
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Observe all cards and sections
document.querySelectorAll('.course-card, .subject-card, .benefit-card, .testimonial-card, .board-item').forEach(element => {
  element.style.opacity = '0';
  observer.observe(element);
});

// ========== Search Functionality ==========
function searchCourses(query) {
  const cards = document.querySelectorAll('.course-card');
  const lowerQuery = query.toLowerCase();
  
  cards.forEach(card => {
    const title = card.querySelector('h3')?.textContent.toLowerCase() || '';
    const description = card.querySelector('p')?.textContent.toLowerCase() || '';
    
    if (title.includes(lowerQuery) || description.includes(lowerQuery)) {
      card.style.display = 'block';
    } else {
      card.style.display = 'none';
    }
  });
}

// ========== Filter Courses ==========
function filterCourses(level) {
  const cards = document.querySelectorAll('.course-card');
  
  cards.forEach(card => {
    const levelSpan = card.querySelector('.course-level');
    if (levelSpan) {
      const courseLevel = levelSpan.textContent.toLowerCase();
      
      if (level === 'all' || courseLevel.includes(level)) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    }
  });
}

// ========== Scroll to Top Button ==========
const scrollTopBtn = document.createElement('button');
scrollTopBtn.innerHTML = '↑';
scrollTopBtn.style.cssText = `
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 45px;
  height: 45px;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  font-size: 1.2rem;
  font-weight: bold;
  display: none;
  z-index: 999;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
`;

document.body.appendChild(scrollTopBtn);

window.addEventListener('scroll', function() {
  if (window.pageYOffset > 300) {
    scrollTopBtn.style.display = 'block';
  } else {
    scrollTopBtn.style.display = 'none';
  }
});

scrollTopBtn.addEventListener('click', function() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});

scrollTopBtn.addEventListener('mouseover', function() {
  this.style.transform = 'scale(1.1)';
});

scrollTopBtn.addEventListener('mouseout', function() {
  this.style.transform = 'scale(1)';
});

// ========== Lazy Loading ==========
if ('IntersectionObserver' in window) {
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
        }
        imageObserver.unobserve(img);
      }
    });
  });

  document.querySelectorAll('img[data-src]').forEach(img => imageObserver.observe(img));
}

// ========== Dark Mode Toggle (Optional Feature) ==========
function initDarkMode() {
  const darkModeToggle = document.getElementById('darkModeToggle');
  const isDarkMode = localStorage.getItem('darkMode') === 'true';
  
  if (isDarkMode) {
    document.body.classList.add('dark-mode');
    if (darkModeToggle) darkModeToggle.textContent = '☀️';
  }
  
  if (darkModeToggle) {
    darkModeToggle.addEventListener('click', function() {
      document.body.classList.toggle('dark-mode');
      const isDark = document.body.classList.contains('dark-mode');
      localStorage.setItem('darkMode', isDark);
      this.textContent = isDark ? '☀️' : '🌙';
    });
  }
}

// ========== Navigation URL Parameters ==========
function getUrlParameter(name) {
  name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
  const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
  const results = regex.exec(location.search);
  return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

// Handle course filtering from URL
if (window.location.pathname.includes('courses.html')) {
  const stream = getUrlParameter('stream');
  if (stream) {
    // Highlight the selected stream course section
    setTimeout(() => {
      const sectionTitle = Array.from(document.querySelectorAll('.section-title')).find(el => 
        el.textContent.toLowerCase().includes(stream)
      );
      if (sectionTitle) {
        sectionTitle.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  }
}

// ========== Form Validation ==========
function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

function validatePhone(phone) {
  const regex = /^[0-9]{10}$/;
  return regex.test(phone.replace(/[- ]/g, ''));
}

// ========== Tooltip Functionality ==========
function showTooltip(element, text) {
  const tooltip = document.createElement('div');
  tooltip.style.cssText = `
    position: absolute;
    background: var(--dark-color);
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    font-size: 0.85rem;
    white-space: nowrap;
    z-index: 1000;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    margin-bottom: 0.5rem;
  `;
  tooltip.textContent = text;
  
  element.style.position = 'relative';
  element.appendChild(tooltip);
  
  setTimeout(() => tooltip.remove(), 2000);
}

// ========== Copy to Clipboard ==========
function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    showTooltip(event.target, 'Copied!');
  });
}

// ========== Performance Optimization ==========
// Debounce function for resize and scroll events
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// ========== Analytics Tracking (Placeholder) ==========
function trackEvent(eventName, eventData) {
  // This would typically send data to analytics service
  console.log('Event tracked:', eventName, eventData);
}

// Track page views
trackEvent('page_view', {
  page: window.location.pathname,
  timestamp: new Date().toISOString()
});

// Track button clicks
document.querySelectorAll('.btn-primary, .btn-secondary, .btn-learn').forEach(button => {
  button.addEventListener('click', function() {
    trackEvent('button_click', {
      buttonText: this.textContent,
      page: window.location.pathname
    });
  });
});

// ========== Session Storage for Form Data ==========
function saveFormData(formId) {
  const form = document.getElementById(formId);
  if (form) {
    const formData = new FormData(form);
    const data = {};
    formData.forEach((value, key) => {
      data[key] = value;
    });
    sessionStorage.setItem(formId, JSON.stringify(data));
  }
}

function loadFormData(formId) {
  const form = document.getElementById(formId);
  if (form) {
    const data = JSON.parse(sessionStorage.getItem(formId) || '{}');
    Object.keys(data).forEach(key => {
      const field = form.elements[key];
      if (field) {
        field.value = data[key];
      }
    });
  }
}

// Auto-save form data on input
document.querySelectorAll('form').forEach(form => {
  form.addEventListener('change', function() {
    saveFormData(this.id);
  });
});

// ========== Initialize on Page Load ==========
document.addEventListener('DOMContentLoaded', function() {
  // Restore form data
  document.querySelectorAll('form[id]').forEach(form => {
    loadFormData(form.id);
  });
  
  // Initialize dark mode
  initDarkMode();
  
  // Add loading class animation
  document.body.classList.add('loaded');
});

// ========== Keyboard Navigation ==========
document.addEventListener('keydown', function(event) {
  // Escape to close modals
  if (event.key === 'Escape') {
    document.querySelectorAll('.modal').forEach(modal => {
      modal.style.display = 'none';
    });
  }
  
  // Tab to scroll to top
  if (event.key === 'Home') {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  
  // End to scroll to bottom
  if (event.key === 'End') {
    event.preventDefault();
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  }
});

// ========== Print Stylesheet ==========
window.addEventListener('beforeprint', function() {
  document.body.style.background = 'white';
  document.querySelectorAll('.no-print').forEach(el => {
    el.style.display = 'none';
  });
});

window.addEventListener('afterprint', function() {
  document.querySelectorAll('.no-print').forEach(el => {
    el.style.display = '';
  });
});

// ========== Network Status ==========
window.addEventListener('online', function() {
  console.log('Online - All features available');
  // Remove offline indicator if present
  const offlineIndicator = document.getElementById('offlineIndicator');
  if (offlineIndicator) offlineIndicator.style.display = 'none';
});

window.addEventListener('offline', function() {
  console.log('Offline - Limited functionality');
  // Show offline indicator
  const indicator = document.createElement('div');
  indicator.id = 'offlineIndicator';
  indicator.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    background: #ff6b6b;
    color: white;
    padding: 1rem;
    text-align: center;
    z-index: 10000;
  `;
  indicator.textContent = 'You are currently offline. Some features may be unavailable.';
  document.body.insertBefore(indicator, document.body.firstChild);
});

// ========== Service Worker Registration (PWA Support) ==========
if ('serviceWorker' in navigator) {
  // Service worker registration would go here
  // navigator.serviceWorker.register('/sw.js');
}

console.log('DS_EDUTECH JavaScript loaded successfully');
