const http = require('http');
const url = require('url');
const fs = require('fs');
const mime = require('mime');
function readBooks(callback) {
    fs.readFile('./book.json','utf8',function (err,data) {
        if(err || data == ''){
            callback([]);
        }else{
            callback(JSON.parse(data));
        }
    });
}

function writeBooks(data,callback) {
    fs.writeFile('./book.json',JSON.stringify(data),callback);
}

http.createServer(function (req,res) {

    let {pathname,query} = url.parse(req.url,true);
    if(pathname == '/'){
        res.setHeader('Content-Type','text/html;charset=utf8');
        fs.createReadStream('./index.html').pipe(res);
    }else if(/^\/book(\/\d+)?$/.test(pathname)){

        var id = /^\/book(?:\/(\d+))?$/.exec(pathname)[1];
        switch (req.method){
            case 'GET':
                if(id){
                    readBooks(function (books) {

                        var b = books.find(function (book) {
                            return id == book.id;
                        });
                        res.end(JSON.stringify(b));
                    })
                }else{
                    readBooks(function (data) {
                        res.end(JSON.stringify(data))
                    })
                }
                break;
            case 'POST':
                var str = '';
                req.on('data',function (data) {
                    str+=data;
                });
                req.on('end',function () {
                    var book = JSON.parse(str);
                    readBooks(function (books) {
                        book.id = books.length?books[books.length-1].id+1:1; //增加id
                        books.push(book);//将新的书塞到读出来的数据中
                        writeBooks(books,function () { //写入 并将新增的书返回
                            res.end(JSON.stringify(book));
                        });
                    });
                });
                break;
            case 'DELETE':
                if(id){
                    readBooks(function (books) {
                        books = books.filter(function (book) {
                            return book.id != id;
                        });
                        writeBooks(books,function () {
                            res.end(JSON.stringify({}));
                        })
                    });
                }
                break;
            case 'PUT':
                if(id){
                    var str = '';
                    req.on('data',function (data) {
                        str+=data;
                    });
                    req.on('end',function () {
                        var b = JSON.parse(str); //要改成什么样
                        readBooks(function (books) {
                            books = books.map(function (item) {
                                if(item.id == id){
                                    return b;
                                }
                                return item;
                            });
                            writeBooks(books,function () {
                                res.end(JSON.stringify(b));
                            })
                        })
                    });
                }
                break
        }


    }else{
        fs.exists('.'+pathname,function (flag) {
            if(flag){
                res.setHeader('Content-Type',mime.lookup(pathname)+';charset=utf8');
                fs.createReadStream('.'+pathname).pipe(res);
            }else{
                res.statusCode = 404;
                res.end('Not Found');
            }
        });
    }
}).listen(8090);