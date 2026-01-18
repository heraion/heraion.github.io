// Scroll fade-in
const panels = document.querySelectorAll('.panel');
const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if(entry.isIntersecting) entry.target.classList.add('visible');
    });
  },
  { threshold: 0.2 }
);
panels.forEach(panel => observer.observe(panel));

// Cursor + halo
const cursor = document.querySelector('.cursor');
const halo = document.querySelector('.cursor-halo');
let mouseX = 0, mouseY = 0;
let currentX = 0, currentY = 0;
let haloX = 0, haloY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

function animateCursor() {
  currentX += (mouseX - currentX) * 0.2;
  currentY += (mouseY - currentY) * 0.2;
  haloX += (mouseX - haloX) * 0.08;
  haloY += (mouseY - haloY) * 0.08;

  cursor.style.left = `${currentX}px`;
  cursor.style.top = `${currentY}px`;

  halo.style.left = `${haloX}px`;
  halo.style.top = `${haloY}px`;

  requestAnimationFrame(animateCursor);
}
animateCursor();

const hoverTargets = document.querySelectorAll('a, button, .member img, .member span');
hoverTargets.forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.classList.add('hover');
    halo.classList.add('hover');
  });
  el.addEventListener('mouseleave', () => {
    cursor.classList.remove('hover');
    halo.classList.remove('hover');
  });
});

// Particle background
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
});

const numParticles = 60;
const particles = [];

class Particle {
  constructor() {
    this.x = Math.random()*width;
    this.y = Math.random()*height;
    this.vx = (Math.random()-0.5)*0.3;
    this.vy = (Math.random()-0.5)*0.3;
    this.radius = 2;
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    if(this.x < 0 || this.x > width) this.vx *= -1;
    if(this.y < 0 || this.y > height) this.vy *= -1;
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
    ctx.fillStyle = 'rgba(255,255,255,0.05)';
    ctx.fill();
  }
}

for(let i=0;i<numParticles;i++) particles.push(new Particle());

function drawLines() {
  for(let i=0;i<numParticles;i++){
    for(let j=i+1;j<numParticles;j++){
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      if(dist<120){
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(255,255,255,0.03)';
        ctx.lineWidth=1;
        ctx.moveTo(particles[i].x,particles[i].y);
        ctx.lineTo(particles[j].x,particles[j].y);
        ctx.stroke();
      }
    }
  }
}

function repelCursor() {
  particles.forEach(p => {
    const dx = p.x - mouseX;
    const dy = p.y - mouseY;
    const dist = Math.sqrt(dx*dx + dy*dy);
    if(dist < 80){
      const angle = Math.atan2(dy, dx);
      const force = (80 - dist)/50;
      p.vx += Math.cos(angle)*force;
      p.vy += Math.sin(angle)*force;
    }
  });
}

function animate() {
  ctx.clearRect(0,0,width,height);
  particles.forEach(p => { p.update(); p.draw(); });
  drawLines();
  repelCursor();
  requestAnimationFrame(animate);
}
animate();
