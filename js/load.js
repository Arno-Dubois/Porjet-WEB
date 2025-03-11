import { fetchTV, fetchTrending } from "./fetch.js";

fetchTrending("day");
fetchTV("top_rated");

const movieList = document.querySelectorAll(".movie");
const tvDiv = document.querySelector("#populaires");
movieList.forEach((movie) => {
    movie.addEventListener("click", (e) => {
        let tvOrMovie;
        if (tvDiv.contains(movie)) tvOrMovie = "tv";
        else tvOrMovie = "movie";
        const movieId = movie.id;
        window.location.href = `/focus.html?type=${tvOrMovie}&id=${movieId}`;
    });
});
