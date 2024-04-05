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

  try {
    const ffmpeg = createFFmpeg({ log: true });
    await ffmpeg.load();

    ffmpeg.FS('writeFile', file.name, await fetchFile(file));

    await ffmpeg.run('-i', file.name, '-vn', '-acodec', 'libmp3lame', 'extracted_audio.mp3');

    const audioData = ffmpeg.FS('readFile', 'extracted_audio.mp3');
    const audioUrl = URL.createObjectURL(new Blob([audioData.buffer], { type: 'audio/mp3' }));

    statusDiv.innerHTML = `Audio extracted successfully. Download: <a href="${audioUrl}" download="extracted_audio.mp3">Download Audio</a>`;
  } catch (error) {
    console.error('Error:', error);
    statusDiv.innerHTML = `An error occurred while extracting audio:<br>${error.message}`;
  }
});