const PORT = process.env.PORT || 8000
const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')
const app = express()

const newspapers = [
    {
        name: 'ndtv',
        address: 'https://www.ndtv.com/business/cryptocurrency/news',
        
        base: ''
    },
    {
        name: 'hindustan times',
        address: 'https://www.hindustantimes.com/topic/cryptocurrency',
        
        base: 'https://www.hindustantimes.com/'
    },
    {
        name: 'the hindu',
        address: 'https://www.thehindu.com/topic/cryptocurrency',
        base: 'https://www.thehindu.com/'
    },
    {
        name: 'businesstoday',
        address: 'https://www.businesstoday.in/crypto',
        base: '',
    },
    {

        name: 'economic times',
        address: 'https://economictimes.indiatimes.com/topic/cryptocurrencies',
        base: 'https://economictimes.indiatimes.com',
    },
    {
        name: 'livemint',
        address: 'https://www.livemint.com/market/cryptocurrency',
        base: 'https://www.livemint.com',
    },
    {
        name: 'telegraph india',
        address: 'https://www.telegraphindia.com/topic/cryptocurrency',
        base: 'https://www.telegraphindia.com',
    },
    {
        name: 'deccan chronicle',
        address: 'https://www.deccanchronicle.com/content/tags/cryptocurrencies',
        base: 'https://www.deccanchronicle.com',
    },
    {
        name: 'the statesman',
        address: 'https://www.thestatesman.com/tag/cryptocurrency',
        base: ''
    },
    {
        name: 'financial express',
        address: 'https://www.financialexpress.com/cryptocurrency/',
        base: ''
    },
    {
        name: 'bloomberg',
        address: 'https://www.bloomberg.com/crypto/',
        base: 'https://www.bloomberg.com'
    }
]

const articles = []

newspapers.forEach(async newspaper => {
    const news = await axios.get(newspaper.address)
        
        const html = news.data
        const $ = cheerio.load(html)
        $('a:contains("crypto")',html).each(function () {
                const title = $(this).text()
                const url = $(this).attr('href')
                console.log(newspaper.base)
                articles.push({
                    title,
                    url: newspaper.base + url,
                    source: newspaper.name
                })
            });

    // console.log(news);
})

app.get('/', (req, res) => {
    res.json('Welcome to my Cryptocurrency News API')
})

app.get('/news', (req, res) => {
    res.json(articles)
})

app.get('/news/:newspaperId', (req, res) => {
    const newspaperId = req.params.newspaperId

    const newspaperAddress = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].address
    const newspaperBase = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].base


    axios.get(newspaperAddress)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)
            const specificArticles = []

            $('a:contains("crypto")', html).each(function () {
                const title = $(this).text()
                const url = $(this).attr('href')
                specificArticles.push({
                    title,
                    url: newspaperBase + url,
                    source: newspaperId
                })
            })
            res.json(specificArticles)
        }).catch(err => console.log(err))
})

app.listen(PORT, () => console.log(`server running on PORT ${PORT}`))