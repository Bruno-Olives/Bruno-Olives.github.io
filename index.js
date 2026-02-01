const reasons = [
  { emoji: "😊", text: "O teu sorriso alegra o meu dia" },
  { emoji: "💫", text: "Tornas a minha vida 1000000000000 vezes melhor" },
  { emoji: "🌟", text: "És a minha melhor amiga" },
  { emoji: "🎵", text: "O teu sorriso é o meu som favorito" },
  { emoji: "🌈", text: "Trazes cor à minha vida" },
  { emoji: "💪", text: "Fazes-me querer ser melhor" },
  { emoji: "🏠", text: "Contigo é a minha casa" },
  {
    emoji: "✨",
    text: "És linda por dentro e por fora (tipo BUEEEEEEEEEEE, A MINHA MULHER É LINDAAAAAA 😭)",
  },
  { emoji: "🤗", text: "O teu calor derrete o meu coração" },
  { emoji: "🧠", text: "És das pessoas mais inteligentes que conheço" },
  { emoji: "❤️", text: "És paciente e carinhosa comigo" },
  { emoji: "🌙", text: "És a pessoa com quem sempre sonhei ter ao meu lado" },
  { emoji: "☀️", text: "És o meu raio de sol em dias nublados" },
  { emoji: "🎁", text: "Cada momento contigo é um presente" },
  { emoji: "♾️", text: "Amo-te mais do que as palavras podem dizer" },
];

let currentIndex = 0;
let startX = 0;
let currentX = 0;
let isDragging = false;
let currentCard = null;

const cardContainer = document.getElementById("cardContainer");
const counter = document.getElementById("counter");
const likeBtn = document.getElementById("likeBtn");
const dislikeBtn = document.getElementById("dislikeBtn");
const endMessage = document.getElementById("endMessage");
const restartBtn = document.getElementById("restartBtn");
const heartsContainer = document.getElementById("hearts");

function createCard(index) {
  const card = document.createElement("div");
  card.className = "card";
  card.innerHTML = `
        <div class="card-number">${index + 1}</div>
        <div class="card-emoji">${reasons[index].emoji}</div>
        <div class="card-text">${reasons[index].text}</div>
    `;

  card.addEventListener("touchstart", handleTouchStart, { passive: true });
  card.addEventListener("touchmove", handleTouchMove, { passive: false });
  card.addEventListener("touchend", handleTouchEnd);

  card.addEventListener("mousedown", handleMouseDown);

  return card;
}

function handleTouchStart(e) {
  startDrag(e.touches[0].clientX);
}

function handleMouseDown(e) {
  startDrag(e.clientX);
  document.addEventListener("mousemove", handleMouseMove);
  document.addEventListener("mouseup", handleMouseUp);
}

function startDrag(x) {
  startX = x;
  currentX = 0;
  isDragging = true;
  currentCard = cardContainer.querySelector(".card");
  if (currentCard) {
    currentCard.classList.add("swiping");
  }
}

function handleTouchMove(e) {
  if (!isDragging || !currentCard) return;
  e.preventDefault();
  currentX = e.touches[0].clientX - startX;
  updateCardPosition();
}

function handleMouseMove(e) {
  if (!isDragging || !currentCard) return;
  currentX = e.clientX - startX;
  updateCardPosition();
}

function updateCardPosition() {
  const rotation = currentX / 10;
  currentCard.style.transform = `translateX(${currentX}px) rotate(${rotation}deg)`;
  currentCard.style.opacity = 1 - Math.abs(currentX) / 300;
}

function handleTouchEnd() {
  endDrag();
}

function handleMouseUp() {
  document.removeEventListener("mousemove", handleMouseMove);
  document.removeEventListener("mouseup", handleMouseUp);
  endDrag();
}

function endDrag() {
  if (!isDragging || !currentCard) return;
  isDragging = false;

  if (Math.abs(currentX) > 100) {
    swipeCard(currentX > 0 ? "right" : "left");
  } else {
    currentCard.classList.remove("swiping");
    currentCard.style.transform = "";
    currentCard.style.opacity = "";
  }
}

function swipeCard(direction) {
  if (!currentCard) return;

  const moveX = direction === "right" ? 1000 : -1000;
  currentCard.style.transition = "transform 0.5s ease, opacity 0.5s ease";
  currentCard.style.transform = `translateX(${moveX}px) rotate(${moveX / 10}deg)`;
  currentCard.style.opacity = "0";

  if (direction === "right") {
    createHearts();
  }

  setTimeout(() => {
    if (currentCard && currentCard.parentNode) {
      currentCard.remove();
    }
    currentIndex++;

    if (currentIndex < reasons.length) {
      const newCard = createCard(currentIndex);
      cardContainer.appendChild(newCard);
      currentCard = newCard;
      updateCounter();
    } else {
      showEndMessage();
    }
  }, 500);
}

function createHearts() {
  for (let i = 0; i < 10; i++) {
    setTimeout(() => {
      const heart = document.createElement("div");
      heart.className = "heart";
      heart.textContent = "💖";
      heart.style.left = Math.random() * window.innerWidth + "px";
      heart.style.top = window.innerHeight / 2 + "px";
      heartsContainer.appendChild(heart);

      setTimeout(() => heart.remove(), 3000);
    }, i * 50);
  }
}

function updateCounter() {
  counter.textContent = `${currentIndex + 1} / ${reasons.length}`;
}

function showEndMessage() {
  cardContainer.style.display = "none";
  document.querySelector(".controls").style.display = "none";
  document.querySelector(".header").style.display = "none";
  endMessage.style.display = "block";
  createHearts();
}

function restart() {
  currentIndex = 0;
  cardContainer.style.display = "block";
  document.querySelector(".controls").style.display = "flex";
  document.querySelector(".header").style.display = "block";
  endMessage.style.display = "none";
  cardContainer.innerHTML = "";
  const card = createCard(currentIndex);
  cardContainer.appendChild(card);
  currentCard = card;
  updateCounter();
}

likeBtn.addEventListener("click", () => swipeCard("right"));
dislikeBtn.addEventListener("click", () => swipeCard("left"));
restartBtn.addEventListener("click", restart);

const initialCard = createCard(currentIndex);
cardContainer.appendChild(initialCard);
currentCard = initialCard;
