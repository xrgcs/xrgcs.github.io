const hiddenFileInput = document.createElement('input');
hiddenFileInput.type = 'file';
hiddenFileInput.accept = 'image/';
hiddenFileInput.style.display = 'none';
hiddenFileInput.addEventListener('change', handleImage);

document.body.appendChild(hiddenFileInput);

document.getElementById('original-canvas').addEventListener('click', () => {
    hiddenFileInput.click();
});


document.getElementById('saturation').addEventListener('input', applySaturation);
document.getElementById('contrast').addEventListener('input', applySaturation);
document.getElementById('result_scale').addEventListener('input', applySaturation);
document.getElementById('black-btn').addEventListener('click', () => setCurrentColor([0, 0, 0, 255]));
document.getElementById('white-btn').addEventListener('click', () => setCurrentColor([255, 255, 255, 255]));
document.getElementById('green-btn').addEventListener('click', () => setCurrentColor([0, 255, 0, 255]));

document.addEventListener('paste', handlePaste);

function drawInitialText() {
    const originalCanvas = document.getElementById('original-canvas');
    const originalCtx = originalCanvas.getContext('2d', { willReadFrequently: true });

    originalCanvas.width = 288;
    originalCanvas.height = 72;

    originalCtx.clearRect(0, 0, originalCanvas.width, originalCanvas.height);
    originalCtx.font = '18px Arial';
    originalCtx.fillStyle = 'black';
    originalCtx.textAlign = 'center';
    originalCtx.textBaseline = 'middle';

    originalCtx.fillText((getTranslation("logo_paste_line1")), originalCanvas.width / 2, originalCanvas.height / 2 - 10);
    originalCtx.fillText((getTranslation("logo_paste_line2")), originalCanvas.width / 2, originalCanvas.height / 2 + 10);
}

function handlePaste(event) {
    const items = event.clipboardData.items;
    for (let item of items) {
        if (item.type.startsWith('image/')) {
            const file = item.getAsFile();
            handleImage({ target: { files: [file] } });
            break;
        }
    }
}

let originalImage = new Image();
let imageDataOriginal = null;
let currentColor = [0, 0, 0, 255];

function handleImage(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        originalImage = new Image();
        originalImage.onload = function () {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d', { willReadFrequently: true });

            canvas.width = 288;
            canvas.height = 72;

            let newWidth = originalImage.width;
            let newHeight = originalImage.height;

            if (originalImage.width > 288) {
                newWidth = 288;
                newHeight = originalImage.height * (288 / originalImage.width);
            }

            const offsetY = (canvas.height - newHeight) / 2;

            ctx.drawImage(originalImage, 0, offsetY, newWidth, newHeight);

            const resizedDataURL = canvas.toDataURL('image/png');

            originalImage.src = resizedDataURL;
            originalImage.onload = function () {
                const originalCanvas = document.getElementById('original-canvas');
                const originalCtx = originalCanvas.getContext('2d', { willReadFrequently: true });

                originalCanvas.width = originalImage.width;
                originalCanvas.height = originalImage.height;

                originalCtx.drawImage(originalImage, 0, 0);

                imageDataOriginal = originalCtx.getImageData(0, 0, originalCanvas.width, originalCanvas.height);
                applySaturation();
            };
        };

        originalImage.src = e.target.result;
    };

    reader.readAsDataURL(file);
    document.getElementById("result").style.display = "block";
    document.getElementById("adjustments").style.display = "flex";
}

function scaleImage() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    const scale = Math.min(288 / originalImage.width, 72 / originalImage.height);

    const newWidth = originalImage.width * scale;
    const newHeight = originalImage.height * scale;

    canvas.width = 288;
    canvas.height = 72;
    ctx.drawImage(originalImage, (288 - newWidth) / 2, (72 - newHeight) / 2, newWidth, newHeight);

    const resizedDataURL = canvas.toDataURL('image/png');

    originalImage.src = resizedDataURL;
    originalImage.onload = function () {
        const originalCanvas = document.getElementById('original-canvas');
        const originalCtx = originalCanvas.getContext('2d', { willReadFrequently: true });

        originalCanvas.width = originalImage.width;
        originalCanvas.height = originalImage.height;

        originalCtx.drawImage(originalImage, 0, 0);

        imageDataOriginal = originalCtx.getImageData(0, 0, originalCanvas.width, originalCanvas.height);
        applySaturation();
    };
}

