const puppeteer = require('puppeteer');
var obj;
module.exports = async()=>{
  if(obj) return obj;
  const browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox'
      ]
  });
  return obj = await browser.newPage();
}
