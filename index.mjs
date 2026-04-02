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
    res.render("home", { randomWords: randomWords() });
});

app.get('/characters', async (req, res) => {
    let url = "https://rickandmortyapi.com/api/character"
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);

    res.render('characters.ejs', { characters: data.results })
});

app.post('/characterSearch', async (req, res) => {
    let name = req.body.name;
    let url = `https://rickandmortyapi.com/api/character/?name=${name}`;
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);

    res.render('characters.ejs', { characters: data.results })
});

app.get('/episodes', async (req, res) => {
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
});

app.get('/locations', async (req, res) => {

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


});

app.get('/about', (req, res) => {
    res.render("about")
});

app.get("/dbTest", async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT CURDATE()");
        res.send(rows);
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).send("Database error!");
    }
});//dbTest
app.listen(3000, () => {
    console.log(`Express server running here: http://localhost:3000`)
})


function randomWords() {
    return generate({ exactly: 5, join: ', ' });
}