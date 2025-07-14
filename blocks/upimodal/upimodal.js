export default function decorate(block) {
  const wrapper = block.closest('.upimodal-wrapper');
  if (!wrapper) return;

  const modal = wrapper.querySelector('.upimodal');
  const inputsList = modal.querySelectorAll('ul')[0];
  const payImageContainer = modal.querySelector('picture');
  const paymentOptions = modal.querySelectorAll('ul')[1].querySelectorAll('li');

  const validatePayP = modal.querySelector('p:nth-of-type(1)');
  const payP = modal.querySelector('p:nth-of-type(2)');

  const uid = `-${Date.now()}`;

  // --- Close Button (❌) ---
  const closeBtn = document.createElement('span');
  closeBtn.textContent = '✖';
  closeBtn.className = 'modal-close-btn';
  closeBtn.addEventListener('click', () => {
    wrapper.style.display = 'none';
  });
  modal.appendChild(closeBtn);

  modal.style.position = 'relative';

  // --- Amount Input ---
  const amountLi = document.createElement('li');
  const amountLabel = document.createElement('label');
  amountLabel.textContent = 'Amount';
  amountLabel.setAttribute('for', `donation-amount${uid}`);

  const amountInput = document.createElement('input');
  amountInput.type = 'number';
  amountInput.id = `donation-amount${uid}`;
  amountInput.name = `donation-amount${uid}`;
  amountInput.placeholder = 'Enter Amount (INR)';
  amountInput.className = 'upi-input';

  const amountError = document.createElement('div');
  amountError.className = 'error-msg amount-error';

  amountInput.addEventListener('blur', () => {
    const value = parseFloat(amountInput.value);
    if (Number.isNaN(value) || value < 1) {
      amountError.textContent = 'Enter a valid amount greater than ₹1';
      amountError.style.display = 'block';
    }
  });

  amountInput.addEventListener('focus', () => {
    amountError.style.display = 'none';
  });

  amountLi.appendChild(amountLabel);
  amountLi.appendChild(amountInput);
  amountLi.appendChild(amountError);

  // --- UPI Input ---
  const upiLi = document.createElement('li');
  const upiLabel = document.createElement('label');
  upiLabel.textContent = 'UPI ID';
  upiLabel.setAttribute('for', `upi-id${uid}`);

  const upiInput = document.createElement('input');
  upiInput.type = 'text';
  upiInput.id = `upi-id${uid}`;
  upiInput.name = `upi-id${uid}`;
  upiInput.placeholder = 'Enter UPI ID';
  upiInput.className = 'upi-input';

  upiLi.appendChild(upiLabel);
  upiLi.appendChild(upiInput);

  // --- Checkbox + UPI Validation ---
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.className = 'validate-checkbox';
  checkbox.id = `validate-upi${uid}`;
  checkbox.name = `validate-upi${uid}`;

  validatePayP.classList.add('validate-wrapper');
  validatePayP.innerHTML = '';

  const checkboxLabel = document.createElement('label');
  checkboxLabel.setAttribute('for', checkbox.id);
  checkboxLabel.className = 'validate-label';
  checkboxLabel.appendChild(checkbox);
  checkboxLabel.append(' Validate UPI ID');

  const upiValidationMsg = document.createElement('span');
  upiValidationMsg.className = 'upi-error-msg';

  validatePayP.appendChild(checkboxLabel);
  validatePayP.appendChild(upiValidationMsg);
  upiLi.appendChild(validatePayP);

  // --- Pay Button ---
  const payButton = document.createElement('button');
  payButton.className = 'pay-button';
  payButton.textContent = 'Pay';
  payP.replaceWith(payButton);

  // --- Add to List ---
  inputsList.innerHTML = '';
  inputsList.append(amountLi, upiLi);

  // --- Tab toggle ---
  payImageContainer.style.display = 'none';
  payButton.style.display = 'block';
  paymentOptions[0].classList.add('active');

  paymentOptions.forEach((opt) => {
    opt.addEventListener('click', () => {
      paymentOptions.forEach((o) => o.classList.remove('active'));
      opt.classList.add('active');

      const method = opt.textContent.trim();
      if (method === 'UPI') {
        inputsList.style.display = 'block';
        payButton.style.display = 'block';
        payImageContainer.style.display = 'none';
      } else {
        inputsList.style.display = 'none';
        payButton.style.display = 'none';
        payImageContainer.style.display = 'block';
      }
    });
  });

  // --- Validate UPI and Amount on checkbox ---
  checkbox.addEventListener('change', () => {
    const upi = upiInput.value.trim();
    const amount = parseFloat(amountInput.value);
    const upiRegex = /^[a-zA-Z0-9]+@[a-zA-Z]+$/;

    upiValidationMsg.style.display = 'inline';

    if (!upiRegex.test(upi)) {
      upiValidationMsg.textContent = '❌ Invalid UPI (e.g. name@bank)';
      upiValidationMsg.style.color = 'red';
    } else if (Number.isNaN(amount) || amount < 1) {
      upiValidationMsg.textContent = '❌ Amount must be greater than ₹1';
      upiValidationMsg.style.color = 'red';
    } else {
      upiValidationMsg.textContent = '✅ Valid UPI';
      upiValidationMsg.style.color = 'green';
    }
  });
}
