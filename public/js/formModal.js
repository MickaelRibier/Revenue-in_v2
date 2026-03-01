const BASE_URL = window.location.origin;

export function formSubmit() {
  const form = document.getElementById('mainContactForm');
  const modal = document.getElementById('contactModal');
  const closeBtn = document.getElementById('closeFormModalBtn');

  if (!form || !modal || !closeBtn) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const name = formData.get('name') || 'there';

    // Optimistic UI: show modal immediately
    const modalContent = document.querySelector('.modalContent p');
    modalContent.textContent = `Thanks for reaching out, ${name}! I'll be in touch shortly. In the meantime, feel free to check out my LinkedIn profile.`;
    modal.classList.add('modalOn');

    // Send data to backend (fire and forget — modal is already shown)
    await postToBackend(formData);
    form.reset();
  });

  closeBtn.addEventListener('click', () => {
    modal.classList.remove('modalOn');
  });

  // Close modal on overlay click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('modalOn');
    }
  });

  // Close modal on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('modalOn')) {
      modal.classList.remove('modalOn');
    }
  });
}

async function postToBackend(formData) {
  try {
    const response = await fetch(`${BASE_URL}/contact`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      console.warn('[RevenueIn] Contact form: server responded with', response.status);
    }

    const json = await response.json();
    return json;
  } catch (error) {
    console.error('[RevenueIn] Contact form submission error:', error);
    return null;
  }
}
