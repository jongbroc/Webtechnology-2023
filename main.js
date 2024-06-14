const SPOTIFY_CLIENT_ID = "67b411e20d594f30bf7a8d3bbde54285";
const SPOTIFY_CLIENT_SECRET = "161fc5e3df004b95af3ba8c62f3eaf54";
const PLAYLIST_ID = "7fXKDSXrj7RljWC4QTixrd";

let tracks = [];
let currentTrackIndex = 0;

async function fetchAccessToken() {
  try {
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `grant_type=client_credentials&client_id=${SPOTIFY_CLIENT_ID}&client_secret=${SPOTIFY_CLIENT_SECRET}`
    });
    const data = await response.json();
    if (data.access_token) {
      fetchPlaylist(data.access_token);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

async function fetchPlaylist(token) {
  try {
    const response = await fetch(`https://api.spotify.com/v1/playlists/${PLAYLIST_ID}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    if (data.tracks && data.tracks.items) {
      tracks = data.tracks.items;
      displayTrack(currentTrackIndex);
      populateTrackList();
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

function displayTrack(index) {
  const track = tracks[index].track;
  document.getElementById("album-image").src = track.album.images[0].url;
  document.getElementById("track-name").textContent = track.name;
  document.getElementById("track-artists").textContent = `by ${track.artists.map(artist => artist.name).join(", ")}`;
  const audioPlayer = document.getElementById("audio-player");
  audioPlayer.src = track.preview_url || '';

  const playPauseButton = document.getElementById("play-pause");
  const playPauseIcon = document.getElementById("play-pause-icon");

  playPauseIcon.src = track.preview_url ? "../assets/play.png" : "disabled.png";
  playPauseButton.disabled = !track.preview_url;

  updateTrackListHighlight();
}

function populateTrackList() {
  const trackList = document.getElementById("track-list");
  trackList.innerHTML = '';

  tracks.forEach((item, index) => {
    const li = document.createElement("li");
    li.textContent = `${item.track.name} - ${item.track.artists.map(artist => artist.name).join(", ")}`;
    li.addEventListener("click", () => {
      currentTrackIndex = index;
      displayTrack(currentTrackIndex);
      playCurrentTrack();
    });
    trackList.appendChild(li);
  });

  updateTrackListHighlight();
}

function updateTrackListHighlight() {
  document.querySelectorAll("#track-list li").forEach((item, index) => {
    item.classList.toggle("playing", index === currentTrackIndex);
  });
}

function playCurrentTrack() {
  const audioPlayer = document.getElementById("audio-player");
  const playPauseIcon = document.getElementById("play-pause-icon");

  if (audioPlayer.src) {
    audioPlayer.play();
    playPauseIcon.src = "../assets/pause.png";
  }
}

document.getElementById("prev-track").addEventListener("click", () => {
  if (currentTrackIndex > 0) {
    currentTrackIndex--;
    displayTrack(currentTrackIndex);
    playCurrentTrack();
  }
});

document.getElementById("next-track").addEventListener("click", () => {
  if (currentTrackIndex < tracks.length - 1) {
    currentTrackIndex++;
    displayTrack(currentTrackIndex);
    playCurrentTrack();
  }
});

document.getElementById("play-pause").addEventListener("click", () => {
  const audioPlayer = document.getElementById("audio-player");
  const playPauseIcon = document.getElementById("play-pause-icon");

  if (audioPlayer.paused) {
    audioPlayer.play();
    playPauseIcon.src = "../assets/pause.png";
  } else {
    audioPlayer.pause();
    playPauseIcon.src = "../assets/play.png";
  }
});

document.getElementById("audio-player").addEventListener("timeupdate", () => {
  const audioPlayer = document.getElementById("audio-player");
  document.getElementById("seek-bar").value = (audioPlayer.currentTime / audioPlayer.duration) * 100 || 0;
});

document.getElementById("seek-bar").addEventListener("input", () => {
  const audioPlayer = document.getElementById("audio-player");
  audioPlayer.currentTime = (document.getElementById("seek-bar").value / 100) * audioPlayer.duration;
});

document.getElementById("volume-control").addEventListener("input", () => {
  document.getElementById("audio-player").volume = document.getElementById("volume-control").value / 100;
});

document.addEventListener('DOMContentLoaded', () => {
  const toggleButton = document.getElementById('toggle-track-list');
  const trackListContainer = document.getElementById('track-list-container');
  const toggleIcon = document.getElementById('toggle-icon');

  toggleButton.addEventListener('click', () => {
    trackListContainer.classList.toggle('hidden');
    toggleIcon.src = trackListContainer.classList.contains('hidden') ? '../assets/show.png' : '../assets/hide.png';
  });
});


fetchAccessToken();
