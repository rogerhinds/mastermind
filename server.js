// JavaScript File
var http = require('http');
var url = require('url');
var fs = require('fs');
var path = require('path');
var mysql = require('mysql');
var data;
var sio = require('socket.io');
var db = require('./db');
var clients=[];

var server=http.createServer(function (req, res) {
    var pathname = url.parse(req.url).pathname;
    console.log('someone wants ' + pathname);
    switch (pathname) {
        case '/m':
            // code
            res.writeHead(200, {'Content-Type': 'text/plain'});
            res.write('This will be encode awesome Mastermind\n');
            res.end();
    
            break;
        // case '/favicon.ico':
        //     // code
        //     res.writeHead(200, {'Content-Type': 'text/plain'});
        //     data = ":)\n";
        //     console.log(data)
        //     res.end(data);
    
        //     break;
        
        default:
            // code
            switch (path.extname(pathname)) {
                case '.jpg':
                case '.ico':
                    // code
                    fs.readFile("." + pathname,  function(error, data){
                    
                    if (error){
                        console.log("no");
                        res.writeHead(404);
                        res.end("Sozula\nCan't serve that image :(");
                    }
                    else{
                        console.log("yes");
                        //console.log(data);
                        res.writeHead(200, {'Content-Type': 'image/jpeg'});
                        res.end(data);
                    }
                });
                    break;
                
                default:
                    // code
                    console.log(__dirname + pathname);
                    fs.readFile("." + pathname, 'utf8', function(error, data){
                            
                            if (error){
                                console.log("no");
                                res.writeHead(404);
                                res.end("Sozula\nNo such file:(");
                            }
                            else{
                                console.log("yes");
                               // console.log(data);
                                res.writeHead(200);//, {'Content-Type': 'text/html'});
                                res.end(data,'utf8');
                            }
                });
            }
            
    }
   
    
});
server.listen(process.env.PORT, process.env.IP);
var io = sio.listen(server);
io.set('log level', 1);

/*global connection*/
connection = mysql.createConnection({
    host:'rogerhinds-mastermind2-1636810',
    user:'rogerhinds',
    password:'',
    database:'mm',
    port:3306});
connection.connect();
console.log("listening");
            
io.sockets.on('connection', function(socket){
    console.log("soxc"+socket.id);
    socket.emit('heard', {message:"You're there"});
    
    socket.on('saveResult',function(data){
        // pass the received json string (data) to the saveResult function
        // string should have name, level, skill,type,score format
        db.saveResultToDB(data,socket);
        });
        
    socket.on('attemptLogin', function(data){
        // note that the db function handles emitting the success signal to the client
        // if is done locally then we only get null, presumably as the query has not completed
        db.loginToDB(data,socket);
    });
    
    socket.on('getStats', function(data){
       // json should be PName: 'Roger' format
       db.getStats(data,socket);
    });
    
   // socket.on('game end',function(data){console.log(data.message)});
});    