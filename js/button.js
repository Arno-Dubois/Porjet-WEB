import { fetchTV, fetchTrending, fetchMovie } from "./fetch/fetch.js";
import { handleSearch, filters } from "./display/displaySearch.js";
import {
    trendingByDay,
    trendingByWeek,
    tvTopRated,
    tvPopular,
    movieTopRated,
    moviePopular,
    searchInput,
    searchButton,
    yearInput,
    ratingInput,
    searchResultsDropdown,
    searchFilters,
    searchContainer,
} from "./general/querySelector.js";

const trendingDayButton = trendingByDay();
const trendingWeekButton = trendingByWeek();
const tvTopRatedButton = tvTopRated();
const tvPopularButton = tvPopular();
const movieTopRatedButton = movieTopRated();
const moviePopularButton = moviePopular();
const searchInputElement = searchInput();
const searchButtonElement = searchButton();
const yearInputElement = yearInput();
const ratingInputElement = ratingInput();

trendingDayButton.addEventListener("click", () => {
    trendingWeekButton.classList.remove("active");
    fetchTrending("day");
    trendingDayButton.classList.add("active");
});

trendingWeekButton.addEventListener("click", () => {
    trendingDayButton.classList.remove("active");
    fetchTrending("week");
    trendingWeekButton.classList.add("active");
});

tvTopRatedButton.addEventListener("click", () => {
    tvTopRatedButton.classList.add("active");
    fetchTV("top_rated");
    tvPopularButton.classList.remove("active");
});

tvPopularButton.addEventListener("click", () => {
    tvTopRatedButton.classList.remove("active");
    fetchTV("popular");
    tvPopularButton.classList.add("active");
});

movieTopRatedButton.addEventListener("click", () => {
    movieTopRatedButton.classList.add("active");
    fetchMovie("top_rated");
    moviePopularButton.classList.remove("active");
});

moviePopularButton.addEventListener("click", () => {
    movieTopRatedButton.classList.remove("active");
    fetchMovie("popular");
    moviePopularButton.classList.add("active");
});

searchInputElement.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        handleSearch();
    }
});

searchButtonElement.addEventListener("click", handleSearch());
searchInputElement.addEventListener("input", handleSearch);

yearInputElement.addEventListener("change", () => {
    filters.date.year = parseInt(yearInputElement.value);
    if (searchInputElement.value.trim()) {
        handleSearch();
    }
});

ratingInputElement.addEventListener("change", () => {
    filters.rating.value = parseFloat(ratingInputElement.value);
    if (searchInputElement.value.trim()) {
        handleSearch();
    }
});

document.addEventListener("click", (e) => {
    const resultsContainer = searchResultsDropdown();
    const filtersElement = searchFilters();
    if (!e.target.closest(".search-results-dropdown")) {
        resultsContainer.style.display = "none";
        filtersElement.style.display = "none";
    }
});

searchInputElement.addEventListener("keyup", (e) => {
    if (e.key === "Enter") {
        handleSearch();
    }
});

searchButtonElement.addEventListener("click", () => {
    handleSearch();
});

document.addEventListener("click", (e) => {
    const searchContainerElement = searchContainer();
    const searchResults = searchResultsDropdown();
    const filtersElement = searchFilters();

    if (searchResults && filtersElement) {
        if (!searchContainerElement.contains(e.target)) {
            searchResults.style.display = "none";
            filtersElement.style.display = "none";
        }
    }
});

yearInputElement?.addEventListener("change", () => {
    if (yearInputElement.value) {
        filters.date.year = parseInt(yearInputElement.value);
        if (searchInputElement.value.trim()) {
            handleSearch();
        }
    }
});

ratingInputElement?.addEventListener("change", () => {
    if (ratingInputElement.value) {
        filters.rating.value = parseFloat(ratingInputElement.value);
        if (searchInputElement.value.trim()) {
            handleSearch();
        }
    }
});