function applySaturation() {
    if (!imageDataOriginal) return;

    const saturation = parseInt(document.getElementById('saturation').value, 10) / 100;
    const contrast = parseInt(document.getElementById('contrast').value, 10) / 100;


    const originalCanvas = document.getElementById('original-canvas');
    const originalCtx = originalCanvas.getContext('2d', { willReadFrequently: true });
    originalCtx.clearRect(0, 0, originalCanvas.width, originalCanvas.height);
    originalCtx.drawImage(originalImage, 0, 0);

    let imageData = originalCtx.getImageData(0, 0, originalCanvas.width, originalCanvas.height);
    let data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
        const red = data[i];
        const green = data[i + 1];
        const blue = data[i + 2];

        const grayscale = 0.3 * red + 0.59 * green + 0.11 * blue;

        data[i] = grayscale * (1 - saturation) + red * saturation;
        data[i + 1] = grayscale * (1 - saturation) + green * saturation;
        data[i + 2] = grayscale * (1 - saturation) + blue * saturation;

        data[i] = ((data[i] - 128) * contrast + 128);
        data[i + 1] = ((data[i + 1] - 128) * contrast + 128);
        data[i + 2] = ((data[i + 2] - 128) * contrast + 128);
    }

    originalCtx.putImageData(imageData, 0, 0);

    const processedCanvas = document.getElementById('processed-canvas');
    const processedCtx = processedCanvas.getContext('2d', { willReadFrequently: true });

    processedCanvas.width = originalImage.width;
    processedCanvas.height = originalImage.height;

    processedCtx.clearRect(0, 0, processedCanvas.width, processedCanvas.height);

    imageData = originalCtx.getImageData(0, 0, originalCanvas.width, originalCanvas.height);
    data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
        const alpha = data[i + 3];
        const red = data[i];
        const green = data[i + 1];
        const blue = data[i + 2];

        if (alpha === 0 || (red === 0 && green === 255 && blue === 0)) {
            data[i] = 0;
            data[i + 1] = 255;
            data[i + 2] = 0;
            data[i + 3] = 255;
        } else {
            const average = (data[i] + data[i + 1] + data[i + 2]) / 3;
            const finalColor = average > 127 ? 255 : 0;
            data[i] = finalColor;
            data[i + 1] = finalColor;
            data[i + 2] = finalColor;
            data[i + 3] = 255;
        }
    }

    processedCtx.putImageData(imageData, 0, 0);

    const scaledCanvas = document.getElementById('scaled-canvas');
    const scaledCtx = scaledCanvas.getContext('2d', { willReadFrequently: true });

    const scaleFactor = document.getElementById("result_scale").value;

    scaledCanvas.width = processedCanvas.width * scaleFactor;
    scaledCanvas.height = processedCanvas.height * scaleFactor;

    scaledCtx.imageSmoothingEnabled = false;
    scaledCtx.clearRect(0, 0, scaledCanvas.width, scaledCanvas.height);
    scaledCtx.drawImage(processedCanvas, 0, 0, scaledCanvas.width, scaledCanvas.height);

    scaledCanvas.addEventListener('click', editPixel);
    document.getElementById("scaled-canvas").style.display = "block";
}


function setCurrentColor(color) {
    currentColor = color;
}

let isDrawing = false;

function startDrawing(event) {
    isDrawing = true;
    editPixel(event);
}

function stopDrawing() {
    isDrawing = false;
}

function continueDrawing(event) {
    if (isDrawing) {
        editPixel(event);
    } else {
        previewPixel(event);
    }
}

function editPixel(event) {
    const scaledCanvas = document.getElementById('scaled-canvas');
    const processedCanvas = document.getElementById('processed-canvas');
    const processedCtx = processedCanvas.getContext('2d', { willReadFrequently: true });
    const scaleFactor = document.getElementById("result_scale").value;
    const pixelSize = parseInt(document.getElementById("pixel-size").value, 10);

    const rect = scaledCanvas.getBoundingClientRect();
    const x = Math.floor((event.clientX - rect.left) / scaleFactor);
    const y = Math.floor((event.clientY - rect.top) / scaleFactor);

    const imageData = processedCtx.getImageData(0, 0, processedCanvas.width, processedCanvas.height);
    const data = imageData.data;

    for (let dy = 0; dy < pixelSize; dy++) {
        for (let dx = 0; dx < pixelSize; dx++) {
            const index = ((y + dy) * processedCanvas.width + (x + dx)) * 4;
            data[index] = currentColor[0];
            data[index + 1] = currentColor[1];
            data[index + 2] = currentColor[2];
            data[index + 3] = currentColor[3];
        }
    }

    processedCtx.putImageData(imageData, 0, 0);

    const scaledCtx = scaledCanvas.getContext('2d', { willReadFrequently: true });
    scaledCtx.clearRect(0, 0, scaledCanvas.width, scaledCanvas.height);
    scaledCtx.drawImage(processedCanvas, 0, 0, scaledCanvas.width, scaledCanvas.height);
}

