/**
 * Spiral Galaxy Engine (GPT-6 Astra Style)
 * Renders a logarithmic particle spiral galaxy with 4-pointed star flares matching the reference design.
 */

function initSpiralGalaxy(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width, height;
  let animationFrameId;

  function resize() {
    width = canvas.width = canvas.parentElement.clientWidth;
    height = canvas.height = canvas.parentElement.clientHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  // Spiral Galaxy Parameters
  const NUM_ARMS = 2;
  const PARTICLE_COUNT = 2400;
  const GALAXY_RADIUS = Math.min(width, height) * 0.44;
  const CORE_RADIUS = 22;
  const WINDING = 3.6; // Logarithmic winding curve

  class GalaxyParticle {
    constructor() {
      this.reset();
    }

    reset() {
      // Pick an arm (0 or 1)
      this.arm = Math.floor(Math.random() * NUM_ARMS);
      const armOffset = (this.arm * 2 * Math.PI) / NUM_ARMS;

      // Distance from center: higher density towards core
      const t = Math.pow(Math.random(), 1.7);
      this.dist = CORE_RADIUS + t * (GALAXY_RADIUS - CORE_RADIUS);

      // Logarithmic spiral angle with dispersion
      const spiralAngle = WINDING * Math.log(this.dist / CORE_RADIUS);
      // Angular dispersion increases with distance
      const dispersion = (Math.random() - 0.5) * (0.35 + 0.55 * (this.dist / GALAXY_RADIUS));
      this.baseAngle = armOffset + spiralAngle + dispersion;

      this.size = Math.random() * 1.5 + 0.4;
      this.twinkleOffset = Math.random() * Math.PI * 2;
      this.twinkleSpeed = 0.02 + Math.random() * 0.04;

      // Color scheme: core is luminous diamond white/cyan, arms have golden and cyan star dust
      const randColor = Math.random();
      if (this.dist < CORE_RADIUS * 2.2) {
        this.color = '220, 245, 255'; // Diamond core
        this.baseAlpha = 0.8 + Math.random() * 0.2;
      } else if (randColor < 0.45) {
        this.color = '160, 220, 255'; // Cyan stellar dust
        this.baseAlpha = 0.4 + Math.random() * 0.5;
      } else if (randColor < 0.75) {
        this.color = '255, 215, 160'; // Golden stellar nursery
        this.baseAlpha = 0.4 + Math.random() * 0.5;
      } else {
        this.color = '240, 245, 255'; // Crisp white stars
        this.baseAlpha = 0.5 + Math.random() * 0.4;
      }
    }

    draw(rotation) {
      const angle = this.baseAngle + rotation;
      // Elliptical galaxy perspective
      const x = width / 2 + Math.cos(angle) * this.dist;
      const y = height / 2 + Math.sin(angle) * this.dist * 0.92;

      const alpha = this.baseAlpha + Math.sin(Date.now() * this.twinkleSpeed + this.twinkleOffset) * 0.18;
      ctx.beginPath();
      ctx.arc(x, y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color}, ${Math.max(0.15, Math.min(1, alpha))})`;
      ctx.fill();
    }
  }

  // 4-Point Star Flares (diffraction cross stars as seen in reference image)
  const FLARE_STARS = [
    { arm: 0, relDist: 0.85, baseAngleOffset: 0.12, size: 28, color: '#ffffff' },
    { arm: 0, relDist: 0.48, baseAngleOffset: -0.05, size: 24, color: '#e0f7ff' },
    { arm: 1, relDist: 0.78, baseAngleOffset: 0.15, size: 26, color: '#fff3e0' },
    { arm: 1, relDist: 0.42, baseAngleOffset: -0.08, size: 22, color: '#ffffff' },
    { arm: 0, relDist: 0.25, baseAngleOffset: 0.2, size: 20, color: '#e0f2fe' },
    { arm: 1, relDist: 0.92, baseAngleOffset: -0.15, size: 18, color: '#ffe4e6' }
  ];

  function drawStarFlare(cx, cy, radius, color = '#ffffff') {
    // Center glow
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
    grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    grad.addColorStop(0.2, 'rgba(224, 242, 254, 0.8)');
    grad.addColorStop(0.6, 'rgba(56, 189, 248, 0.2)');
    grad.addColorStop(1, 'transparent');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fill();

    // 4-Point Cross Spikes (Diffraction spikes)
    const spikeLength = radius * 2.2;
    const spikeThickness = 1.2;

    ctx.save();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.lineWidth = spikeThickness;
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 8;

    // Horizontal spike
    ctx.beginPath();
    ctx.moveTo(cx - spikeLength, cy);
    ctx.lineTo(cx + spikeLength, cy);
    ctx.stroke();

    // Vertical spike
    ctx.beginPath();
    ctx.moveTo(cx, cy - spikeLength);
    ctx.lineTo(cx, cy + spikeLength);
    ctx.stroke();

    ctx.restore();
  }

  // Generate particles
  const particles = [];
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(new GalaxyParticle());
  }

  // Animation Loop
  let rotation = 0;
  const rotationSpeed = 0.0016; // Smooth celestial swirl

  function render() {
    ctx.clearRect(0, 0, width, height);

    // Deep cosmic galactic center halo
    const coreGrad = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, GALAXY_RADIUS * 0.7);
    coreGrad.addColorStop(0, 'rgba(168, 85, 247, 0.14)');
    coreGrad.addColorStop(0.3, 'rgba(56, 189, 248, 0.08)');
    coreGrad.addColorStop(0.7, 'rgba(15, 23, 42, 0.03)');
    coreGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = coreGrad;
    ctx.fillRect(0, 0, width, height);

    // Draw galaxy particles
    particles.forEach(p => p.draw(rotation));

    // Draw bright 4-point flare stars along the spiral arms
    FLARE_STARS.forEach(flare => {
      const armOffset = (flare.arm * 2 * Math.PI) / NUM_ARMS;
      const dist = CORE_RADIUS + flare.relDist * (GALAXY_RADIUS - CORE_RADIUS);
      const angle = armOffset + WINDING * Math.log(dist / CORE_RADIUS) + flare.baseAngleOffset + rotation;

      const fx = width / 2 + Math.cos(angle) * dist;
      const fy = height / 2 + Math.sin(angle) * dist * 0.92;

      // Flare pulse
      const pulse = 1 + 0.15 * Math.sin(Date.now() * 0.003 + flare.relDist * 10);
      drawStarFlare(fx, fy, flare.size * pulse, flare.color);
    });

    rotation += rotationSpeed;
    animationFrameId = requestAnimationFrame(render);
  }

  render();

  return () => {
    cancelAnimationFrame(animationFrameId);
    window.removeEventListener('resize', resize);
  };
}
