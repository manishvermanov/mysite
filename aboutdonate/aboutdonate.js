export default function decorate(block) {
  const wrapper = block.closest('.aboutdonate-wrapper');
  if (!wrapper) return;

  const donateBtn = wrapper.querySelector('.button-container a.button');
  if (!donateBtn) return;

  // Check if Razorpay script is already loaded
  const loadRazorpayScript = () => {
    return new Promise((resolve, reject) => {
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
  };

  // Replace default href action
  donateBtn.href = '#';
  donateBtn.addEventListener('click', async (e) => {
    e.preventDefault();

    try {
      await loadRazorpayScript();

      const options = {
        key: 'rzp_test_hRCqzEQGaZ88Pm', // Replace with your Razorpay Test Key
        amount: 10000, // 10000 paise = ₹100
        currency: 'INR',
        name: 'FurreverHome',
        description: 'Support Animal Welfare',
        image: 'https://yourdomain.com/logo.png', // Optional: Replace with your logo
        handler: function (response) {
          alert('🎉 Donation Successful!\nPayment ID: ' + response.razorpay_payment_id);
        },
        prefill: {
          name: '',
          email: '',
          contact: '',
        },
        theme: {
          color: '#f37350',
        },
      };

      const rzp = new Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error('Razorpay failed to load:', err);
      alert('Something went wrong while opening payment. Please try again later.');
    }
  });
}
