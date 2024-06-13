const SPOTIFY_CLIENT_ID = "67b411e20d594f30bf7a8d3bbde54285";
const SPOTIFY_CLIENT_SECRET = "161fc5e3df004b95af3ba8c62f3eaf54";
const PLAYLIST_ID = "7fXKDSXrj7RljWC4QTixrd";
const container = document.querySelector('div[data-js="tracks"]');

let tracks = [];
let currentTrackIndex = 0;

function fetchPlaylist(token, playlistId) {
  console.log("token: ", token);

  fetch(`https://api.spotify.com/v1/playlists/${PLAYLIST_ID}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);

      if (data.tracks && data.tracks.items) {
        tracks = data.tracks.items;
        displayTrack(currentTrackIndex);
        populateTrackList();
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function displayTrack(index) {
  const track = tracks[index].track;
  const albumImage = document.getElementById("album-image");
  const trackName = document.getElementById("track-name");
  const trackArtists = document.getElementById("track-artists");
  const audioPlayer = document.getElementById("audio-player");

  albumImage.src = track.album.images[0].url;
  trackName.textContent = `${track.name}`;
  trackArtists.textContent = `by ${track.artists.map((artist) => artist.name).join(", ")}`;
  audioPlayer.src = track.preview_url || '';

  const playPauseButton = document.getElementById("play-pause");
  playPauseButton.textContent = "►";

  if (!track.preview_url) {
    playPauseButton.disabled = true;
  } else {
    playPauseButton.disabled = false;
  }

  updateTrackListHighlight();
}

function populateTrackList() {
  const trackList = document.getElementById("track-list");
  trackList.innerHTML = '';

  tracks.forEach((item, index) => {
    const li = document.createElement("li");
    li.textContent = item.track.name + " - " + item.track.artists.map(artist => artist.name).join(", ");
    li.addEventListener("click", () => {
      currentTrackIndex = index;
      displayTrack(currentTrackIndex);
      playCurrentTrack();
    });
    trackList.appendChild(li);
  });
}

function updateTrackListHighlight() {
  const trackListItems = document.querySelectorAll("#track-list li");
  trackListItems.forEach((item, index) => {
    if (index === currentTrackIndex) {
      item.classList.add("playing");
    } else {
      item.classList.remove("playing");
    }
  });
}

function fetchAccessToken() {
  fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `grant_type=client_credentials&client_id=${SPOTIFY_CLIENT_ID}&client_secret=${SPOTIFY_CLIENT_SECRET}`,
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      if (data.access_token) {
        fetchPlaylist(data.access_token, PLAYLIST_ID);
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
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
  const playPauseButton = document.getElementById("play-pause");

  if (audioPlayer.paused) {
    audioPlayer.play();
    playPauseButton.textContent = "❚❚";
  } else {
    audioPlayer.pause();
    playPauseButton.textContent = "►";
  }
});

document.getElementById("audio-player").addEventListener("timeupdate", () => {
  const audioPlayer = document.getElementById("audio-player");
  const seekBar = document.getElementById("seek-bar");
  seekBar.value = (audioPlayer.currentTime / audioPlayer.duration) * 100 || 0;
});

document.getElementById("seek-bar").addEventListener("input", () => {
  const audioPlayer = document.getElementById("audio-player");
  const seekBar = document.getElementById("seek-bar");
  audioPlayer.currentTime = (seekBar.value / 100) * audioPlayer.duration;
});

document.getElementById("volume-control").addEventListener("input", () => {
  const audioPlayer = document.getElementById("audio-player");
  const volumeControl = document.getElementById("volume-control");
  audioPlayer.volume = volumeControl.value / 100;
});

function playCurrentTrack() {
  const audioPlayer = document.getElementById("audio-player");
  const playPauseButton = document.getElementById("play-pause");

  if (audioPlayer.src) {
    audioPlayer.play();
    playPauseButton.textContent = "❚❚";
  }
}

fetchAccessToken();

function updateTrackListHighlight() {
  const trackListItems = document.querySelectorAll("#track-list li");
  trackListItems.forEach((item, index) => {
    if (index === currentTrackIndex) {
      item.classList.add("playing");
    } else {
      item.classList.remove("playing");
    }
  });
}

// When a track is clicked in the list
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

