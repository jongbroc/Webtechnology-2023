const canvas = document.getElementById('bulgeCanvas');
const ctx = canvas.getContext('2d');

let width, height, imageData, data, pixels;

function resizeCanvas() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    loadImage();
}

function loadImage() {
    const img = new Image();
    img.src = '357.png'; // Replace with your image URL
    img.onload = () => {
        ctx.drawImage(img, width/2, height/2, 500, 500);
        imageData = ctx.getImageData(0, 0, width, height);
        data = imageData.data;
        pixels = new Uint8ClampedArray(data);
    }
}

function applyBulgeEffect(x, y) {
    ctx.putImageData(imageData, 0, 0);
    const radius = 200;
    const strength = 0.5;
    const centerX = x;
    const centerY = y;

    for (let i = 0; i < width; i++) {
        for (let j = 0; j < height; j++) {
            const dx = i - centerX;
            const dy = j - centerY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < radius) {
                const angle = Math.atan2(dy, dx);
                const dist = Math.sqrt(dx * dx + dy * dy);
                const newDist = dist * (1 - (strength * (radius - dist)) / radius);
                const newX = Math.round(centerX + newDist * Math.cos(angle));
                const newY = Math.round(centerY + newDist * Math.sin(angle));
                if (newX >= 0 && newX < width && newY >= 0 && newY < height) {
                    const newIndex = (newY * width + newX) * 4;
                    const oldIndex = (j * width + i) * 4;
                    for (let k = 0; k < 4; k++) {
                        data[oldIndex + k] = pixels[newIndex + k];
                    }
                }
            }
        }
    }
    ctx.putImageData(imageData, 0, 0);
}

canvas.addEventListener('mousemove', (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    applyBulgeEffect(x, y);
});

window.addEventListener('resize', resizeCanvas);

resizeCanvas();
