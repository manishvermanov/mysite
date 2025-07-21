/* global Razorpay */

export default function decorate(block) {
  // --- Tooltip helpers ---
  function showTooltip(tooltip) {
    tooltip.classList.remove('hidden');
    tooltip.classList.add('visible');
  }

  function hideTooltip(tooltip) {
    tooltip.classList.remove('visible');
    tooltip.classList.add('hidden');
  }

  // --- Toast Notification Helper ---
  function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `custom-toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => toast.classList.add('visible'), 100);
    setTimeout(() => {
      toast.classList.remove('visible');
      toast.addEventListener('transitionend', () => toast.remove());
    }, 4000);
  }

  // --- Donation section setup ---
  const donateWrapper = block.closest('.aboutdonate-wrapper');
  if (donateWrapper) {
    const donateBtn = donateWrapper.querySelector('.button-container a.button');
    if (donateBtn) {
      const amountWrapper = document.createElement('div');
      amountWrapper.className = 'amount-input hidden';

      const amountLabel = document.createElement('label');
      amountLabel.setAttribute('for', 'donation-amount');
      amountLabel.textContent = 'Enter Amount (INR): ';
      amountLabel.className = 'amount-label';

      const amountInput = document.createElement('input');
      amountInput.type = 'number';
      amountInput.id = 'donation-amount';
      amountInput.min = '1';
      amountInput.placeholder = 'e.g., 500';
      amountInput.className = 'amount-input-field';

      const errorMsg = document.createElement('div');
      errorMsg.className = 'error-msg';
      errorMsg.style.display = 'none';
      errorMsg.textContent = 'Please enter a valid donation amount.';

      amountWrapper.appendChild(amountLabel);
      amountWrapper.appendChild(amountInput);
      amountWrapper.appendChild(errorMsg);
      donateBtn.parentElement.insertBefore(amountWrapper, donateBtn);

      const loadRazorpayScript = () => new Promise((resolve, reject) => {
        if (typeof Razorpay !== 'undefined') {
          resolve();
          return;
        }
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Failed to load Razorpay script.'));
        document.body.appendChild(script);
      });

      let inputRevealed = false;
      donateBtn.href = '#';

      // Tooltip box
      const tooltip = document.createElement('div');
      tooltip.className = 'donation-helper-tooltip hidden';
      tooltip.innerHTML = `
        <p>Trouble finding UPI option? <a href="#" class="tooltip-link">Click here</a></p>
        <button class="tooltip-close">×</button>
      `;
      document.body.appendChild(tooltip);

      tooltip
        .querySelector('.tooltip-close')
        .addEventListener('click', () => hideTooltip(tooltip));

      tooltip.querySelector('.tooltip-link').addEventListener('click', (e) => {
        e.preventDefault();
        const upiModal = document.querySelector('.upimodal-wrapper');
        if (upiModal) {
          upiModal.classList.remove('hidden');
          upiModal.style.display = 'block';
          // Scroll into view after it's visible
          requestAnimationFrame(() => {
            upiModal.scrollIntoView({ behavior: 'smooth', block: 'start' });
          });
        }
      });

      donateBtn.addEventListener('click', async (e) => {
        e.preventDefault();

        if (!inputRevealed) {
          amountWrapper.classList.remove('hidden');
          donateBtn.textContent = 'Proceed to Pay';
          inputRevealed = true;
          return;
        }

        const enteredAmount = parseInt(amountInput.value, 10);
        if (Number.isNaN(enteredAmount) || enteredAmount <= 0) {
          errorMsg.style.display = 'block';
          return;
        }
        errorMsg.style.display = 'none';

        setTimeout(() => showTooltip(tooltip), 5000);

        try {
          await loadRazorpayScript();

          const options = {
            key: 'rzp_test_hRCqzEQGaZ88Pm',
            amount: enteredAmount * 100,
            currency: 'INR',
            name: 'FurreverHome',
            description: 'Support Animal Welfare',
            handler(response) {
              showToast(
                `🎉 Donation Successful! Payment ID: ${response.razorpay_payment_id}`,
                'success',
              );
            },
            prefill: { name: '', email: '', contact: '' },
            theme: { color: '#ff9a24' },
          };

          const rzp = new Razorpay(options);
          rzp.on('payment.failed', (response) => {
            showToast(
              `❌ Payment failed: ${response.error.description}`,
              'error',
            );
          });

          rzp.open();
        } catch (err) {
          showToast(
            'Something went wrong while opening payment. Please try again later.',
            'error',
          );
        }
      });
    }
  }

  // --- UPI Modal setup ---
  const modalWrapper = document.querySelector('.upimodal-wrapper');
  if (modalWrapper) {
    // Retain or implement UPI modal logic here as needed
  }
}