function previewPixel(event) {
    const scaledCanvas = document.getElementById('scaled-canvas');
    const processedCanvas = document.getElementById('processed-canvas');
    const processedCtx = processedCanvas.getContext('2d', { willReadFrequently: true });
    const scaleFactor = document.getElementById("result_scale").value;
    const pixelSize = parseInt(document.getElementById("pixel-size").value, 10);

    const rect = scaledCanvas.getBoundingClientRect();
    const x = Math.floor((event.clientX - rect.left) / scaleFactor);
    const y = Math.floor((event.clientY - rect.top) / scaleFactor);

    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = processedCanvas.width;
    tempCanvas.height = processedCanvas.height;
    const tempCtx = tempCanvas.getContext('2d', { willReadFrequently: true });
    tempCtx.drawImage(processedCanvas, 0, 0);

    const imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
    const data = imageData.data;

    for (let dy = 0; dy < pixelSize; dy++) {
        for (let dx = 0; dx < pixelSize; dx++) {
            const index = ((y + dy) * tempCanvas.width + (x + dx)) * 4;
            data[index] = currentColor[0];
            data[index + 1] = currentColor[1];
            data[index + 2] = currentColor[2];
            data[index + 3] = 256;
        }
    }

    tempCtx.putImageData(imageData, 0, 0);

    const scaledCtx = scaledCanvas.getContext('2d', { willReadFrequently: true });
    scaledCtx.clearRect(0, 0, scaledCanvas.width, scaledCanvas.height);
    scaledCtx.drawImage(tempCanvas, 0, 0, scaledCanvas.width, scaledCanvas.height);
}

document.getElementById('scaled-canvas').addEventListener('mousedown', startDrawing);
document.getElementById('scaled-canvas').addEventListener('mouseup', stopDrawing);
document.getElementById('scaled-canvas').addEventListener('mousemove', continueDrawing);



function createBMP(imageData) {
    const width = imageData.width;
    const height = imageData.height;
    const pad = (4 - ((width * 3) % 4)) % 4;
    const stride = width * 3 + pad;

    const filesize = 54 + stride * height;
    const buffer = new ArrayBuffer(filesize);
    const datav = new DataView(buffer);
    const imgData = imageData.data;

    let pos = 0;
    datav.setUint8(pos++, 0x42); // B
    datav.setUint8(pos++, 0x4D); // M

    datav.setUint32(pos, filesize, true);
    pos += 4;

    datav.setUint16(pos, 0, true); // reserved
    pos += 2;
    datav.setUint16(pos, 0, true); // reserved
    pos += 2;

    datav.setUint32(pos, 54, true); // BMP data offset
    pos += 4;

    datav.setUint32(pos, 40, true); // DIB header size
    pos += 4;

    datav.setInt32(pos, width, true);
    pos += 4;
    datav.setInt32(pos, height, true); // Height, positive value means bottom-up row order
    pos += 4;

    datav.setUint16(pos, 1, true); // Number of color planes
    pos += 2;

    datav.setUint16(pos, 24, true); // Bits per pixel
    pos += 2;

    datav.setUint32(pos, 0, true); // No compression
    pos += 4;

    datav.setUint32(pos, stride * height, true); // Image size
    pos += 4;

    datav.setInt32(pos, 0, true); // Horizontal resolution (pixels per meter)
    pos += 4;
    datav.setInt32(pos, 0, true); // Vertical resolution (pixels per meter)
    pos += 4;

    datav.setUint32(pos, 0, true); // Number of colors in palette
    pos += 4;
    datav.setUint32(pos, 0, true); // Important colors
    pos += 4;

    // Copy the pixels into the BMP buffer,
    // changing row order from top-down to bottom-up
    for (let row = height - 1; row >= 0; row--) {
        for (let col = 0; col < width; col++) {
            const bmpPos = pos + (height - row - 1) * stride + col * 3;
            const imgPos = (row * width + col) * 4;
            datav.setUint8(bmpPos, imgData[imgPos + 2]); // blue
            datav.setUint8(bmpPos + 1, imgData[imgPos + 1]); // green
            datav.setUint8(bmpPos + 2, imgData[imgPos]); // red
        }
    }

    return buffer;
}

function saveImage() {
    const processedCanvas = document.getElementById('processed-canvas');
    const saveCanvas = document.createElement('canvas');
    saveCanvas.width = 288;
    saveCanvas.height = 72;
    const saveCtx = saveCanvas.getContext('2d', { willReadFrequently: true });

    saveCtx.drawImage(processedCanvas, 0, 0, 288, 72);

    const imageData = saveCtx.getImageData(0, 0, saveCanvas.width, saveCanvas.height);

    const bmpBuffer = createBMP(imageData);

    const blob = new Blob([bmpBuffer], { type: 'image/bmp' });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'osd_logo.bmp';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
window.onload = function () {
    drawInitialText();
};