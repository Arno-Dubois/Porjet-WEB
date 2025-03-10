import displayHome from "./displayHome.js";

class fetchFromAPI {
    static async fetch(path, container) {
        const url = `https://api.themoviedb.org/3/${path}?language=fr-FR`;
        const options = {
            method: "GET",
            headers: {
                accept: "application/json",
                Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjOTk2OTA2N2EzMjE4Y2U0M2M0OTE1ODYwZmI1YTY4MSIsIm5iZiI6MTczOTg4NDM3My4yMTIsInN1YiI6IjY3YjQ4NzU1OTFkN2U2NmM2NTZkZDFmZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.6Br1nDrZmToRWUlTfdv90vyrGd0XTKU4tOu8X23lkBY`,
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
