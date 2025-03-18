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
    console.log(response);
    if (response.ok) {
        const json = response.json();
        return json;
    } else {
        console.log("rrerere");
        const notFound = document.createElement("dialog");
        const doc = document.querySelector("body");
        notFound.open = true;
        notFound.style =
            "position: fixed;z-index: 50;background-color:oklch(25.78% 0.0648 247.89);border-radius: 50px;padding: 4em 3em;opacity: 1;transition: opacity 500ms;margin: auto;border: none;top: 40%;";
        notFound.innerHTML = `<p style="color:oklch(75.78% 0.0648 247.89);margin: 0;font-size: 2em;text-decoration: underline oklch(55.78% 0.0648 247.89) 10px;text-align: center;">Le film que vous cherchez n'existe pas !</p>`;
        doc.appendChild(notFound);
        console.log(doc);
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

export { fetchAPI, fetchTV, fetchTrending };
