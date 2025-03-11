import displayHome from "./displayHome.js";
import token from "./settings.js";

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
    const json = response.json();
    return json;
}

async function fetchTrending(sortBy) {
    const json = await fetchAPI(`trending/all/${sortBy}`);
    displayHome(json, "#tendances");
}
async function fetchTV(sortBy) {
    const json = await fetchAPI(`tv/${sortBy}`);
    displayHome(json, "#populaires");
}

export { fetchAPI, fetchTV, fetchTrending };
