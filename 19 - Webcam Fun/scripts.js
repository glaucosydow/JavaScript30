const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');

function getUserVideo() {
    navigator.mediaDevices.getUserMedia({video: true, audio: false})
        .then(localMediaStream => {
        console.log(localMediaStream);
        video.src = window.URL.createObjectURL(localMediaStream);
        video.play();
    })
        .catch(e => console.error('well shit you said no', e))
};

function paintToCanvas() {
    const width = video.videoWidth;
    const height = video.videoHeight;
    canvas.width = width;
    canvas.height = height;
    setInterval(() => {
        ctx.drawImage(video, 0, 0, width, height);
        let pixels = ctx.getImageData(0, 0, width, height);
        // pixels = redEffect(pixels);
        pixels = rgbEffect(pixels);
        ctx.putImageData(pixels, 0, 0);
    }, 16)
}

function takePhoto() {
    snap.currentTime = 0;
    snap.play();
    const data = canvas.toDataURL('image/jpeg');
    const link = document.createElement('a');
    link.href = data;
    link.setAttribute('download', 'sweet');
    link.textContent = 'Download Image';
    link.innerHTML = `<img src=${data} alt='sweet'>`;
    strip.insertBefore(link, strip.firstChild);
}

function redEffect(pixels) {
    for (let i = 0; i < pixels.data.length; i += 4) {
        pixels.data[i] += 100; // red
        pixels.data[i + 1] -= 100; // green
        pixels.data[i + 2] += 100; // blue
    }
    return pixels;
}

function rgbEffect(pixels) {
    for (let i = 0; i < pixels.data.length; i += 4) {
        pixels.data[i - 150] = pixels.data[i]; // red
        pixels.data[i + 100] = pixels.data[i + 1]; // green
        pixels.data[i - 150] = pixels.data[i + 2]; // blue
    }
    return pixels;
}

getUserVideo();

video.addEventListener('canplay', paintToCanvas);

