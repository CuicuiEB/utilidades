const token = 'token';
var id = 'put the id here';
var seconds = 60;
const Bearer_token = 'put your token here';
const chat_id ='put your Telegram chat id here';

const bot = new TelegramBot(token, { polling: true });
const TelegramBot = require('node-telegram-bot-api');
var first = 1;
var request = require('request');
const fs = require('fs');

var options = {
    'method': 'GET',
    'url': 'https://api.twitter.com/2/users/' + id + '/liked_tweets',
    'headers': {
        'Authorization': 'Bearer ' + Bearer_token
    }
};

var lastID = '0';

// get the first tweet and store it in memory
request(options, function(error, response) {
    if (error) throw new Error(error);
    var obj = JSON.parse(response.body);

    fs.readFile('latest.txt', (err, data) => {
        if (err) {
            lastID = obj.data[1]['id'];
            throw err;
        }
        lastID = data;
        if (lastID == '1') lastID = obj.data[1]['id'];
    });

});

function find_new_liked_tweets() {
  
    request(options, function(error, response) {
        if (error) throw new Error(error);

        var obj = JSON.parse(response.body);
        var count = -1;
        var isPhoto = 0;
        // find how much tweet should update
        for (let i = 0; i < obj.data.length; i++) {

            if ((lastID === obj.data[i]['id'])) {
                count = i;
                break;
            }
        }

        if (count == -1) count = 1;

        if (count > 0) {
            for (let j = count - 1; j >= 0; j--) {

                if (first <= 0) {
                    var url = 'https://platform.twitter.com/embed/index.html?dnt=false&embedId=twitter-widget-0&frame=true&hideCard=false&hideThread=true&id=' + obj.data[j]['id'] + '&lang=en&theme=dark&widgetsVersion=ed20a2b%3A1601588405575';
                    const Pageres = require('pageres');
                    (async () => {
                        await new Pageres({ delay: 1 })
                            .src(url, ['iphone 5s'], { crop: true, transparent: true, darkMode: true, filename: obj.data[j]['id'] })
                            .dest('')
                            .run();
                        bot.sendPhoto(chat_id, obj.data[j]['id'] + '.png', { caption: obj.data[j]['text'] });
                        function deletephoto() {
                            fs.unlinkSync(obj.data[j]['id'] + '.png');
                        }
                        setTimeout(deletephoto, 20000);

                    })();
                }
                lastID = obj.data[j]['id'];
            }
            first = 0;
            fs.writeFile('latest.txt', lastID, (err) => {
                if (err)
                    throw err;
            });
        }
    });
};
setInterval(find_new_liked_tweets, seconds * 1000);
