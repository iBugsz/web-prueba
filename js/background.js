const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// 🔲 Generar cubos
const cubes = Array.from({ length: 40 }, () => ({
  x: Math.random() * canvas.width,
  y: Math.random() * canvas.height,
  size: Math.random() * 20 + 10,
  dx: (Math.random() - 0.5) * 0.5,
  dy: (Math.random() - 0.5) * 0.5,
  opacity: Math.random() * 0.5 + 0.2,
}));

// 🔲 Dibujar animación
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  cubes.forEach((cube) => {
    ctx.fillStyle = `rgba(255,255,255,${cube.opacity})`;
    ctx.fillRect(cube.x, cube.y, cube.size, cube.size);

    cube.x += cube.dx;
    cube.y += cube.dy;

    if (cube.x < 0 || cube.x > canvas.width) cube.dx *= -1;
    if (cube.y < 0 || cube.y > canvas.height) cube.dy *= -1;
  });

  requestAnimationFrame(draw);
}

draw();
