export default async function decorate(block) {
  // Locate the block’s container structure
  const wrapper = block.closest('.petscard-wrapper');
  if (!wrapper) {
    // wrapper not found
    return;
  }

  const container = block.querySelector(':scope > div');
  if (!container || container.children.length < 2) {
    // conatiner not found
    return;
  }

  // Apply layout classes
  container.classList.add('cardparent');

  const categoryList = container.children[0];
  const cardsArea = container.children[1];

  categoryList.classList.add('catcards');
  cardsArea.classList.add('actcards');
  cardsArea.id = 'animalCards';

  // Add flip-card structure classes
  const cards = cardsArea.querySelectorAll('.character-card');
  cards.forEach((card) => {
    card.classList.add('flip-card');

    const cardInner = card.querySelector('.card-inner');
    if (cardInner) cardInner.classList.add('flip-card-inner');

    const front = card.querySelector('.card-front');
    if (front) front.classList.add('flip-card-front');

    const back = card.querySelector('.card-back');
    if (back) back.classList.add('flip-card-back');
  });

  // Static Cards
  const animalCards = {
    cat: [
      {
        front: 'images/pets/cat1.jpg',
        back: 'images/pets/cat1-back.webp',
        name: 'Shorthair Cat',
        alt: 'Whiskers Cat',
        breed_info: {
          weight: '3.5 – 5.5 kg',
          height: '23 – 28 cm',
          life_span: '12 - 15 years',
          temperament: 'Friendly, Easygoing, Intelligent',
        },
        id: 'CA0001',
      },
      {
        front: 'images/pets/cat2.jpg',
        back: 'images/pets/cat2-back.webp',
        name: 'Longhair Cat',
        alt: 'Longhair Cat',
        breed_info: {
          weight: '4 - 6.5 kg',
          height: '25 - 30 cm',
          life_span: '12 - 17 years',
          temperament: 'Curious, Gentle, Loyal',
        },
        id: 'CA0002',
      },
    ],
    bird: [
      {
        front: 'images/pets/5.webp',
        back: 'images/pets/3.webp',
        name: 'Eclectus Parrot',
        alt: 'Squawks',
        breed_info: {
          weight: '0.4 - 0.6 kg',
          height: '30 – 35 cm',
          life_span: '30 – 40 years',
          temperament: 'Curious, Gentle, Loyal',
        },
        id: 'BI0001',
      },
      {
        front: 'images/pets/6.webp',
        back: 'images/pets/3.webp',
        name: 'Feather Fury',
        alt: 'Feather Fury',
        breed_info: {
          weight: '0.5 - 0.7 kg',
          height: '30 – 55 cm',
          life_span: '30 – 60 years',
          temperament: 'Affectionate, Social, Demanding',
        },
        id: 'BI0002',
      },
    ],
  };

  // Dog API
  const API_KEY = 'live_KfTFOTZFqrx7MFhD8dzHnKFP8FCL1yfsgTMn3gY4TTjX7n7aQkeUZ3yDizq7MXGN';
  const DOG_API_URL = 'https://api.thedogapi.com/v1/images/search?limit=6&has_breeds=true';

  const getOrGenerateDogId = (url) => {
    const idMap = JSON.parse(localStorage.getItem('dogIdMap') || '{}');
    if (idMap[url]) return idMap[url];
    const prefix = 'DO';
    const counter = Object.keys(idMap).length + 1;
    const id = `${prefix}${String(counter).padStart(4, '0')}`;
    idMap[url] = id;
    localStorage.setItem('dogIdMap', JSON.stringify(idMap));
    return id;
  };

  async function loadDogCards() {
    try {
      const res = await fetch(DOG_API_URL, {
        headers: { 'x-api-key': API_KEY },
      });
      const data = await res.json();
      return data.map((dog) => {
        const breed = dog.breeds?.[0] || {};
        return {
          front: dog.url,
          name: breed.name || 'Unknown Doggo',
          alt: breed.name || 'Dog',
          breed_info: {
            weight: `${breed.weight?.metric} kg` || 'N/A',
            height: `${breed.height?.metric} cm` || 'N/A',
            life_span: breed.life_span || 'N/A',
            temperament: breed.temperament || 'Unknown',
          },
          id: getOrGenerateDogId(dog.url),
        };
      });
    } catch (err) {
      // dog api error
      return [];
    }
  }

  // Render Cards
  function renderCards(cardstemp) {
    if (!cardstemp?.length) {
      cardstemp.innerHTML = '<p>No cards to display</p>';
      return;
    }

    cardsArea.innerHTML = cardstemp
      .map((card) => {
        const back = card.breed_info
          ? `<h2>${card.name}</h2>
             <p><strong>Pet ID:</strong> ${card.id}</p>
             <p><strong>Weight:</strong> ${card.breed_info.weight}</p>
             <p><strong>Height:</strong> ${card.breed_info.height}</p>
             <p><strong>Life Span:</strong> ${card.breed_info.life_span}</p>
             <p><strong>Temperament:</strong> ${card.breed_info.temperament}</p>`
          : `<p>No breed info<br><strong>Pet ID:</strong> ${card.id}</p>`;

        const adoptLink = `https://main--mysite--manishvermanov.aem.page/adopt?PetID=${card.id}&Breed=${encodeURIComponent(card.name)}&PetImage=${encodeURIComponent(card.front)}`;

        return `
        <div class="character-card">
          <div class="card-inner">
            <div class="card-front">
              <img src="${card.front}" alt="${card.alt}" />
              <p>${card.name}</p>
            </div>
            <div class="card-back">
              ${back}
              <a class="adopt-btn" href="${adoptLink}">Adopt</a>
            </div>
          </div>
        </div>`;
      })
      .join('');

    // Apply flip-card classes after rendering
    const newCards = cardsArea.querySelectorAll('.character-card');
    newCards.forEach((card) => {
      card.classList.add('flip-card');
      const cardInner = card.querySelector('.card-inner');
      if (cardInner) cardInner.classList.add('flip-card-inner');
      const front = card.querySelector('.card-front');
      if (front) front.classList.add('flip-card-front');
      const back = card.querySelector('.card-back');
      if (back) back.classList.add('flip-card-back');
    });
  }

  // Attach Click Events to Menu Items
  const menuItems = categoryList.querySelectorAll('li');
  menuItems.forEach((item) => {
    item.addEventListener('click', async () => {
      menuItems.forEach((li) => li.classList.remove('active'));
      item.classList.add('active');
      const type = item.textContent.toLowerCase();

      if (type === 'dog') {
        const dogs = await loadDogCards();
        renderCards(dogs);
      } else {
        renderCards(animalCards[type] || []);
      }
    });
  });

  // Load Dogs by Default
  const defaultDogs = await loadDogCards();
  renderCards(defaultDogs);
}
