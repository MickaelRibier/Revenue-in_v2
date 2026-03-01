const slider = {
  prevBtn: null,
  nextBtn: null,
  position: 0,
  reviews: null,
  navItems: null,

  init() {
    slider.reviews = document.querySelectorAll('.reviews');
    if (!slider.reviews.length) return;

    const prevBtn = document.querySelector('.slider_btn-prev');
    const nextBtn = document.querySelector('.slider_btn-next');
    if (prevBtn) prevBtn.addEventListener('click', slider.prevRev);
    if (nextBtn) nextBtn.addEventListener('click', slider.nextRev);

    slider.createNavItems();
    slider.showReview(0);
  },

  prevRev() {
    let pos = slider.position - 1;
    if (pos < 0) pos = slider.reviews.length - 1;
    slider.showReview(pos);
  },

  nextRev() {
    let pos = slider.position + 1;
    if (pos >= slider.reviews.length) pos = 0;
    slider.showReview(pos);
  },

  showReview(p) {
    slider.reviews.forEach((el) => el.classList.remove('active'));
    slider.reviews[p].classList.add('active');
    slider.position = p;
    slider.updateNavItems();
  },

  createNavItems() {
    const container = document.querySelector('.nav-items_container');
    if (!container) return;
    container.innerHTML = '';
    slider.reviews.forEach((_, i) => {
      const dot = document.createElement('div');
      dot.classList.add('nav-item');
      dot.setAttribute('aria-label', `Testimonial ${i + 1}`);
      dot.addEventListener('click', () => slider.showReview(i));
      container.appendChild(dot);
    });
    slider.navItems = container.querySelectorAll('.nav-item');
  },

  updateNavItems() {
    if (!slider.navItems) return;
    slider.navItems.forEach((el) => el.classList.remove('nav-item_active'));
    if (slider.navItems[slider.position]) {
      slider.navItems[slider.position].classList.add('nav-item_active');
    }
  },
};

export function initSlider() {
  slider.init();
}
