var express = require('express')
var path = require('path')
var fs = require('fs')
var favicon = require('serve-favicon')
var logger = require('morgan')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')

var index = require('./routes/index')
var users = require('./routes/users')

var local = require('./models/local')

var app = express()

// view engine setup
app.set('views', path.join(__dirname, ''))
app.engine('.html', require('ejs').renderFile)
app.set('view engine', 'html')

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
app.use(cookieParser())
// app.use(express.static(path.join(__dirname, 'static')))
app.use('/public', express.static(path.join(__dirname, 'public')))

app.use('/', index)
app.use('/users', users)
app.get('/local/:page/:limit', function (req, res) {
  var page = req.params.page || 1
  var limit = Number(req.params.limit) || 10
  var count = 0
  console.log(page, limit)
  local.count({}, function (err, doc) {
    if (err) {
      console.log(err)
    } else {
      count = doc
    }
  })
  local.find({})
    .skip((page - 1) * limit)
    .limit(limit)
    .sort({'_id': -1})
    .exec(function (err, doc) {
      console.log('HAHAH')
      if (err) {
        console.log(err)
      } else {
        res.json({code: 0, data: doc, count: count})
      }
    })
})
app.get('/local/all', function (req, res) {
  local.find({})
    .exec(function (err, doc) {
      if (err) {
        console.log(err)
      } else {
        let data = doc
        var key = data.map(item => {
          return item.key
        })
        console.log('key', key)
        console.log('data', data)
        var EN = {}
        var CN = {}
        var TN = {}
        EN.message = {}
        CN.message = {}
        TN.message = {}
        console.log(data[0].key)
        for (var i = 0; i < data.length; i++) {
          var s = data[i].key
          EN.message[s] = data[i].en
          CN.message[s] = data[i].cn
          TN.message[s] = data[i].tn
        }
        var messages = {
          'EN': EN,
          'CN': CN,
          'TN': TN
        }
        console.log('message', messages)
        var filePath = path.join(__dirname, 'public', 'download', 'test.js')
        fs.writeFile(filePath, JSON.stringify(messages), function (err) {
          if (err) {
            return console.log(err)
          }
          console.log('The file was saved!')

          // res.json({code: 0, data: filePath})

          res.sendFile(filePath, 'json.js')
          /*  var stats = fs.statSync(filePath);
           if(stats.isFile()) {
           res.set({
           'Content-Type': 'application/octet-stream',
           'Content-Disposition': 'attachment; filename=' + fileName,
           'Content-Length': stats.size
           });
           // fs.createReadStream(filePath).pipe(res);
           // fs.createReadStream.on("data",(chunk) => res.write(chunk,"binary"));
           // fs.createReadStream.on("end",function () {
           //   // res.end();
           //
           // });
           }
           */
        })
      }
    })
})
app.put('/local', function (req, res) {
  console.log(req)
  var data = req.body
  local.update({key: data.key}, {en: data.en, cn: data.cn, tn: data.tn}, function (err, docs) {
    if (err) {
      console.log(err)
    } else {
      console.log('更改成功：' + docs)
      res.json({code: 0, msg: '更改成功'})
    }
  })
})
app.delete('/local/delete', function (req, res) {
  console.log('123', req)
  var data = req.body
  // res.json({code:0,msg:'删除成功'})
  local.remove(data, function (err) {
    if (err) {
      console.log(err)
      res.json({code: 500, msg: '删除出错'})
    } else {
      res.json({code: 0, msg: '删除成功'})
    }
  })
})
app.post('/local/add', function (req, res) {
  var data = req.body
  console.log(data, typeof data)
  var localone = new local({
    key: data.key,                    //变量
    en: data.en,                        //英文
    cn: data.cn,                        //中文
    tn: data.tn
  })

  localone.save(function (err) {

    if (err) {
      console.log('Error:' + err)
      res.json({code: 500, msg: '新增出错'})
    }
    else {
      console.log('Res:' + res)
      res.json({code: 0, msg: '新增成功'})
    }

  })
})
app.get('/local/repeat', function (req, res) {
  var keyword = req.query.keyword
  var reg = new RegExp(keyword, 'i')
  var count = 0
  console.log('123', req)
  local.count({}, function (err, doc) {
    if (err) {
      console.log(err)
    } else {
      count = doc
    }
  })
  local.find({
    $or: [
      {cn: {$regex: keyword}},
      {key: {$regex: keyword, $options: '$i'}},
      {en: {$regex: keyword, $options: '$i'}}
    ]
  }).limit(10)
    .sort({'_id': -1})
    .exec(function (err, doc) {
      if (err) {
        console.log(err)
      } else {
        res.json({code: 0, data: doc, count: count})
      }
    })
})

app.get('/local/key', function (req, res) {
  var keyword = req.query.keyword
  local.findOne({key: {$regex: keyword, $options: '$i'}})
    .sort({'_id': -1})
    .exec(function (err, doc) {
      if (err) {
        console.log(err)
      } else {
        res.json({code: 0, data: doc})
      }
    })
})

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found')
  err.status = 404
  next(err)
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
