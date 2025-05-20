let activeType = "movie";

function setActiveTab(type) {
  activeType = type;
  document.querySelectorAll(".tab").forEach(btn => btn.classList.remove("active"));
  document.querySelector(`.tab:nth-child(${type === 'movie' ? 1 : type === 'tv' ? 2 : 3})`).classList.add("active");
  loadContent();
}

function debounceSearch() {
  clearTimeout(window.debounceTimer);
  window.debounceTimer = setTimeout(loadContent, 400);
}

async function loadContent() {
  const query = document.getElementById("search").value.trim();
  document.getElementById("loading").style.display = "block";
  document.getElementById("movies").innerHTML = "";

  const apiKey = "488eb36776275b8ae18600751059fb49";
  let url = "";

  if (query) {
    url = `https://api.themoviedb.org/3/search/${activeType}?api_key=${apiKey}&query=${encodeURIComponent(query)}`;
  } else {
    const endpoint = activeType === "movie" ? "movie/popular" : "tv/popular";
    url = `https://api.themoviedb.org/3/${endpoint}?api_key=${apiKey}`;
  }

  try {
    const res = await fetch(url);
    const data = await res.json();
    document.getElementById("loading").style.display = "none";

    const results = data.results || [];
    const grid = document.getElementById("movies");

    results.forEach(item => {
      const card = document.createElement("div");
      card.className = "movie-card";
      card.innerHTML = `
        <img src="https://image.tmdb.org/t/p/w500${item.poster_path}" alt="${item.title || item.name}" />
      `;
      card.onclick = () => openModal(item);
      grid.appendChild(card);
    });
  } catch (err) {
    document.getElementById("error").textContent = "Failed to load content.";
    document.getElementById("loading").style.display = "none";
  }
}

function openModal(movie) {
  document.getElementById("modalTitle").innerText = movie.title || movie.name;
  document.getElementById("modalOverview").innerText = movie.overview;
  document.getElementById("modalRelease").innerText = `Release: ${movie.release_date || movie.first_air_date}`;
  document.getElementById("modalRating").innerText = `Rating: ${movie.vote_average}`;
  const watchBtn = document.getElementById("watchNow");

  if (activeType === "anime") {
    const animeId = movie.id.toString().slice(0, 5); // You can customize this logic
    watchBtn.dataset.id = `${animeId}-1`; // Assume episode 1
  } else {
    watchBtn.dataset.id = movie.id;
  }

  watchBtn.dataset.type = activeType;
  document.getElementById("movieModal").style.display = "flex";
}

function closeModal() {
  document.getElementById("movieModal").style.display = "none";
}

document.getElementById("watchNow").addEventListener("click", () => {
  const id = document.getElementById("watchNow").dataset.id;
  const type = document.getElementById("watchNow").dataset.type;
  window.location.href = `https://nerflixprox.arenaofvalorph937.workers.dev/proxy?id=${id}&type=${type}`;
});

window.onload = loadContent;
