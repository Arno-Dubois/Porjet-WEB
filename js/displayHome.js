function display(json, container) {
    //console.log(json);
    const options = {
        year: "numeric",
        month: "long",
        day: "numeric",
    };
    const gridTendance = document.querySelector(container);
    for (let loopThroughFilm = 0; loopThroughFilm < 4; loopThroughFilm++) {
        const film = json.results[loopThroughFilm];
        gridTendance.children[loopThroughFilm].innerHTML = `
        <img src="https://www.themoviedb.org/t/p/w500${
            film.poster_path
        }" alt="" srcset='img/popcorn.svg' onload="this.srcset=''"/>
        <div class="score"><p>${Math.round(film.vote_average * 10)}%</p></div>
        <h5>${film.name || film.title}</h5>
        <p>${new Date(
            film.first_air_date || film.release_date
        ).toLocaleDateString("fr-FR", options)}</p>
        `;
        gridTendance.children[loopThroughFilm].addEventListener("click", () => {
            window.location.href = `/focus.html?type=${
                film.name ? "tv" : "movie"
            }&id=${film.id}`;
        });
    }

    const banner = document.querySelector(".search-container");
    json.results[0].backdrop_path
        ? (banner.style.backgroundImage = `url(https://image.tmdb.org/t/p/original${json.results[0].backdrop_path})`)
        : "";
}

export default display;
