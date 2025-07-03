const stage = document.getElementById('stage');
const cones = [];
const maxCones = 200;
let totalSpawned = 0;

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

function spawnCone() {
  const img = document.createElement('img');
  img.src = 'vanilla.png'; 
  img.className = 'cone';
  stage.appendChild(img);

  const depth = rand(0.5, 1.5); // For depth illusion
  const fromTop = Math.random() < 0.5;

  const x = fromTop ? rand(0, window.innerWidth) : -100;
  const y = fromTop ? -100 : rand(0, window.innerHeight);

  return {
    el: img,
    x,
    y,
    scale: depth,
    speed: rand(0.5, 1.5) * depth,
    drift: rand(0.5, 1.5) * depth,
    swayPhase: rand(0, Math.PI * 2),
    swayAmplitude: rand(10, 30), // stronger wind at deeper depths
    rotation: rand(0, 360),
    rotationSpeed: rand(-1, 1),
    blur: (1.5 - depth) * 2
  };
}

function spawnBatch(n) {
    for (let i = 0; i < n; i++) {
        if (totalSpawned >= maxCones) return;
        cones.push(spawnCone());
        totalSpawned++;
    }
}

// Initla cones
spawnBatch(50);

// Stream more cones gradually
const spawnInterval = setInterval(() => {
    if (totalSpawned >= maxCones) {
        clearInterval(spawnInterval);
    } else {
        spawnBatch(10);
    }
}, 500);


// Animation loop
function animate(time) {
  cones.forEach(c => {
    // Update movement
    c.x += c.drift;
    c.y += c.speed;

    // Wind sway using sine wave
    const sway = Math.sin(time * 0.002 + c.swayPhase) * c.swayAmplitude;
    const finalX = c.x + sway;

    // Rotation
    c.rotation += c.rotationSpeed;

    // Reset cone if off screen
    if (c.y > window.innerHeight + 100 || c.x > window.innerWidth + 100) {
      const newCone = spawnCone();
      Object.assign(c, newCone);
    }

    // Apply CSS transform
    c.el.style.transform = `translate(${finalX}px, ${c.y}px) scale(${c.scale}) rotate(${c.rotation}deg)`;
    c.el.style.filter = `blur(${c.blur}px)`;
  });

  requestAnimationFrame(animate);
}

requestAnimationFrame(animate);
