const express = require('express');

const port = 3000;

const app = express();

app.use(express.static(__dirname));

app.get('*', (req, res) => {
    const pages = ["catalog", "pythagoras"];
    const path = req.originalUrl.slice(1);
    if (pages.includes(path)) {
        res.sendFile(`${__dirname}/${path}.html`);
        return;
    }
    res.sendFile(`${__dirname}/catalog.html`);
});

app.listen(process.env.PORT || 3000, () => {
    console.log(`Express server is listening on :${port}`);
});
