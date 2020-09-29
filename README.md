# SCRAPE-TUT-yt

## Table of Contents

- [About](#about)
- [Getting Started](#getting_started)
- [Usage](#usage)
- [Contributing](../CONTRIBUTING.md)

## About <a name = "about"></a>

This project was completed with the help of this tutorial: (https://www.youtube.com/watch?v=BqGq9MTSt7g)

I was able to make a *better* way of getting a list of titles than the instructor.

Instead of simply writing an array by hand every time you run the code, the application will create a dynamic list from the related titles found on the first url.

Simply give it a first url, and it generates the list according to its related titles.

It then saves these values to a .csv file named after the title of the url given to it first.



### Installing

First, make sure you have node installed on your machine.

Install the dependancies:
```
npm i
```

Edit the line in index.js which says 'GET YOUR OWN COOKIE' to be your cookie.\
Go to the url you are about to evaulate.\
Open up devtools by pressing f-12.\
Go into network tab and find your cookie.\
Copy the cookie string and paste it into that line.


Run the application with the url of the title you are to evaulate passed in as a command line argument:
```
node index.js "https://www.imdb.com/title/tt0052520/?pf_rd_m=A2FGELUUNOQJNL&pf_rd_p=12230b0e-0e00-43ed-9e59-8d5353703cce&pf_rd_r=6KQ70RPV7ZC2S3JDB59Y&pf_rd_s=center-1&pf_rd_t=15506&pf_rd_i=toptv&ref_=chttvtp_tt_21"
```

The csv will be saved in the current directory as the name of the title of the url given.