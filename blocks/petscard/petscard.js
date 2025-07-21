const API_KEY = 'live_KfTFOTZFqrx7MFhD8dzHnKFP8FCL1yfsgTMn3gY4TTjX7n7aQkeUZ3yDizq7MXGN';
const DOG_API_URL = 'https://api.thedogapi.com/v1/images/search?limit=6&has_breeds=true';

const updateStaticAdoptLinks = () => {
  const types = ['catcards', 'hamstercards', 'rabbitcards'];

  types.forEach((type) => {
    const petType = type.replace('cards', '');
    const cards = document.querySelectorAll(`.${type} .animalcard`);

    cards.forEach((card) => {
      const image = card.querySelector('.card-front img')?.src;
      const name = card.querySelector('.card-front p:last-of-type')?.textContent?.trim();
      const breed = card.querySelector('.card-back h2 strong')?.textContent?.trim();

      const id = Array.from(card.querySelectorAll('.card-back p'))
        .find((p) => p.textContent.includes('Pet ID:'))
        ?.textContent?.split(':')?.[1]?.trim();

      const adoptBtn = card.querySelector('.card-back .button');

      if (image && name && breed && id && adoptBtn) {
        const adoptURL = new URL('/en/adopt', window.location.origin);
        adoptURL.searchParams.set('PetImage', image);
        adoptURL.searchParams.set('Breed', breed);
        adoptURL.searchParams.set('PetType', petType.charAt(0).toUpperCase() + petType.slice(1));
        adoptURL.searchParams.set('PetID', id);

        adoptBtn.href = adoptURL.toString();
      }
    });
  });
};

const renderDogCards = (container, dogs) => {
  dogs.forEach((dog) => {
    const card = document.createElement('div');
    card.className = 'animalcard flip-card';

    const adoptLink = `/en/adopt?${new URLSearchParams({
      PetImage: dog.image,
      Breed: dog.name,
      PetType: 'Dog',
      PetID: dog.id,
    }).toString()}`;

    card.innerHTML = `
      <div class="card-inner flip-card-inner">
        <div class="card-front flip-card-front">
          <div>
            <picture>
              <img loading="lazy" alt='${dog.name}' src='${dog.image}' width='300' height='300'>
            </picture>
            <p>${dog.name}</p>
          </div>
        </div>
        <div class="card-back flip-card-back">
          <div data-align="center">
            <h2><strong>${dog.name}</strong></h2>
            <p><strong>Pet ID:</strong> ${dog.id}</p>
            <p><strong>Weight:</strong> ${dog.weight}</p>
            <p><strong>Height:</strong> ${dog.height}</p>
            <p><strong>Life Span:</strong> ${dog.lifespan}</p>
            <p><strong>Temperament:</strong> ${dog.temperament}</p>
            <p class="button-container">
              <a href='${adoptLink}' title='Adopt' class='button'>Adopt</a>
            </p>
          </div>
        </div>
      </div>
    `;

    container.appendChild(card);
  });

  setTimeout(() => {
    if (document.getElementById('quiz-toast')) return;

    const toast = document.createElement('div');
    toast.id = 'quiz-toast';
    toast.innerHTML = `
      <span>Discover the Animal Aligned with Your Energy</span>
      <a href="/quiz" class="quiz-toast-btn">Take the Quiz</a>
      <span class="quiz-toast-close">&times;</span>
    `;

    document.body.appendChild(toast);
    toast.querySelector('.quiz-toast-close').addEventListener('click', () => toast.remove());
  }, 3000);
};

const loadDogCards = async (container) => {
  const cacheKey = 'cachedDogs';
  const cached = localStorage.getItem(cacheKey);

  if (cached) {
    const dogs = JSON.parse(cached);
    renderDogCards(container, dogs);
    return;
  }

  try {
    const resp = await fetch(DOG_API_URL, {
      headers: { 'x-api-key': API_KEY },
    });

    const data = await resp.json();

    const dogArray = data
      .filter((entry) => entry.breeds && entry.breeds.length > 0)
      .map((entry, i) => {
        const dog = entry.breeds[0];
        return {
          name: dog.name || 'Unknown',
          id: `DO0${200 + i + 1}`,
          weight: `${dog.weight?.metric || 'N/A'} kg`,
          height: `${dog.height?.metric || 'N/A'} cm`,
          lifespan: dog.life_span || 'Unknown',
          temperament: dog.temperament || 'Not Available',
          image: entry.url || 'https://via.placeholder.com/300?text=No+Image',
        };
      });

    localStorage.setItem(cacheKey, JSON.stringify(dogArray));
    renderDogCards(container, dogArray);
  } catch (err) {
    // Handle error silently or log if needed
  }
};

export default async function decorate(block) {
  const wrapper = block.firstElementChild;
  if (!wrapper) return;

  const dogcardsBlock = document.querySelector('.dogcards');
  const [filterDiv, cardsSection] = wrapper.children;

  filterDiv.classList.add('filter-section');
  cardsSection.classList.add('cards-section');

  const ul = filterDiv.querySelector('ul');
  ul.classList.add('filter-list');

  const listItems = ul.querySelectorAll('li');
  listItems[0]?.classList.add('active');

  const typeMap = {
    Dog: 'dogcards',
    Cat: 'catcards',
    Rabbit: 'rabbitcards',
    Hamster: 'hamstercards',
  };

  const cardsContainers = document.querySelectorAll('.dogcards, .catcards, .rabbitcards, .hamstercards');
  cardsContainers.forEach((container, i) => {
    cardsSection.appendChild(container);
    container.classList.add('cards');
    if (i !== 0) container.classList.add('hidden');
  });

  if (dogcardsBlock && !dogcardsBlock.querySelector('.animalcard')) {
    await loadDogCards(dogcardsBlock);
  }

  listItems.forEach((li) => {
    li.addEventListener('click', () => {
      listItems.forEach((el) => el.classList.remove('active'));
      li.classList.add('active');

      const selected = li.textContent.trim();
      const selectedClass = typeMap[selected];

      cardsContainers.forEach((container) => {
        container.classList.toggle('hidden', !container.classList.contains(selectedClass));
      });
    });
  });

  setTimeout(updateStaticAdoptLinks, 100);
}
