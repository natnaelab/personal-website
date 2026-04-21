const dataNode = document.getElementById('testimonials-data');
const container = document.getElementById('quotes-container');
const dotsContainer = document.getElementById('quote-dots');
const prevButton = document.getElementById('q-prev');
const nextButton = document.getElementById('q-next');
const qWrap = document.getElementById('quote-wrap');

if (dataNode && container && dotsContainer && prevButton && nextButton && qWrap) {
  let data = [];

  try {
    data = JSON.parse(dataNode.textContent);
  } catch (error) {
    console.error('Unable to parse testimonials data.', error);
  }

  if (Array.isArray(data) && data.length > 0) {
    data.forEach((t, i) => {
      const card = document.createElement('div');
      card.className = 'quote-card' + (i === 0 ? ' active' : '');
      const sourceLabel = t.name ? `<span class="quote-source-name">${t.name} · </span>` : '';
      const stars = t.rating ? `<span class="quote-stars">${'★'.repeat(t.rating)}</span> ` : '';

      card.innerHTML = `
  <p class="quote-text">"${t.quote}"</p>
  <div class="quote-source">
    ${stars}${sourceLabel}${t.company_type} ·
    <a class="quote-verify" href="${t.profile_url}" target="_blank" rel="noopener">Verified on ${t.platform} ↗</a>
  </div>`;
      container.appendChild(card);

      const dot = document.createElement('span');
      dot.className = 'qdot' + (i === 0 ? ' active' : '');
      dot.dataset.i = i;
      dotsContainer.appendChild(dot);
    });

    const cards = document.querySelectorAll('.quote-card');
    const dots = document.querySelectorAll('.qdot');
    let current = 0;
    let autoQ;

    function showQuote(n) {
      cards[current].classList.remove('active');
      dots[current].classList.remove('active');
      current = (n + cards.length) % cards.length;
      cards[current].classList.add('active');
      dots[current].classList.add('active');
    }

    prevButton.addEventListener('click', () => showQuote(current - 1));
    nextButton.addEventListener('click', () => showQuote(current + 1));
    dots.forEach(d => d.addEventListener('click', () => showQuote(+d.dataset.i)));

    if (cards.length > 1) {
      autoQ = setInterval(() => showQuote(current + 1), 6000);

      qWrap.addEventListener('mouseenter', () => clearInterval(autoQ));
      qWrap.addEventListener('mouseleave', () => {
        autoQ = setInterval(() => showQuote(current + 1), 6000);
      });
    }
  }
}

const revealElements = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.06, rootMargin: '0px 0px -32px 0px' });

  revealElements.forEach(el => observer.observe(el));
} else {
  revealElements.forEach(el => el.classList.add('visible'));
}
