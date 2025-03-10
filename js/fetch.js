import displayHome from "./displayHome.js";
import token from "./settings.js";

class fetchFromAPI {
    static async fetch(path, container) {
        const url = `https://api.themoviedb.org/3/${path}?language=fr-FR`;
        const options = {
            method: "GET",
            headers: {
                accept: "application/json",
                Authorization: `Bearer ${token}`,
            },
        };

        fetch(url, options)
            .then((res) => res.json())
            .then((json) => {
                displayHome(json, container);
            })
            .catch((err) => console.error(err));
    }

    static fetchTrending(sortBy) {
        this.fetch(`trending/all/${sortBy}`, "#tendances");
    }
    static fetchTV(sortBy) {
        this.fetch(`tv/${sortBy}`, "#populaires");
    }
}

export { fetchFromAPI };
