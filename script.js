const cards = document.querySelectorAll('[data-card]');

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

  card.addEventListener('focusin', () => {
    card.style.transform = 'rotateX(2deg) rotateY(-2deg) translateY(-4px)';
  });

  card.addEventListener('focusout', () => {
    card.style.transform = 'rotateX(0deg) rotateY(0deg) translateY(0)';
  });
});
