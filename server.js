const express = require("express");
const axios = require("axios");

const maptilekey = process.env.MAPTILE_KEY;

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
  let aqi = {};

  const nasatiles='https://tileserver.maptiler.com/nasa/'
  const satetiles='https://api.maptiler.com/tiles/satellite/'
  const width=5
  const height=4
  
  var key = "?key=" + maptilekey;

  try {
    var maptiles = [
      [nasatiles, 3, 1, 1, ".png"],
      [nasatiles, 4, 3, 7, ".png"],
      [nasatiles, 5, 8, 14, ".png"]
      ]
    
    if (key) {
      maptiles.push(  
        [satetiles, 6, 12, 14, ".jpg" + key],
        [satetiles, 8, 87, 132, ".jpg" + key],
        [satetiles, 12, 1396, 2116, ".jpg" + key],
      );
    }
    var svr = maptiles[Math.floor(Math.random() * maptiles.length)];

    var prefix = svr[0];
    var z = svr[1];
    var top = svr[2];
    var left = svr[3];
    var suffix = svr[4];

    aqi.images11 = [];

    var table = [];
    for (var r = 0; r < height; r++) {
      var row = [];
      var rr = top + r;
      for (var c = 0; c < width; c++) {
        var cc = left + c;
        row.push(prefix + z + "/" + cc + "/" + rr + suffix);
      }
      table.push(row);
    }

    aqi.images1 = table;

    aqi.images2 = [];
    row = [];

    for (var i = 0; i < width; i++) {
      var x = Math.floor(Math.random() * width);
      var y = Math.floor(Math.random() * height);
      row.push(aqi.images1[y][x]);
      aqi.images1[y][x] = "";
    }

    aqi.images2.push(row);

    return aqi;
  } catch (error) {
    console.log(error);
  }
}

app.listen(process.env.PORT);
