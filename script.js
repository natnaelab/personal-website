document.addEventListener('DOMContentLoaded', () => {
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  const hiddenElements = document.querySelectorAll('.hidden');
  hiddenElements.forEach((el) => observer.observe(el));

  // Mobile Navigation Toggle
  const navToggle = document.querySelector('.nav-toggle');
  const navContent = document.querySelector('.nav-content');

  if (navToggle && navContent) {
    navToggle.addEventListener('click', (e) => {
      e.preventDefault();
      navContent.classList.toggle('active');
      const isExpanded = navContent.classList.contains('active');
      navToggle.setAttribute('aria-expanded', isExpanded);
    });
  }

  // Close nav when clicking a link
  const navLinks = document.querySelectorAll('.nav-links a');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navContent && navContent.classList.contains('active')) {
        navContent.classList.remove('active');
        if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  });

  const loadAnalytics = () => {
    if (document.querySelector('script[data-website-id="ab0efb14-d7ce-4317-933c-cf2fbb7ddbde"]')) {
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://cloud.umami.is/script.js';
    script.defer = true;
    script.dataset.websiteId = 'ab0efb14-d7ce-4317-933c-cf2fbb7ddbde';
    document.head.appendChild(script);
  };

  if ('requestIdleCallback' in window) {
    requestIdleCallback(loadAnalytics, { timeout: 2000 });
  } else {
    window.addEventListener('load', () => {
      setTimeout(loadAnalytics, 1000);
    }, { once: true });
  }
});
