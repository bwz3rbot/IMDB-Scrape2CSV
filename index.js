const
    request = require('request-promise'),
    cheerio = require('cheerio'),
    fs = require('fs'),
    Parser = require('json2csv').Parser;

// CSV Setup
const fields = ["title", "rating", "summary", "releaseDate"]
const opts = {
    fields
}
const parser = new Parser(opts)

// Grab command line argument
let thisUrl = process.argv[2];

let requestObject = {
    uri: thisUrl,
    headers: {
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "en-US,en;q=0.5",
        "Cache-Control": "max-age=0",
        "Connection": "keep-alive",
        "Cookie": "GET YOUR OWN COOKIES!", // don't actually use this line.. copy your own cookies using dev-tools!
        "DNT": "1",
        "Host": "www.imdb.com",
        "TE": "Trailers",
        "Upgrade-Insecure-Requests": "1",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:81.0) Gecko/20100101 Firefox/81.0"

    },
    gzip: true
};

const imdbData = [];
const moreLikeThis = new Map();

async function makeRequest(requestObject) {
    const response = await request(requestObject);
    return cheerio.load(response);
}

// Get the info for a specific imdb title
const getInfo = function ($) {
    // IMDB Data
    let title = $(".title_wrapper > h1").text().trim();
    let rating = $('div[class="ratingValue"] > strong > span').text();
    let summary = $('div[class="summary_text"]').text().trim();
    let releaseDate = $('a[title="See more release dates"]').text().trim();

    imdbData.push({
        title,
        rating,
        summary,
        releaseDate
    });
    return title;
}

// Get Related Titles
const getMoreLikeThis = function ($) {
    let recItems = $('div[class="rec_item"]').get();
    recItems.forEach(item => {
        console.log("pushing item!")
        link = $(item).find('a').attr('href');
        moreLikeThis.set("https://www.imdb.com" + link)
    })
    console.log(moreLikeThis)
}

const parse2csv = function (filename = String) {
    console.log("PARSING 2 CSV...")
    console.log("IMDBDATA: ", imdbData)
    console.log("PARSING!!!")
    const csv = parser.parse(imdbData)
    console.log("FS Writing to file: ", filename)
    if (filename.includes(":")) {
        filename = filename.replace(":", "-")
    }
    fs.writeFileSync("./" + filename + ".csv", csv, "utf-8")
}

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function run() {
    // Make first request
    const $ = await makeRequest(requestObject);
    console.log("getting the info...")
    let filename = getInfo($);
    console.log("getting more like this...")
    getMoreLikeThis($);
    console.log("iterating over map...")
    requestObject.headers["Referer"] = requestObject.uri;
    for (const [url, i] of moreLikeThis) {
        requestObject.uri = url

        console.log("making next request... ", requestObject)
        let response = await makeRequest(requestObject)
        console.log("getting the info....")
        getInfo(response)
        await timeout(500)
    }
    console.log("parsing to csv....")
    parse2csv(filename);
}

run();