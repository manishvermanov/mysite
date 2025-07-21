import createField from './form-fields.js';

async function createForm(formHref, submitHref) {
  const { pathname } = new URL(formHref);
  const resp = await fetch(pathname);
  const json = await resp.json();

  const form = document.createElement('form');
  form.dataset.action = submitHref;

  const fields = await Promise.all(
    json.data.map((fd) => createField(fd, form)),
  );
  fields.forEach((field) => {
    if (field) form.append(field);
  });

  const fieldsets = form.querySelectorAll('fieldset');
  fieldsets.forEach((fieldset) => {
    form
      .querySelectorAll(`[data-fieldset="${fieldset.name}"`)
      .forEach((field) => {
        fieldset.append(field);
      });
  });

  return form;
}

function generatePayload(form) {
  const payload = {};

  [...form.elements].forEach((field) => {
    if (field.name && field.type !== 'submit' && !field.disabled) {
      if (field.type === 'radio') {
        if (field.checked) payload[field.name] = field.value;
      } else if (field.type === 'checkbox') {
        if (field.checked) {
          payload[field.name] = payload[field.name]
            ? `${payload[field.name]},${field.value}`
            : field.value;
        }
      } else {
        payload[field.name] = field.value;
      }
    }
  });

  return payload;
}

function sendEmail(payload) {
  const followUp = payload.FollowUp || '';
  const templateParams = {
    name: payload.FullName || '',
    email: payload.Email || '',
    title: payload.PetType || '',
    message: payload.PetReason || '',
    pet_id: payload.PetID || '',
    breed: payload.Breed || '',
    follow_up: followUp,
  };

  let templateId = '';
  if (followUp === 'Schedule a Call') templateId = 'template_mlp4z1a';
  else if (followUp === 'Visit Us') templateId = 'template_ll3vkl9';
  else if (followUp === 'Meet Pet on Video Call') templateId = 'template_xyz123';

  if (!templateId) {
    throw new Error(
      'No valid template ID found for selected follow-up option.',
    );
  }

  return window.emailjs.send('service_dqo4wzw', templateId, templateParams);
}

function createSuccessModal() {
  const modal = document.createElement('div');
  modal.id = 'successModal';
  modal.className = 'adoptmodal-container show';

  modal.innerHTML = `
    <div class="adoptmodal-wrapper">
      <button class="modal-close-btn" onclick="document.getElementById('successModal').style.display='none'">X</button>
      <h2>Success!</h2>
      <p>Your adoption request was submitted successfully!</p>
    </div>
  `;

  document.body.appendChild(modal);
  modal.style.display = 'flex';
}

async function handleSubmit(form) {
  if (form.getAttribute('data-submitting') === 'true') return;

  const submit = form.querySelector('button[type="submit"]');
  try {
    form.setAttribute('data-submitting', 'true');
    submit.disabled = true;

    const payload = generatePayload(form);
    await sendEmail(payload);
    createSuccessModal();
    form.reset();
  } catch (e) {
    // fail silently
  } finally {
    form.setAttribute('data-submitting', 'false');
    submit.disabled = false;
  }
}

function prefillFromURL(form) {
  const params = new URLSearchParams(window.location.search);
  params.forEach((value, key) => {
    const input = form.querySelector(`[name="${key}"]`);
    if (input) input.value = decodeURIComponent(value);
  });
}

function validateField(field) {
  const { name } = field;
  const value = field.value.trim();
  const errorEl = field.nextElementSibling;

  let errorMessage = '';

  if (name === 'FullName' && value.length < 3) {
    errorMessage = 'Name must be at least 3 characters long.';
  } else if (name === 'Email' && !/^\S+@\S+\.\S+$/.test(value)) {
    errorMessage = 'Please enter a valid email address.';
  } else if (name === 'PhoneNumber' && !/^\d{10}$/.test(value)) {
    errorMessage = 'Phone number must be exactly 10 digits.';
  } else if (name === 'PetID' && !/^[A-Za-z]{2}\d{4}$/.test(value)) {
    errorMessage = 'Pet ID must be 2 letters followed by 4 digits.';
  } else if (name === 'PetReason' && value.length < 20) {
    errorMessage = 'Please describe your reason in at least 20 characters.';
  }

  if (errorMessage) {
    field.classList.add('invalid');
    if (errorEl && errorEl.classList.contains('field-error')) {
      errorEl.textContent = errorMessage;
      errorEl.style.display = 'block';
    }
    return false;
  }
  field.classList.remove('invalid');
  if (errorEl && errorEl.classList.contains('field-error')) {
    errorEl.textContent = '';
    errorEl.style.display = 'none';
  }
  return true;
}

