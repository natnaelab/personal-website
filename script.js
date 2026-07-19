const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

function initRevealAnimations() {
  const revealElements = Array.from(document.querySelectorAll('.reveal'));

  if (!('IntersectionObserver' in window) || reducedMotionQuery.matches) {
    return;
  }

  revealElements.forEach((element) => element.classList.add('reveal-ready'));

  try {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.08,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach((element) => observer.observe(element));
  } catch (error) {
    revealElements.forEach((element) => element.classList.remove('reveal-ready'));
    console.error('Unable to initialize reveal animations.', error);
  }
}

function createTextElement(tagName, className, text) {
  const element = document.createElement(tagName);
  element.className = className;
  element.textContent = text;
  return element;
}

function initTestimonials() {
  const dataNode = document.getElementById('testimonials-data');
  const container = document.getElementById('quotes-container');
  const dotsContainer = document.getElementById('quote-dots');
  const prevButton = document.getElementById('q-prev');
  const nextButton = document.getElementById('q-next');
  const carousel = document.getElementById('quote-wrap');

  if (!dataNode || !container || !dotsContainer || !prevButton || !nextButton || !carousel) {
    return;
  }

  let testimonials;

  try {
    testimonials = JSON.parse(dataNode.textContent);
  } catch (error) {
    console.error('Unable to parse testimonials data.', error);
    return;
  }

  if (!Array.isArray(testimonials) || testimonials.length === 0) {
    return;
  }

  const fragment = document.createDocumentFragment();
  const dotsFragment = document.createDocumentFragment();

  testimonials.forEach((testimonial, index) => {
    const card = document.createElement('article');
    card.className = `quote-item${index === 0 ? ' active' : ''}`;
    card.setAttribute('role', 'group');
    card.setAttribute('aria-roledescription', 'slide');
    card.setAttribute('aria-label', `Quote ${index + 1} of ${testimonials.length}`);
    card.setAttribute('aria-hidden', index === 0 ? 'false' : 'true');

    const quote = createTextElement('p', 'quote-text', `“${testimonial.quote}”`);
    const author = createTextElement('p', 'quote-author', testimonial.name);
    const platform = createTextElement(
      'p',
      'quote-platform',
      `${testimonial.platform} · ${testimonial.company_type} · `
    );
    const verifyLink = document.createElement('a');
    verifyLink.className = 'quote-verify';
    verifyLink.href = testimonial.profile_url;
    verifyLink.target = '_blank';
    verifyLink.rel = 'noopener';
    verifyLink.textContent = `Verified on ${testimonial.platform} ↗`;
    platform.appendChild(verifyLink);

    card.append(quote, author, platform);
    fragment.appendChild(card);

    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = `quote-dot${index === 0 ? ' active' : ''}`;
    dot.setAttribute('aria-label', `Go to testimonial ${index + 1}`);
    dot.setAttribute('aria-pressed', index === 0 ? 'true' : 'false');
    dot.dataset.index = String(index);
    dotsFragment.appendChild(dot);
  });

  container.replaceChildren(fragment);
  dotsContainer.replaceChildren(dotsFragment);

  const cards = Array.from(container.querySelectorAll('.quote-item'));
  const dots = Array.from(dotsContainer.querySelectorAll('.quote-dot'));
  let currentIndex = 0;
  let intervalId = null;
  let isHovered = false;
  let isFocused = false;

  function showQuote(nextIndex) {
    const normalizedIndex = (nextIndex + cards.length) % cards.length;

    cards[currentIndex].classList.remove('active');
    cards[currentIndex].setAttribute('aria-hidden', 'true');
    dots[currentIndex].classList.remove('active');
    dots[currentIndex].setAttribute('aria-pressed', 'false');

    currentIndex = normalizedIndex;
    cards[currentIndex].classList.add('active');
    cards[currentIndex].setAttribute('aria-hidden', 'false');
    dots[currentIndex].classList.add('active');
    dots[currentIndex].setAttribute('aria-pressed', 'true');
  }

  function stopAutoAdvance() {
    if (intervalId !== null) {
      window.clearInterval(intervalId);
      intervalId = null;
    }
  }

  function startAutoAdvance() {
    if (
      intervalId !== null ||
      cards.length < 2 ||
      reducedMotionQuery.matches ||
      isHovered ||
      isFocused ||
      document.hidden
    ) {
      return;
    }

    intervalId = window.setInterval(() => showQuote(currentIndex + 1), 6000);
  }

  prevButton.addEventListener('click', () => showQuote(currentIndex - 1));
  nextButton.addEventListener('click', () => showQuote(currentIndex + 1));

  dots.forEach((dot) => {
    dot.addEventListener('click', () => showQuote(Number(dot.dataset.index)));
  });

  carousel.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      showQuote(currentIndex + 1);
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      showQuote(currentIndex - 1);
    }
  });

  carousel.addEventListener('mouseenter', () => {
    isHovered = true;
    stopAutoAdvance();
  });

  carousel.addEventListener('mouseleave', () => {
    isHovered = false;
    startAutoAdvance();
  });

  carousel.addEventListener('focusin', () => {
    isFocused = true;
    stopAutoAdvance();
  });

  carousel.addEventListener('focusout', (event) => {
    if (!carousel.contains(event.relatedTarget)) {
      isFocused = false;
      startAutoAdvance();
    }
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stopAutoAdvance();
    } else {
      startAutoAdvance();
    }
  });

  reducedMotionQuery.addEventListener('change', (event) => {
    if (event.matches) {
      stopAutoAdvance();
    } else {
      startAutoAdvance();
    }
  });

  startAutoAdvance();
}

function loadAnalytics() {
  if (
    document.querySelector('script[data-website-id="ab0efb14-d7ce-4317-933c-cf2fbb7ddbde"]') ||
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1'
  ) {
    return;
  }

  const analyticsScript = document.createElement('script');
  analyticsScript.src = 'https://cloud.umami.is/script.js';
  analyticsScript.defer = true;
  analyticsScript.dataset.websiteId = 'ab0efb14-d7ce-4317-933c-cf2fbb7ddbde';
  document.head.appendChild(analyticsScript);
}

initRevealAnimations();
initTestimonials();

if ('requestIdleCallback' in window) {
  window.requestIdleCallback(loadAnalytics, { timeout: 2000 });
} else {
  window.addEventListener('load', () => window.setTimeout(loadAnalytics, 1000), { once: true });
}
