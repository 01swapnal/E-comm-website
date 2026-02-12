const cards = document.querySelectorAll('[data-card]');
const hero = document.querySelector('[data-hero]');
const heroMain = document.querySelector('.hero-main');
const heroSide = document.querySelector('.hero-side');
const heroBg = document.querySelector('.hero-bg');

cards.forEach((card) => {
  const dampen = 18;

  function setCardRotation(event) {
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const rotateX = ((y - rect.height / 2) / dampen) * -1;
    const rotateY = (x - rect.width / 2) / dampen;

    card.style.transform = `rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-5px)`;
  }

  card.addEventListener('mousemove', setCardRotation);
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'rotateX(0deg) rotateY(0deg) translateY(0)';
  });
});

if (hero && heroMain && heroSide && heroBg) {
  hero.addEventListener('mousemove', (event) => {
    const rect = hero.getBoundingClientRect();
    const offsetX = event.clientX - rect.left - rect.width / 2;
    const offsetY = event.clientY - rect.top - rect.height / 2;

    const rotateY = offsetX / 55;
    const rotateX = (offsetY / 55) * -1;

    heroMain.style.transform = `rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg)`;
    heroSide.style.transform = `rotateX(${(rotateX * 0.7).toFixed(2)}deg) rotateY(${(rotateY * 0.7).toFixed(2)}deg)`;
    heroBg.style.transform = `translate(${(offsetX / 40).toFixed(2)}px, ${(offsetY / 40).toFixed(2)}px)`;
  });

  hero.addEventListener('mouseleave', () => {
    heroMain.style.transform = 'rotateX(0deg) rotateY(0deg)';
    heroSide.style.transform = 'rotateX(0deg) rotateY(0deg)';
    heroBg.style.transform = 'translate(0, 0)';
  });
}
