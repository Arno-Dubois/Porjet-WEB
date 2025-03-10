import { fetchFromAPI } from "./fetch.js";

const trendingByDay = document.querySelector("#day");
const trendingByWeek = document.querySelector("#week");
const tvTopRated = document.querySelector("#top_rated");
const tvPopular = document.querySelector("#popular");

trendingByDay.addEventListener("click", () => {
    trendingByWeek.classList.remove("active");
    fetchFromAPI.fetchTrending("day");
    trendingByDay.classList.add("active");
});

trendingByWeek.addEventListener("click", () => {
    trendingByDay.classList.remove("active");
    fetchFromAPI.fetchTrending("week");
    trendingByWeek.classList.add("active");
});

tvTopRated.addEventListener("click", () => {
    tvTopRated.classList.add("active");
    fetchFromAPI.fetchTV("top_rated");
    tvPopular.classList.remove("active");
});

tvPopular.addEventListener("click", () => {
    tvTopRated.classList.remove("active");
    fetchFromAPI.fetchTV("popular");
    tvPopular.classList.add("active");
});
