<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Neroflix</title>
  <link rel="stylesheet" href="styles.css" />
</head>
<body>

  <!-- Header -->
  <header class="top-menu">
    <img src="https://i.ibb.co/bMzZ1wYN/NEROFLIX-2-20-2025.png" alt="Logo" class="logo" />
    <div class="search-container">
      <input type="text" id="search" placeholder="Search movies..." onkeyup="debounceSearch()" />
    </div>
  </header>

  <!-- Loading & Movies Grid -->
  <p id="loading" class="loading">Loading...</p>
  <div id="movies" class="grid"></div>
  <p id="error" class="error"></p>

  <!-- Embedded Player -->
  <div id="playerContainer" style="display:none; position:relative;">
    <iframe id="videoFrame" style="width:100%; height:90vh; border:none;" allowfullscreen></iframe>
    <button onclick="closePlayer()" style="position:absolute; top:10px; right:10px; z-index:999;">Close Player</button>
  </div>

  <script src="script.js"></script>
  <script>
    function playMovie(id) {
      const iframe = document.getElementById("videoFrame");
      iframe.src = `https://nerflixprox.arenaofvalorph937.workers.dev/proxy?id=${id}&type=movie`;
      document.getElementById("playerContainer").style.display = "block";
      window.scrollTo(0, 0);
    }

    function closePlayer() {
      const iframe = document.getElementById("videoFrame");
      iframe.src = "";
      document.getElementById("playerContainer").style.display = "none";
    }
  </script>
</body>
</html>
