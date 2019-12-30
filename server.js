const express = require("express");
const axios = require("axios");

const key = process.env.AIRVISUAL_KEY;
const city = process.env.AIRVISUAL_CITY_NAME;
const state = process.env.AIRVISUAL_STATE_NAME;
const country = process.env.AIRVISUAL_COUNTRY_NAME;

const app = express();

app.set("view engine", "pug");
app.locals.pretty = true;

// http://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

app.get("/", async (_, res) => {
  const aqi = await getAqi();
  res.render("index", aqi);
});

async function getAqi() {
  const params = { key, city, state, country };
  let aqi = {
    value: 0,
    level: "",
    message: ""
  };

  try {
    var img = "https://tileserver.maptiler.com/nasa/";

    var z = 3;
    aqi.images1 = [
      [
        img + z + "/1/1.png",
        img + z + "/2/1.png",
        img + z + "/3/1.png",
        img + z + "/4/1.png"
      ],

      [
        img + z + "/1/2.png",
        img + z + "/2/2.png",
        img + z + "/3/2.png",
        img + z + "/4/2.png"
      ],

      [
        img + z + "/1/3.png",
        img + z + "/2/3.png",
        img + z + "/3/3.png",
        img + z + "/4/3.png"
      ],

      [
        img + z + "/1/4.png",
        img + z + "/2/4.png",
        img + z + "/3/4.png",
        img + z + "/4/4.png"
      ]
    ];

    aqi.images2 = [];
    var images3 = [];

    for (var i = 0; i < 4; i++) {
      var x = Math.floor(Math.random() * 4);
      var y = Math.floor(Math.random() * 4);
      images3.push(aqi.images1[x][y]);
      aqi.images1[x][y] = "";
    }

    aqi.images2.push(images3);

    return aqi;
  } catch (error) {
    console.log(error);
  }
}

app.listen(process.env.PORT);
