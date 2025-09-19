const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// 🔲 Generar cubos estilo "bloques minimalistas"
const cubes = Array.from({ length: 35 }, () => ({
  x: Math.random() * canvas.width,
  y: Math.random() * canvas.height,
  size: Math.random() * 60 + 20, // más grandes
  dx: (Math.random() - 0.5) * 0.2, // movimiento más lento
  dy: (Math.random() - 0.5) * 0.2,
  color: `rgba(35, 45, 90, ${Math.random() * 0.6 + 0.4})`, // azul oscuro translúcido
}));

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  cubes.forEach((cube) => {
    ctx.fillStyle = cube.color;
    ctx.fillRect(cube.x, cube.y, cube.size, cube.size);

    cube.x += cube.dx;
    cube.y += cube.dy;

    // Rebote en bordes
    if (cube.x < -cube.size) cube.x = canvas.width;
    if (cube.y < -cube.size) cube.y = canvas.height;
    if (cube.x > canvas.width) cube.x = -cube.size;
    if (cube.y > canvas.height) cube.y = -cube.size;
  });

  requestAnimationFrame(draw);
}

draw();
