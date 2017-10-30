require('babel-polyfill')
var Local = require("./local.js");
var data = require("./data.js");
var keys = Object.keys(data.EN.message)
console.log(keys)
var values = Object.values(data.EN.message)
var values2 = Object.values(data.CN.message)
var values3 = Object.values(data.TN.message)
console.log(values)
var arr = values.map((item, i) => {
    return {
      key: keys[i],
      en: item,
      cn: values2[i],
      tn: values3[i]
    }
  })
console.log(arr)
/**
 * 插入
 */
function insert() {
  for(var i=0;i<arr.length;i++){
    var local = new Local({
      key :arr[i].key,                    //变量
      en: arr[i].en,                        //英文
      cn: arr[i].cn,                        //中文
      tn : arr[i].tn
    });

    local.save(function (err, res) {

      if (err) {
        console.log("Error:" + err);
      }
      else {
        console.log("Res:" + res);
      }

    });
  }


}

insert();/**
 * Created by Administrator on 2017/10/24.
 */