function addCustomValidation(form) {
  const fields = form.querySelectorAll('input[name], textarea[name]');

  fields.forEach((field) => {
    const errorEl = document.createElement('div');
    errorEl.className = 'field-error';
    errorEl.style.display = 'none';
    field.insertAdjacentElement('afterend', errorEl);

    field.addEventListener('blur', () => {
      validateField(field);
    });

    field.addEventListener('focus', () => {
      field.classList.remove('invalid');
      errorEl.textContent = '';
      errorEl.style.display = 'none';
    });
  });
}

export default async function decorate(block) {
  window.emailjs.init('ibRHtKsS0uRA-oFfN');

  const links = [...block.querySelectorAll('a')].map((a) => a.href);
  const formLink = links.find(
    (link) => link.startsWith(window.location.origin) && link.endsWith('.json'),
  );
  const submitLink = links.find((link) => link !== formLink);
  if (!formLink || !submitLink) return;

  const form = await createForm(formLink, submitLink);
  block.replaceChildren(form);

  prefillFromURL(form);

  const params = new URLSearchParams(window.location.search);
  const petImageUrl = params.get('PetImage');

  if (petImageUrl) {
    const hiddenInput = form.querySelector('input[name="PetImage"]');
    if (hiddenInput) hiddenInput.value = petImageUrl;

    const wrapper = document.createElement('div');
    wrapper.className = 'field-wrapper pet-photo-preview-wrapper';
    wrapper.dataset.fieldset = '';

    const img = document.createElement('img');
    img.src = petImageUrl;
    img.alt = 'Pet Preview';
    img.className = 'form-photo-card';
    wrapper.appendChild(img);

    const fullnameField = form
      .querySelector('#form-fullname')
      ?.closest('.field-wrapper');
    const emailField = form
      .querySelector('#form-email')
      ?.closest('.field-wrapper');
    const phoneField = form
      .querySelector('#form-phonenumber')
      ?.closest('.field-wrapper');

    if (fullnameField && emailField && phoneField) {
      const combinedWrapper = document.createElement('div');
      combinedWrapper.className = 'form-top-row no-bottom-margin';

      const leftCol = document.createElement('div');
      leftCol.className = 'form-left';
      leftCol.appendChild(fullnameField);
      leftCol.appendChild(emailField);
      leftCol.appendChild(phoneField);

      const rightCol = document.createElement('div');
      rightCol.className = 'form-right';
      rightCol.appendChild(wrapper);

      combinedWrapper.appendChild(leftCol);
      combinedWrapper.appendChild(rightCol);

      const breedField = form
        .querySelector('#form-breed')
        ?.closest('.field-wrapper');
      form.insertBefore(combinedWrapper, breedField);
    }
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const allFields = [...form.querySelectorAll('input[name], textarea[name]')];
    const allValid = allFields.map(validateField).every(Boolean);

    if (allValid && form.checkValidity()) {
      handleSubmit(form);
    } else {
      const firstInvalidEl = form.querySelector('.invalid');
      if (firstInvalidEl) {
        firstInvalidEl.focus();
        firstInvalidEl.scrollIntoView({ behavior: 'smooth' });
      }
    }
  });

  addCustomValidation(form);

  // LCP Optimization: Force eager loading and fetchpriority for LCP image
  const lcpImage = document.querySelector(
    '.default-content-wrapper picture img',
  );
  if (lcpImage) {
    lcpImage.setAttribute('loading', 'eager');
    lcpImage.setAttribute('fetchpriority', 'high');
    lcpImage.setAttribute('decoding', 'async');
  }
}
