const express = require('express');
const bodyParser = require('body-parser');
const { Client } = require('@elastic/enterprise-search')

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/api/user/prefs', async (req, res) => {

    const client = await new Client({
        url: "<APP_SEARCH_BASE_URL>",
        // bearer auth
        auth: {
          token: "<APP_SEARCH_PRIVATE_KEY>"
        }
      })
    const body = await client.app.getTopClicksAnalytics({
        engine_name: "doctors",
        body: {
            "filters": {"tag": req.body.id},
            "page": {
                "size": 3
            }
        }
    })
    res.status(200).json({ body })
});


app.listen(port, () => console.log(`Listening on port ${port}`));