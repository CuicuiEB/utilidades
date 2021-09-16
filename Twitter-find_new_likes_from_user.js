var id='ID';
var TOKEN='';


var first=1;//no sé pero lo tuve que hacer asi
var request = require('request');
const fs = require('fs');
var options = {
  'method': 'GET',
  'url': 'https://api.twitter.com/2/users/'+ id + '/liked_tweets',
  'headers': {
    'Authorization': 'Bearer ' + TOKEN;
  }
};

var lastID = '0';
var seconds = 10;

// get the first tweet and store it in memory
request(options, function (error, response) {
    if (error) throw new Error(error);
    var obj = JSON.parse(response.body);
    
    fs.readFile('latest.txt', (err, data) => {
      if (err){
        lastID=obj.data[10]['id'];
        throw err;
      }
      lastID=data;
      if (lastID =='1' ) lastID=obj.data[10]['id'];
    });

 });

function find_new_liked_tweets(){
  
  console.log("checking..");
  request(options, function (error, response) {
    if (error) throw new Error(error);

    var obj = JSON.parse(response.body);
    var count=-1;

    // find how much tweet should update
    for (let i = 0; i < obj.data.length ; i++) {
     
      if ((lastID === obj.data[i]['id'])){
        count=i;
        break;
      }
    }
    
    if (count == -1) count=5;

    // print all new tweets
    if (count > 0 ){
      for (let j = count-1; j >= 0 ; j--) {

        if (first <= 0){
          console.log("New --> " + obj.data[j]['text']);
        }
        lastID=obj.data[j]['id'];
      }

      first=0;

      fs.writeFile('latest.txt', lastID , (err) => {
        if (err)
          throw err;
      });
    }
  });

};

// interval of X seconds
setInterval(find_new_liked_tweets, seconds * 1000);
