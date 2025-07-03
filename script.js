const stage = document.getElementById('stage');
const coneCount = 150;
const cones = [];

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

function spawnCone() {
  const img = document.createElement('img');
  img.src = 'vanilla.png'; // Ensure this image is in the same folder
  img.className = 'cone';
  stage.appendChild(img);

  const depth = rand(0.5, 1.5); // For depth illusion

  // Randomly choose whether to spawn from top or left
  const fromTop = Math.random() < 0.5;
  const x = fromTop ? rand(0, window.innerWidth) : -100;
  const y = fromTop ? -100 : rand(0, window.innerHeight);

  return {
    el: img,
    x,
    y,
    speed: rand(1, 2) * depth,
    drift: rand(1, 2) * depth, // Horizontal drift for diagonal movement
    scale: depth,
    blur: (1.5 - depth) * 2
  };
}

// Create cones
for (let i = 0; i < coneCount; i++) {
  cones.push(spawnCone());
}

function animate() {
  cones.forEach(c => {
    c.x += c.drift;
    c.y += c.speed;

    // Reset when off-screen
    if (c.y > window.innerHeight + 100 || c.x > window.innerWidth + 100) {
      const newCone = spawnCone();
      Object.assign(c, newCone); // Replace properties, reuse DOM element
    }

    c.el.style.transform = `translate(${c.x}px, ${c.y}px) scale(${c.scale})`;
    c.el.style.filter = `blur(${c.blur}px)`;
  });

  requestAnimationFrame(animate);
}

animate();
