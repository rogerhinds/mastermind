var mysql = require('mysql');
var datejs = require('datejs');

//var _this = this;
module.exports={
     
    saveResultToDB: function(jsonData,socket){
        // function that takes a well formatted game result
        // and appends it to the results table
        if(jsonData.pName>""){
            // only save results for logged in players i.e those with a pName
            var query = connection.query('INSERT INTO result SET ?', jsonData, function(err, result) {
                if(!err){
                    // console.log("Added " + jsonData.Score +" for " + jsonData.pName);
                    // // if it is a good save then get the stats to update
                    // console.log("the socket is " + socket);
                    module.exports.getStats({PName: jsonData.pName},socket);
                }
                else
                    console.log("Error adding " + jsonData.Score +" for " + jsonData.pName);
            });
           // console.log(query.sql);
       }
    },

    loginToDB: function(jsonData,socket){
        // takes username and encrypted password as parameters
        // if the username exists in db and pwd matches then login
        // if the username does not exists then create entry in db and login
        // otherwise don't login
        // login is indicated by returning a non-empty string containing the username in a 'goodLogin' emit
        // failure is indicated by an empty string returned on 'badLogin' emit
        if(jsonData.PName>""){
            
            var qry = connection.query('SELECT * FROM player WHERE (PName = ?)',jsonData.PName, function(err, result, fields) {
                //console.log(qry.sql);
                if(!err){
                    // returns the username if logon is successful i.e. a single record matches
                    if(result.length==1){
                       // there is a username - check the pwd matches
                       if(result[0].PpwdHash == jsonData.PpwdHash){
                           // it's a match and a successful login
                            console.log("good login for " + result[0].PName);
                            socket.emit('goodLogin', result[0].PName);
                       }
                       else{
                           // good username but no match on pwd
                           console.log("username and pwd no match");
                            socket.emit('badLogin', "");
                       }
                    }
                    else{
                        // no username match, just add this user as a new record
                        var qury = connection.query('INSERT INTO player SET ?',jsonData,function(err, result){
                            if(!err){
                                // successfully added, continue with good login
                                console.log("added new user");
                                socket.emit('goodLogin',jsonData.PName);
                            }
                             else{
                           // failed for some reason
                            console.log("couldn't add new user");
                            socket.emit('badLogin', "");
                            }
                        });
                    }
                    
                    //    console.log(result[0].PName);
                       // return result[0].PName;
                       // rather than return a result, emit the result directly to the client
                       // this avoids issue where query has not finished but for some reason
                       // the return value if this function is considered null
                      //  socket.emit('login', result[0].PName);
                }
                else{
                    // error performing the queryreturn "";
                    console.log("Error querying db");
                    socket.emit('badLogin',"");
                }
            });
        }    
        else{
            console.log("No login name supplied");
            socket.emit('badLogin',"");
        }
    },
    
    getStats: function(jsonData,socket){
        // jsonData should just have a username PName
        // find the last 5 match results in the db and return them
        if(jsonData.PName>""){
            var tableResponse="<table><tr><td>Date</td><td>Score</td></tr>";
            var query = connection.query('SELECT * FROM result WHERE ? ORDER BY Date DESC LIMIT 5',jsonData,function(err, result, fields) {
            //console.log(query.sql);
                if(!err){
                    // returns the user's last match results
                   // console.log(result.length);
                    if(result.length>0){
                        // construct a string suitable for html table
                        // if there are any results
                        for (var r in result) {
                            tableResponse=tableResponse + "<tr><td>"+module.exports.recentness(result[r].Date)+"</td><td>"+result[r].Score+"</td></tr>";
                        }
                        tableResponse=tableResponse + "</table>";
                    // then send that string back to the client
                       socket.emit('stats', tableResponse);
                    }
                    else{
                        socket.emit('stats',"No results found for " + jsonData.PName);
                    }
                }   
                else
                    console.log("Error querying db");
                });
        }
        else{
            socket.emit('stats',"No logged in player");
        }
    },
    recentness: function(aDate){
        // returns a string representing the date in terms of 'recentness'
        // e.g. today hh:mm, yesterday hh:mm, last xday hh:mm, dd MMM hh:mm
        var weekday = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        var todayDate = Date.today();
        var yesterday = Date.today().add(-1).days();
        var lastWeek = Date.today().add(-1).weeks();
        
        var thenDate = new Date(aDate);
        var dateOpts={year: "numeric", month: "short", day:"numeric"};
        
        var gameTime = thenDate.toLocaleTimeString("en-gb",{hour: "numeric", minute: "2-digit"});

      if(thenDate.is().today()){
            return ("Today at " + gameTime);
        }
        else if(thenDate.same().day(yesterday)){
            return ("Yesterday at " + gameTime);
        }
        else if(thenDate>lastWeek){
            return ("Last " + weekday[thenDate.getDay()] + " at " + gameTime);
        }
        
        return (thenDate.toLocaleDateString("en-gb",{month: "short", day: "numeric",hour: "numeric", minute: "2-digit"} ));
        
        // var options = {
        //     weekday: "long", year: "numeric", month: "short",
        //     day: "numeric", hour: "2-digit", minute: "2-digit"
        // };
        
        // document.write(date.toLocaleDateString("en-US"));
        // document.write(date.toLocaleTimeString("en-us", options));
    
    }
// other db functions here
}

