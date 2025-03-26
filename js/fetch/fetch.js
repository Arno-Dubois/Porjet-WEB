import displayHome from "../display/displayHome.js";
import token from "../general/settings.js";

async function fetchAPI(path) {
    const url = `https://api.themoviedb.org/3/${path}?language=fr-FR`;
    const options = {
        method: "GET",
        headers: {
            accept: "application/json",
            Authorization: `Bearer ${token}`,
        },
    };

    const response = await fetch(url, options);
    // console.log(response);
    if (response.ok) {
        const json = response.json();
        return json;
    } else {
        window.location.href = "404.html";
    }
}

async function fetchTrending(sortBy) {
    const json = await fetchAPI(`trending/all/${sortBy}`);
    displayHome(json, "#tendances");
}
async function fetchTV(sortBy) {
    const json = await fetchAPI(`tv/${sortBy}`);
    displayHome(json, "#populaires");
}
async function fetchMovie(sortBy) {
    const json = await fetchAPI(`movie/${sortBy}`);
    displayHome(json, "#movie");
}

export { fetchAPI, fetchTV, fetchTrending, fetchMovie };
