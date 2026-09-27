// Dice faces are drawn with pips only, so no numerals appear on the page.
const faces = [
  { name: 'one',   pips: ['d'] },
  { name: 'two',   pips: ['a', 'g'] },
  { name: 'three', pips: ['a', 'd', 'g'] },
  { name: 'four',  pips: ['a', 'b', 'f', 'g'] },
  { name: 'five',  pips: ['a', 'b', 'd', 'f', 'g'] },
  { name: 'six',   pips: ['a', 'b', 'c', 'e', 'f', 'g'] },
];

const fortunes = [
  'Chaweng Beach is calling — grab a towel and go.',
  'Hike up to the Na Muang waterfall today.',
  'Visit the Big Buddha temple at sunrise.',
  'Wander the Fisherman\'s Village night market.',
  'Take a boat trip to Ang Thong Marine Park.',
  'Watch the sunset from Lipa Noi with a fresh coconut.',
  'Try a Thai cooking class and master green curry.',
  'Snorkel the calm waters around Koh Tan.',
];

const doublesFortune = 'Doubles! A full island day of luck — beach, temple and sunset.';

const dieA = document.getElementById('dieA');
const dieB = document.getElementById('dieB');
const rollBtn = document.getElementById('roll');
const fortuneEl = document.getElementById('fortune');

function randomIndex(length) {
  return Math.floor(Math.random() * length);
}

function render(die, face) {
  die.replaceChildren(...face.pips.map((pos) => {
    const pip = document.createElement('span');
    pip.className = `pip ${pos}`;
    return pip;
  }));
  die.setAttribute('aria-label', `Die showing ${face.name}`);
}

function roll() {
  const a = randomIndex(faces.length);
  const b = randomIndex(faces.length);

  rollBtn.disabled = true;
  [dieA, dieB].forEach((die) => {
    die.classList.remove('rolling');
    void die.offsetWidth; // restart the animation
    die.classList.add('rolling');
  });

  setTimeout(() => {
    render(dieA, faces[a]);
    render(dieB, faces[b]);
    fortuneEl.textContent = a === b
      ? doublesFortune
      : fortunes[(a + b) % fortunes.length];
    rollBtn.disabled = false;
  }, 300);
}

render(dieA, faces[4]);
render(dieB, faces[2]);
rollBtn.addEventListener('click', roll);
