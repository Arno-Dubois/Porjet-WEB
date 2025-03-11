function displayDetailedView(json) {
    const container = document.querySelector(".focus-container");
    const options = {
        year: "numeric",
        month: "long",
        day: "numeric",
    };
    console.log(json);

    const totalRuntime = json.runtime;
    const hours = Math.floor(totalRuntime / 60);
    const minutes = totalRuntime % 60;
    const runtime = `${hours}h ${minutes}m`;

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
                <h1>${json.name ? json.name : json.title}</h1>
                <span>${new Date(
                    json.first_air_date
                        ? json.first_air_date
                        : json.release_date
                ).toLocaleDateString("fr-FR", options)} - ${json.genres
        .map((genre) => genre.name)
        .join(", ")} - ${runtime}</span>
              </div>
            </div>
            <div class="synopsis">
              <h2>Synopsis</h2>
              <p>
                ${json.overview}
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
        const cast = json.cast[loopThroughCast];
        castContainer.innerHTML += `
        <div class="actor">
            <img src="https://www.themoviedb.org/t/p/w500${cast.profile_path}" alt="" srcset='img/popcorn.svg' onload="this.srcset=''"/>
            <h4>${cast.name}</h4>
            <span>${cast.character}</span>
          </div>
        `;
    }
}
export { displayDetailedView, displayCast };
