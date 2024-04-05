const fileInput = document.getElementById('fileInput');
const extractButton = document.getElementById('extractButton');
const statusDiv = document.getElementById('status');

extractButton.addEventListener('click', async () => {
  const file = fileInput.files[0];
  if (!file) {
    statusDiv.textContent = 'Please select a video file.';
    return;
  }

  statusDiv.textContent = 'Extracting audio...';

  const fileBuffer = await readFile(file);
  const audioFileName = 'extracted_audio.mp3';

  try {
    const ffmpeg = FFmpeg.createFFmpeg({ log: true });
    await ffmpeg.load();

    ffmpeg.FS('writeFile', file.name, await fetchFile(file));

    await ffmpeg.run('-i', file.name, '-vn', '-acodec', 'libmp3lame', audioFileName);

    const audioData = ffmpeg.FS('readFile', audioFileName);
    const audioUrl = URL.createObjectURL(new Blob([audioData.buffer], { type: 'audio/mp3' }));

    statusDiv.innerHTML = `Audio extracted successfully. Download: <a href="${audioUrl}" download="${audioFileName}">Download Audio</a>`;
  } catch (error) {
    console.error('Error:', error);
    statusDiv.textContent = 'An error occurred while extracting audio.';
  }
});

function readFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}

function fetchFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(new Uint8Array(reader.result));
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}