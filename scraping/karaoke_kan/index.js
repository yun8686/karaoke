const puppeteer = require('puppeteer');
const puppeteerMaster = require('../puppeteerMaster');
const fs = require('fs');

const outputPath = "./scraping/output_data/tokyo.json";

const DELAY = 100;

module.exports = {
  getResults,
};

async function getResults(){
  const page = await puppeteerMaster();
  const pageDatas = [];
  for(let i=0;i<=8;i++){
    const url = `http://karaokekan.jp/shop/tokyo_area${i}/`;
    await page.goto(url);
    const results = await page.evaluate(()=>{
      try{
        const alist = document.querySelectorAll('.shop-name a');
        const addlist = document.querySelectorAll('.mid-l');
        var data = [];
        for(var i=0;i<alist.length;i++){
          const url = alist[i].href;
          const obj = {};
          obj.id = url.match(/\/(\d+)\.html/)[1]; //  "http://karaokekan.jp/shop/tokyo_area0/03240012.html" の03240012を抽出
          obj.url = url;
          obj.imageUrl = `http://karaokekan.jp/shop/images/price/pn${obj.id}.jpg`;
          obj.address = addlist[i].innerText.split("\n")[0];
          obj.name = alist[i].innerText;
          data.push(obj);
        }
        return data;
      }catch(e){
        return e.message;
      }
    });
    results.forEach(v=>{
      pageDatas.push(v);
    });
  }
  fs.writeFileSync(outputPath, JSON.stringify(pageDatas, '', '  '));
  return pageDatas;
}
