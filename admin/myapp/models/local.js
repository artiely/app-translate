/**
 * Created by Administrator on 2017/10/24.
 */
var mongoose = require('./db.js'),
  Schema = mongoose.Schema;

var LocalSchema = new Schema({
  key : { type: String },                    //变量
  en: {type: String},                        //英文
  cn: {type: String},                        //中文
  tn : { type: String}                       //繁体
});

module.exports = mongoose.model('Local',LocalSchema);