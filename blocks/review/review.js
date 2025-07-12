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
export default async function decorate(block) {
  const links = [...block.querySelectorAll('a')].map((a) => a.href);
  const formLink = links.find(
    (link) => link.startsWith(window.location.origin) && link.endsWith('.json'),
  );
  const submitLink = links.find((link) => link !== formLink);
  if (!formLink || !submitLink) return;

  const form = await createForm(formLink, submitLink);
  block.replaceChildren(form);

  const modalContainer = document.querySelector('.smallmodal-container');
  if (modalContainer) {
    Object.assign(modalContainer.style, {
      display: 'none',
      position: 'fixed',
      top: '0',
      left: '0',
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(0,0,0,0.6)',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: '9999',
    });

    const wrapper = modalContainer.querySelector('.smallmodal-wrapper');
    wrapper.style.position = 'relative';

    const closeBtn = document.createElement('button');
    closeBtn.textContent = 'X';
    closeBtn.style = `
      position: absolute;
      top: 12px;
      right: 12px;
      background: black;
      color: white;
      border: none;
      border-radius: 4px;
      padding: 0.3rem 0.6rem;
      cursor: pointer;
      font-size: 14px;
    `;
    closeBtn.addEventListener('click', () => {
      modalContainer.style.display = 'none';
    });
    wrapper.appendChild(closeBtn);
  }

  const ownerNameField = form.querySelector('[name="OwnerName"]');
  const petNameField = form.querySelector('[name="PetName"]');
  const photoField = form.querySelector('[name="Photo"]');
  const experienceField = form.querySelector('[name="Experience"]');
  const postExpField = form.querySelector('[name="PostExp"]');

  const validations = [
    {
      field: ownerNameField,
      min: 4,
      msg: 'Owner Name must be at least 4 characters',
    },
    {
      field: petNameField,
      min: 2,
      msg: 'Pet Name must be at least 2 characters',
    },
    {
      field: experienceField,
      min: 20,
      msg: 'Experience must be at least 20 characters',
    },
    {
      field: photoField,
      required: true,
      msg: 'Please upload a photo',
    },
    {
      field: postExpField,
      required: true,
      msg: 'Please select where to post your experience',
    },
  ];

  const showError = (field, msg) => {
    let error = field.nextElementSibling;
    if (!error || !error.classList.contains('error-msg')) {
      error = document.createElement('div');
      error.className = 'error-msg';
      field.parentNode.appendChild(error);
    }
    error.textContent = msg;
  };

  const clearError = (field) => {
    const error = field.nextElementSibling;
    if (error && error.classList.contains('error-msg')) {
      error.textContent = '';
    }
  };

  // 🔁 Blur validation
  validations.forEach(({
    field, min, required, msg,
  }) => {
    if (!field) return;
    field.addEventListener('blur', () => {
      const val = field.value.trim();
      if ((required && !val) || (min && val.length < min)) {
        showError(field, msg);
      } else {
        clearError(field);
      }
    });
  });

  // ✅ Form submission
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    let isValid = true;

    validations.forEach(({
      field, min, required, msg,
    }) => {
      if (!field) return;
      const val = field.value.trim();
      if ((required && !val) || (min && val.length < min)) {
        showError(field, msg);
        isValid = false;
      } else {
        clearError(field);
      }
    });

    if (!isValid) {
      const firstInvalid = form.querySelector('.error-msg:not(:empty)');
      if (firstInvalid) {
        firstInvalid.previousElementSibling.focus();
        firstInvalid.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    try {
      form.setAttribute('data-submitting', 'true');
      submitBtn.disabled = true;

      const payload = generatePayload(form);
      const response = await fetch(form.dataset.action, {
        method: 'POST',
        body: JSON.stringify({ data: payload }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        modalContainer.style.display = 'flex';
        form.reset();
        form.querySelectorAll('.error-msg').forEach((el) => {
          el.textContent = '';
        });
      } else {
        const error = await response.text();
        throw new Error(error);
      }
    } catch (err) {
      // Replace alert with a user-friendly message in the UI
      const errorMsg = document.createElement('div');
      errorMsg.className = 'form-global-error';
      errorMsg.textContent = 'Something went wrong. Please try again later.';
      form.prepend(errorMsg);
    } finally {
      form.setAttribute('data-submitting', 'false');
      submitBtn.disabled = false;
    }
  });
}
