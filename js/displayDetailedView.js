function displayDetailedView(json) {
    const container = document.querySelector(".focus-container");
    const options = {
        year: "numeric",
        month: "long",
        day: "numeric",
    };
    console.log(json);

    const totalRuntime = json.runtime;
    let runtime;
    if (totalRuntime) {
        const hours = Math.floor(totalRuntime / 60);
        const minutes = totalRuntime % 60;
        runtime = `${hours}h ${minutes}m`;
    } else {
        runtime =
            json.number_of_seasons +
            " saisons - " +
            json.number_of_episodes +
            " épisodes";
    }
    container.innerHTML = `
      <div class="banner" style="background-image: url('https://www.themoviedb.org/t/p/original${
          json.backdrop_path
      }')">
        <div class="content">
          <img src="https://www.themoviedb.org/t/p/w500${
              json.poster_path
          }" alt="" srcset='img/popcorn.svg' onload="this.srcset=''"/>
          <div class="right">
            <div class="top">
              <div class="score">${Math.round(json.vote_average * 10)}%</div>
              <div class="title-date">
                <h1>${json.name || json.title}</h1>
                <span>${
                    !json.first_air_date && !json.release_date
                        ? "Date inconnue"
                        : new Date(
                              json.first_air_date || json.release_date
                          ).toLocaleDateString("fr-FR", options)
                } - ${json.genres
        .map((genre) => genre.name)
        .join(", ")} - ${runtime}</span>
              </div>
            </div>
            <div class="synopsis">
              <h2>Synopsis</h2>
              <p>
                ${json.overview || "Pas de synopsis disponible"}
              </p>
            </div>
          </div>
        </div>
    </div>
    <div class="casting">
        <h2>Casting</h2>
        <div class="actors">
        </div>
    </div>	
    `;
}

function displayCast(json) {
    console.log(json);
    const castContainer = document.querySelector(".actors");
    for (let loopThroughCast = 0; loopThroughCast < 4; loopThroughCast++) {
        const cast = json.cast[loopThroughCast] || json.crew[loopThroughCast];
        castContainer.innerHTML += `
        <div class="actor">
            <img src="${
                cast.profile_path != null
                    ? "https://www.themoviedb.org/t/p/w500" + cast.profile_path
                    : "img/user-round-x.svg"
            }" alt="" srcset='img/popcorn.svg' onload="this.srcset=''"/>
            <h4>${cast.name}</h4>
            <span>${
                cast.character || cast.job || cast.known_for_department
            }</span>
          </div>
        `;
    }
}
export { displayDetailedView, displayCast };
