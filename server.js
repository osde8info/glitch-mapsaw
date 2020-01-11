const fs = require('node-fs')
const express = require('express')
const app = express()

// get my google tag manager id from env
const mygtmid = process.env.MY_GTM_ID

// get my maptiler api key from env
const maptilekey = process.env.MAPTILE_KEY

app.locals.pretty = true

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'))

app.set('view engine', 'pug')

async function getAqi() {
  let pugdata = {}

  pugdata.mygtmurl = 'https://www.googletagmanager.com/ns.html?id=' + mygtmid

  const nasatiles = 'https://tileserver.maptiler.com/nasa/'
  const satetiles = 'https://api.maptiler.com/tiles/satellite/'

  const width = 5
  const height = 4

  var suffix = '.png'

  try {
    var maptiles = [
      [nasatiles, 3, 1, 1, suffix],
      [nasatiles, 4, 3, 7, suffix],
      [nasatiles, 5, 8, 14, suffix]
    ]

    if (maptilekey) {
      suffix = '.jpg' + '?key=' + maptilekey

      maptiles.push(
        [satetiles, 6, 12, 14, suffix],
        [satetiles, 8, 87, 132, suffix],
        [satetiles, 12, 1396, 2116, suffix]
      )
    }
    var svr = maptiles[Math.floor(Math.random() * maptiles.length)]

    var prefix = svr[0]
    var z = svr[1]
    var top = svr[2]
    var left = svr[3]
    var suffix = svr[4]

    var table = []
    for (var r = 0; r < height; r++) {
      var row = []
      var rr = top + r
      for (var c = 0; c < width; c++) {
        var cc = left + c
        row.push(prefix + z + '/' + cc + '/' + rr + suffix)
      }
      table.push(row)
    }

    pugdata.images1 = table

    pugdata.images2 = []
    row = []

    for (var i = 0; i < width; i++) {
      var x = Math.floor(Math.random() * width)
      var y = Math.floor(Math.random() * height)
      row.push(pugdata.images1[y][x])
      pugdata.images1[y][x] = ''
    }

    pugdata.images2.push(row)

    return pugdata
  } catch (error) {
    console.log(error)
  }
}

app.get('/', async (_, res) => {
  const aqi = await getAqi()
  console.log(new Date())
  res.render('index', aqi)
})

app.get('/dynamic/js/gtaghead.js', async function(req, res) {
  var js = fs.readFileSync('./googtagmgr/gtaghead.js')
  js = js.toString().replace('GTM-XXXXXXX', mygtmid)
  res.setHeader('content-type', 'text/javascript')
  res.write(js)
  res.end()
})

app.listen(process.env.PORT)
