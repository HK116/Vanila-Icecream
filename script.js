document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');
  const selector = document.getElementById('flavorSelector');

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });

  selector.addEventListener('change', () => {
    cones.length = 0; // Clear current cones
    for (let i = 0; i < maxCones; i++) {
      cones.push(createCone());
    }
  });

  const flavorImages = {
    vanilla: 'assets/vanilla.png',
    chocolate: 'assets/chocolate.png',
    mint: 'assets/mint.png',
    rainbow: 'assets/rainbow.png',
  };

  const flavorKeys = Object.keys(flavorImages);
  const images = {};
  let loadedCount = 0;

  // Load images
  flavorKeys.forEach(key => {
    const img = new Image();
    img.src = flavorImages[key];
    img.onload = () => {
      loadedCount++;
      if (loadedCount === flavorKeys.length) {
        init();
      }
    };
    images[key] = img;
  });

  function getSelectedFlavor() {
    const selected = selector?.value || 'random';
    if (selected === 'random') {
      return flavorKeys[Math.floor(Math.random() * flavorKeys.length)];
    }
    return selected;
  }

  function createCone() {
    const depth = Math.random() * 1 + 0.5;
    const fromLeft = Math.random() < 0.5;
    const x = fromLeft ? -100 : Math.random() * canvas.width;
    const y = fromLeft ? Math.random() * canvas.height : -100;

    return {
      x,
      y,
      scale: depth,
      speed: (0.5 + Math.random()) * depth,
      drift: (0.5 + Math.random()) * depth,
      swayPhase: Math.random() * Math.PI * 2,
      swayAmp: 10 + Math.random() * 20,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 2,
      blur: 0,
      flavor: getSelectedFlavor(),
    };
  }

  const cones = [];
  const maxCones = 300;

  function init() {
    for (let i = 0; i < maxCones; i++) {
      cones.push(createCone());
    }
    requestAnimationFrame(animate);
  }

  function animate(t) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    cones.forEach(c => {
      c.x += c.drift;
      c.y += c.speed;
      c.rotation += c.rotationSpeed;

      if (c.y > canvas.height + 100 || c.x > canvas.width + 100) {
        Object.assign(c, createCone());
      }

      const sway = Math.sin(t * 0.002 + c.swayPhase) * c.swayAmp;
      const drawX = c.x + sway;
      const drawY = c.y;

      const img = images[c.flavor];
      const aspectRatio = img.naturalWidth / img.naturalHeight;

      const baseHeight = 40;
      const height = baseHeight * c.scale;
      const width = height * aspectRatio;

      ctx.save();
      ctx.translate(drawX, drawY);
      ctx.rotate((c.rotation * Math.PI) / 180);
      ctx.globalAlpha = 0.85;
      ctx.filter = "none";
      ctx.drawImage(img, -width / 2, -height / 2, width, height);
      ctx.restore();
    });

    requestAnimationFrame(animate);
  }
});
