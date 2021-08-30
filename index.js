const express = require('express')
const app = express()
const pup = require('puppeteer')


app.listen(3000, () => {
  console.log('Server initialized');
})

app.get('/available', async (req, res) => {
  try {
    const browser = await pup.launch()
    const page = await browser.newPage()
    await page.goto(req.query.page)

    const products = await page.evaluate(() => {
      
      const divsInside = Array.from(document.querySelectorAll('.spc-product__info--inner'))
      const products = []

      divsInside.forEach(item => {
        let ch = Array.from(item.children)
        products.push({
          product_name: item.querySelector('.spc-product__name').innerHTML,
          available: !ch.some(elem => elem.classList.contains('spc-product__oos')),
          price: item.querySelector('.spc-product__price--regular').innerHTML
        })
      })
      return products
    })

    await browser.close()
    res.send({
      data: products
    })

  } catch (err) {
    res.send({
      status: 404
    })
  }
})