import { fetchTV, fetchTrending, fetchMovie } from "./fetch.js";
import { handleSearch, filters } from "./search.js";

const trendingByDay = document.querySelector("#day");
const trendingByWeek = document.querySelector("#week");
const tvTopRated = document.querySelector("#top_rated");
const tvPopular = document.querySelector("#popular");
const movieTopRated = document.querySelector("#top_rated_movie");
const moviePopular = document.querySelector("#popular_movie");

trendingByDay.addEventListener("click", () => {
    trendingByWeek.classList.remove("active");
    fetchTrending("day");
    trendingByDay.classList.add("active");
});

trendingByWeek.addEventListener("click", () => {
    trendingByDay.classList.remove("active");
    fetchTrending("week");
    trendingByWeek.classList.add("active");
});

tvTopRated.addEventListener("click", () => {
    tvTopRated.classList.add("active");
    fetchTV("top_rated");
    tvPopular.classList.remove("active");
});

tvPopular.addEventListener("click", () => {
    tvTopRated.classList.remove("active");
    fetchTV("popular");
    tvPopular.classList.add("active");
});

movieTopRated.addEventListener("click", () => {
    movieTopRated.classList.add("active");
    fetchMovie("top_rated");
    moviePopular.classList.remove("active");
});

moviePopular.addEventListener("click", () => {
    movieTopRated.classList.remove("active");
    fetchMovie("popular");
    moviePopular.classList.add("active");
});

const searchInput = document.querySelector(".search-container div > input");
const searchButton = document.querySelector(".search-container div > button");
const yearInput = document.querySelector(".year-input");
const ratingInput = document.querySelector(".rating-input");

searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        handleSearch();
    }
});

searchButton.addEventListener("click", handleSearch());
searchInput.addEventListener("input", handleSearch);

yearInput.addEventListener("change", () => {
    filters.date.year = parseInt(yearInput.value);
    if (searchInput.value.trim()) {
        handleSearch();
    }
});

ratingInput.addEventListener("change", () => {
    filters.rating.value = parseFloat(ratingInput.value);
    if (searchInput.value.trim()) {
        handleSearch();
    }
});

document.addEventListener("click", (e) => {
    const resultsContainer = document.querySelector(".search-results-dropdown");
    const searchFilters = document.querySelector(".search-filters");
    if (!e.target.closest(".search-results-dropdown")) {
        resultsContainer.style.display = "none";
        searchFilters.style.display = "none";
    }
});

searchInput.addEventListener("keyup", (e) => {
    if (e.key === "Enter") {
        handleSearch();
    }
});

searchButton.addEventListener("click", () => {
    handleSearch();
});

// Close search results when clicking outside
document.addEventListener("click", (e) => {
    const searchContainer = document.querySelector(".search-container");
    const searchResults = document.querySelector(".search-results-dropdown");
    const searchFilters = document.querySelector(".search-filters");

    if (searchResults && searchFilters) {
        if (!searchContainer.contains(e.target)) {
            searchResults.style.display = "none";
            searchFilters.style.display = "none";
        }
    }
});

// Update filters when inputs change
yearInput?.addEventListener("change", () => {
    if (yearInput.value) {
        filters.date.year = parseInt(yearInput.value);
        if (searchInput.value.trim()) {
            handleSearch();
        }
    }
});

ratingInput?.addEventListener("change", () => {
    if (ratingInput.value) {
        filters.rating.value = parseFloat(ratingInput.value);
        if (searchInput.value.trim()) {
            handleSearch();
        }
    }
});
