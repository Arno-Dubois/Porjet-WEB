import {
    focusContainer,
    filmographyContainer,
} from "../general/querySelector.js";

function displayActorFocus(actor) {
    const container = focusContainer();

    const options = {
        year: "numeric",
        month: "long",
        day: "numeric",
    };

    const birthday = actor.birthday
        ? new Date(actor.birthday).toLocaleDateString("fr-FR", options)
        : "Date inconnue";
    const age = actor.birthday ? calculateAge(actor.birthday) : "";
    const birthplace = actor.place_of_birth || "Lieu de naissance inconnu";
    const biography = actor.biography || "Aucune biographie disponible";

    container.innerHTML = `
      <header class="banner" style="background-image: url('https://www.themoviedb.org/t/p/original${
          actor.profile_path
      }')">
        <div class="content">
          <img src="${
              actor.profile_path != null
                  ? "https://www.themoviedb.org/t/p/w500" + actor.profile_path
                  : "img/user-round-x.svg"
          }" 
               alt="${actor.name}" 
               srcset="img/user-round-x.svg" 
               onload="this.srcset=''"/>
          <div class="right">
            <div class="top">
              <div class="title-date">
                <h1>${actor.name}</h1>
                <span>${birthday} ${
        age ? `(${age} ans)` : ""
    } - ${birthplace}</span>
              </div>
            </div>
            <div class="synopsis">
              <h2>Biographie</h2>
              <p>${biography}</p>
            </div>
          </div>
        </div>
      </header>
      <article class="casting">
        <h2>Filmographie</h2>
        <div class="actors grid-tendances">
        </div>
      </article>	
    `;
}

function calculateAge(dateOfBirth) {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }

    return age;
}

function displayActorFilmography(credits) {
    const moviesContainer = filmographyContainer();

    const sortedMovies = credits.cast.sort(
        (a, b) => b.popularity - a.popularity
    );

    const moviesToShow = sortedMovies.slice(0, 8);

    moviesToShow.forEach((movie) => {
        moviesContainer.innerHTML += `
        <div class="movie">
            <a href="focus.html?type=${movie.media_type}&id=${movie.id}">
                <img src="${
                    movie.poster_path
                        ? "https://www.themoviedb.org/t/p/w500" +
                          movie.poster_path
                        : "img/popcorn.svg"
                }" alt="${
            movie.title
        }" srcset='img/popcorn.svg' onload="this.srcset=''"/>
                <div class="score"><p>${Math.round(
                    movie.vote_average * 10
                )}%</p></div>
                <h5>${movie.title || movie.name}</h5>
                <span>${
                    movie.character ? `Role: ${movie.character}` : ""
                }</span>
            </a>
        </div>
        `;
    });
}

export { displayActorFocus, displayActorFilmography };
