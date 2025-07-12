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
    if (field) {
      form.append(field);
    }
  });

  // group fields into fieldsets
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

async function handleSubmit(form) {
  if (form.getAttribute('data-submitting') === 'true') return;

  const submit = form.querySelector('button[type="submit"]');
  try {
    form.setAttribute('data-submitting', 'true');
    submit.disabled = true;

    const payload = generatePayload(form);
    const response = await fetch(form.dataset.action, {
      method: 'POST',
      body: JSON.stringify({ data: payload }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok && form.dataset.confirmation) {
      window.location.href = form.dataset.confirmation;
    } else if (!response.ok) {
      const error = await response.text();
      throw new Error(error);
    }
  } catch (e) {
    // this is a comment for eslint
  } finally {
    form.setAttribute('data-submitting', 'false');
    submit.disabled = false;
  }
}

// ✅ Prefill logic
function prefillFromURL(form) {
  const params = new URLSearchParams(window.location.search);
  params.forEach((value, key) => {
    const input = form.querySelector(`[name="${key}"]`);
    if (input) input.value = decodeURIComponent(value);
  });
}
export default async function decorate(block) {
  const links = [...block.querySelectorAll('a')].map((a) => a.href);
  const formLink = links.find(
    (link) => link.startsWith(window.location.origin) && link.endsWith('.json'),
  );
  const submitLink = links.find((link) => link !== formLink);
  if (!formLink || !submitLink) return;

  const form = await createForm(formLink, submitLink);
  block.replaceChildren(form);

  // ⬇️ Prefill once form is built
  prefillFromURL(form);

  // ✅ Inject Pet Image Preview if available
  const params = new URLSearchParams(window.location.search);
  const petImageUrl = params.get('PetImage');

  if (petImageUrl) {
    // Update hidden input value (if exists)
    const hiddenInput = form.querySelector('input[name="PetImage"]');
    if (hiddenInput) hiddenInput.value = petImageUrl;

    // Create a container div styled like a form field
    const wrapper = document.createElement('div');
    wrapper.className = 'field-wrapper pet-photo-preview-wrapper';
    wrapper.dataset.fieldset = '';

    const img = document.createElement('img');
    img.src = petImageUrl;
    img.alt = 'Pet Preview';
    img.className = 'form-photo-card';

    wrapper.appendChild(img);

    // Insert before the submit button
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
      // Create left and right column wrappers
      const combinedWrapper = document.createElement('div');
      combinedWrapper.className = 'form-top-row';
      combinedWrapper.className = 'form-top-row no-bottom-margin';

      const leftCol = document.createElement('div');
      leftCol.className = 'form-left';
      leftCol.appendChild(fullnameField);
      leftCol.appendChild(emailField);
      leftCol.appendChild(phoneField);

      const rightCol = document.createElement('div');
      rightCol.className = 'form-right';
      rightCol.appendChild(wrapper); // contains the image

      combinedWrapper.appendChild(leftCol);
      combinedWrapper.appendChild(rightCol);

      // Insert above the next field
      const breedField = form
        .querySelector('#form-breed')
        ?.closest('.field-wrapper');
      form.insertBefore(combinedWrapper, breedField);
    }
  }

  // Submit listener
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (form.checkValidity()) {
      handleSubmit(form);
    } else {
      const firstInvalidEl = form.querySelector(':invalid:not(fieldset)');
      if (firstInvalidEl) {
        firstInvalidEl.focus();
        firstInvalidEl.scrollIntoView({ behavior: 'smooth' });
      }
    }
  });
}
