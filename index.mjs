import express from 'express';
import { generate } from 'random-words';

const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));
//for Express to get values using the POST method
app.use(express.urlencoded({ extended: true }));
//setting up database connection pool, replace values in red

//routes
app.get('/', (req, res) => {
    res.render('home', { randomWords: randomWords() });
});

app.get('/characters', async (req, res) => {
    try {
        const page = Number(req.query.page) || 1;
        const url = `https://rickandmortyapi.com/api/character?page=${page}`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        res.render('characters.ejs', {
            characters: data.results,
            count: data.info.count,
            pages: data.info.pages,
            currentPage: page,
            nextPage: data.info.next ? page + 1 : null,
            prevPage: data.info.prev ? page - 1 : null,
            isSearch: false,
            searchTerm: ''
        });
    } catch (error) {
        console.error('Error fetching characters:', error);
        res.status(500).send('Error fetching characters');
    }
});

/* app.get('/characters', async (req, res) => {
    let url = "https://rickandmortyapi.com/api/character";
    let allCharacters = [];
    let totalCount = 0;

    try {
        while (url) {
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status} for ${url}`);
            }

            const data = await response.json();

            if (!totalCount) {
                totalCount = data.info.count;
            }

            allCharacters = allCharacters.concat(data.results);
            url = data.info.next;
            console.log(`Fetched: ${url}`);
        }

        res.render('characters.ejs', {
            characters: allCharacters,
            count: totalCount
        });

    } catch (error) {
        console.error("Error fetching characters:", error);
        res.status(500).send("Error fetching characters");
    }
}); */

/* app.post('/characterSearch', async (req, res) => {
    let name = req.body.name;
    let url = `https://rickandmortyapi.com/api/character/?name=${name}`;
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);

    res.render('characters.ejs', { characters: data.results })
}); */

app.post('/characterSearch', async (req, res) => {
    try {
        const name = req.body.name?.trim() || '';

        if (!name) {
            return res.redirect('/characters');
        }

        const url = `https://rickandmortyapi.com/api/character/?name=${encodeURIComponent(name)}`;
        const response = await fetch(url);

        if (!response.ok) {
            if (response.status === 404) {
                return res.render('characters.ejs', {
                    characters: [],
                    count: 0,
                    pages: 0,
                    currentPage: 1,
                    nextPage: null,
                    prevPage: null,
                    isSearch: true,
                    searchTerm: name
                });
            }

            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        res.render('characters.ejs', {
            characters: data.results,
            count: data.info.count,
            pages: data.info.pages,
            currentPage: 1,
            nextPage: null,
            prevPage: null,
            isSearch: true,
            searchTerm: name
        });
    } catch (error) {
        console.error('Error searching characters:', error);
        res.status(500).send('Error searching characters');
    }
});

/* app.get('/episodes', async (req, res) => {
    try {
        let url = "https://rickandmortyapi.com/api/episode";
        let allEpisodes = [];
        let totalCount = 0;

        while (url) {
            const response = await fetch(url);
            const data = await response.json();

            if (!totalCount) {
                totalCount = data.info.count; // grab once
            }

            allEpisodes = allEpisodes.concat(data.results);
            url = data.info.next;
            console.log(data);
        }

        res.render('episodes.ejs', {
            episodes: allEpisodes,
            count: totalCount
        });

    } catch (error) {
        console.error(error);
        res.status(500).send("Error fetching episodes");
    }
}); */

app.get('/episodes', async (req, res) => {
    try {
        let url = 'https://rickandmortyapi.com/api/episode';
        let allEpisodes = [];
        let totalCount = 0;
        let totalPages = 0;

        while (url) {
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status} for ${url}`);
            }

            const data = await response.json();

            if (totalCount === 0) {
                totalCount = data.info.count;
                totalPages = data.info.pages;
            }

            allEpisodes = allEpisodes.concat(data.results);
            url = data.info.next;
        }

        res.render('episodes.ejs', {
            episodes: allEpisodes,
            count: totalCount,
            pages: totalPages
        });
    } catch (error) {
        console.error('Error fetching episodes:', error);
        res.status(500).send('Error fetching episodes');
    }
});

/* app.get('/locations', async (req, res) => {
    try {
        let url = "https://rickandmortyapi.com/api/location"
        let allLocations = [];
        let totalCount = 0;

        while (url) {
            const response = await fetch(url);
            const data = await response.json();

            if (!totalCount) {
                totalCount = data.info.count; // grab once
            }

            allLocations = allLocations.concat(data.results);
            url = data.info.next;
            console.log(data);
        }

        res.render('locations.ejs', { locations: allLocations, count: totalCount });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error fetching locations");
    }
}); */

app.get('/locations', async (req, res) => {
    try {
        const response = await fetch('https://rickandmortyapi.com/api/location');

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        res.render('locations.ejs', {
            locations: data.results,
            count: data.info.count,
            pages: data.info.pages
        });
    } catch (error) {
        console.error('Error fetching locations:', error);
        res.status(500).send('Error fetching locations');
    }
});

app.get('/about', (req, res) => {
    res.render("about")
});
app.listen(3000, () => {
    console.log(`Express server running here: http://localhost:3000`)
})

function randomWords() {
    return generate({ exactly: 5, join: ', ' });
}