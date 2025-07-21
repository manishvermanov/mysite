export default function decorate(block) {
  const questions = block.querySelectorAll('h1');
  const allLists = block.querySelectorAll('ul');
  let currentQuestion = 0;
  const userAnswers = [];

  // ✅ Inline pet data (you can expand this up to 243 or 1024 if needed)
  const petData = [
    [
      { animal: 'dog', breed: 'Akita', index: 1 },
      { animal: 'dog', breed: 'Shih Tzu', index: 2 },
      { animal: 'dog', breed: 'German Shepherd', index: 3 },
      { animal: 'dog', breed: 'Border Collie', index: 4 },
      { animal: 'dog', breed: 'Cocker Spaniel', index: 5 },
      { animal: 'dog', breed: 'Saint Bernard', index: 8 },
      { animal: 'dog', breed: 'Chihuahua', index: 10 },
      { animal: 'dog', breed: 'Doberman', index: 12 },
      { animal: 'dog', breed: 'Bulldog', index: 13 },
      { animal: 'dog', breed: 'Yorkshire Terrier', index: 14 },
      { animal: 'dog', breed: 'Boxer', index: 16 },
      { animal: 'dog', breed: 'Pomeranian', index: 17 },
      { animal: 'dog', breed: 'Beagle', index: 19 },
      { animal: 'dog', breed: 'Rottweiler', index: 20 },
      { animal: 'dog', breed: 'Labrador Retriever', index: 21 },
      { animal: 'dog', breed: 'Great Dane', index: 23 },
      { animal: 'dog', breed: 'Golden Retriever', index: 27 },
      { animal: 'dog', breed: 'Australian Shepherd', index: 29 },
      { animal: 'dog', breed: 'Dachshund', index: 31 },
      { animal: 'dog', breed: 'Poodle', index: 38 },
      { animal: 'cat', breed: 'Scottish Fold', index: 101 },
      { animal: 'cat', breed: 'Tonkinese', index: 102 },
      { animal: 'cat', breed: 'Manx', index: 103 },
      { animal: 'cat', breed: 'Norwegian Forest', index: 105 },
      { animal: 'cat', breed: 'Maine Coon', index: 106 },
      { animal: 'cat', breed: 'Birman', index: 107 },
      { animal: 'cat', breed: 'Savannah', index: 108 },
      { animal: 'cat', breed: 'Sphynx', index: 111 },
      { animal: 'cat', breed: 'Oriental Shorthair', index: 112 },
      { animal: 'cat', breed: 'Chartreux', index: 113 },
      { animal: 'cat', breed: 'American Curl', index: 114 },
      { animal: 'cat', breed: 'Siamese', index: 115 },
      { animal: 'cat', breed: 'Russian Blue', index: 118 },
      { animal: 'cat', breed: 'Bengal', index: 122 },
      { animal: 'cat', breed: 'Ragdoll', index: 124 },
      { animal: 'cat', breed: 'Persian', index: 132 },
      { animal: 'cat', breed: 'Himalayan', index: 138 },
      { animal: 'cat', breed: 'British Shorthair', index: 143 },
      { animal: 'cat', breed: 'Turkish Angora', index: 145 },
      { animal: 'cat', breed: 'Abyssinian', index: 147 },
      { animal: 'hamster', breed: 'Albino Syrian', index: 171 },
      { animal: 'hamster', breed: 'Winter White Russian', index: 172 },
      { animal: 'hamster', breed: 'Long-Haired', index: 174 },
      { animal: 'hamster', breed: 'Golden', index: 175 },
      { animal: 'hamster', breed: 'Short-Haired', index: 176 },
      { animal: 'hamster', breed: 'Chinese', index: 177 },
      { animal: 'hamster', breed: 'Rex', index: 180 },
      { animal: 'hamster', breed: 'Panda Bear', index: 181 },
      { animal: 'hamster', breed: 'Dwarf Campbell Russian', index: 182 },
      { animal: 'hamster', breed: 'Teddy Bear', index: 183 },
      { animal: 'hamster', breed: 'Roborovski', index: 187 },
      { animal: 'hamster', breed: 'Fancy Bear', index: 192 },
      { animal: 'hamster', breed: 'Satin', index: 197 },
      { animal: 'hamster', breed: 'Black Bear', index: 204 },
      { animal: 'rabbit', breed: 'Dutch', index: 207 },
      { animal: 'rabbit', breed: 'Netherland Dwarf', index: 208 },
      { animal: 'rabbit', breed: 'Holland Lop', index: 209 },
      { animal: 'rabbit', breed: 'Mini Rex', index: 210 },
      { animal: 'rabbit', breed: 'Rex', index: 211 },
      { animal: 'rabbit', breed: 'Mini Lop', index: 212 },
      { animal: 'rabbit', breed: 'Silver Marten', index: 213 },
      { animal: 'rabbit', breed: 'English Lop', index: 217 },
      { animal: 'rabbit', breed: 'Flemish Giant', index: 219 },
      { animal: 'rabbit', breed: 'American Fuzzy Lop', index: 220 },
      { animal: 'rabbit', breed: 'English Angora', index: 222 },
      { animal: 'rabbit', breed: 'Harlequin', index: 232 },
      { animal: 'rabbit', breed: 'Himalayan', index: 233 },
      { animal: 'rabbit', breed: 'French Lop', index: 239 },
    ],
  ];

  function showQuestion(index) {
    questions.forEach((q, i) => {
      q.style.display = i === index ? 'block' : 'none';
      allLists[i].style.display = i === index ? 'block' : 'none';
    });
  }

  function calculateResult() {
    const flatData = petData.flat(); // 🟢 flatten the nested array
    const index = userAnswers.reduce(
      (sum, val, i) => sum + val * 3 ** (4 - i),
      0,
    );
    const match = flatData[index % flatData.length];

    const resultEl = document.createElement('div');
    resultEl.className = 'quiz-result';
    resultEl.innerHTML = `
    <h2>🐾 Your pet personality match is:</h2>
    <h3>${match.breed} (${match.animal})</h3>
  `;
    block.appendChild(resultEl);
  }

  function setupQuiz() {
    allLists.forEach((ul) => {
      const items = ul.querySelectorAll('li');
      items.forEach((li, optionIndex) => {
        li.style.cursor = 'pointer';
        li.addEventListener('click', () => {
          userAnswers.push(optionIndex);
          if (currentQuestion < questions.length - 1) {
            currentQuestion += 1;
            showQuestion(currentQuestion);
          } else {
            questions[currentQuestion].style.display = 'none';
            allLists[currentQuestion].style.display = 'none';
            calculateResult();
          }
        });
      });
    });

    showQuestion(0);
  }

  const wrapper = document.querySelector(
    '.quiz-container > .default-content-wrapper',
  );
  if (wrapper) {
    wrapper.classList.add('hero-background-wrapper');

    // ✅ Fix lazy-loading on background LCP image
    const bgImg = wrapper.querySelector('img[loading="lazy"]');
    if (bgImg) {
      bgImg.removeAttribute('loading');
      bgImg.setAttribute('fetchpriority', 'high');
    }
  }
  setupQuiz();
}
