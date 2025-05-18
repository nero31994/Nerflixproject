const API_KEY = "f81d3f9bca0b5c7e59b727f3a24490dd";
const PROXY_URL = "https://nerflixprox.arenaofvalorph937.workers.dev/proxy";

const moviesContainer = document.getElementById("movies");
const loadingEl = document.getElementById("loading");
const errorEl = document.getElementById("error");

let debounceTimer;

// Fetch popular movies on load
window.onload = () => {
  fetchMovies();
};

// Debounce search input
function debounceSearch() {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    const query = document.getElementById("search").value.trim();
    if (query) {
      searchMovies(query);
    } else {
      fetchMovies();
    }
  }, 400);
}

// Fetch popular movies from TMDB
async function fetchMovies() {
  loadingEl.style.display = "block";
  errorEl.textContent = "";
  moviesContainer.innerHTML = "";

  try {
    const response = await fetch(
      `${PROXY_URL}?url=https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en-US&page=1`
    );
    const data = await response.json();
    loadingEl.style.display = "none";
    displayMovies(data.results);
  } catch (error) {
    loadingEl.style.display = "none";
    errorEl.textContent = "Failed to load movies.";
  }
}

// Search movies by query
async function searchMovies(query) {
  loadingEl.style.display = "block";
  errorEl.textContent = "";
  moviesContainer.innerHTML = "";

  try {
    const response = await fetch(
      `${PROXY_URL}?url=https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=en-US&query=${encodeURIComponent(
        query
      )}&page=1&include_adult=false`
    );
    const data = await response.json();
    loadingEl.style.display = "none";
    if (data.results.length === 0) {
      errorEl.textContent = "No results found.";
    } else {
      displayMovies(data.results);
    }
  } catch (error) {
    loadingEl.style.display = "none";
    errorEl.textContent = "Search failed.";
  }
}

// Display movies grid
function displayMovies(movies) {
  moviesContainer.innerHTML = "";

  movies.forEach((movie) => {
    const movieEl = document.createElement("div");
    movieEl.classList.add("movie");

    const posterPath = movie.poster_path
      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      : "https://via.placeholder.com/500x750?text=No+Image";

    movieEl.innerHTML = `
      <img src="${posterPath}" alt="${movie.title || movie.name}" />
      <div class="overlay">${movie.title || movie.name}</div>
    `;

    movieEl.addEventListener("click", () => openModal(movie));

    moviesContainer.appendChild(movieEl);
  });
}
