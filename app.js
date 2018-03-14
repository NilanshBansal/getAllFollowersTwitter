let Twit = require('twit');
let fs = require('fs');
let papa = require('papaparse');

let appConfig = new Twit({
  consumer_key: 'LVl3EHXauDdkLDGyfgDa4vYz3',
  consumer_secret: 'Kys99qPKA7asIVI8amnBIf6OhMzepDbi5Cxq6Qzz1yUWo9CD3P',
  access_token: '827079258300375040-BVujJthY7aLIVzFKtloaaqUbhvLlhGx',
  access_token_secret: '	H63wa6yxN5vfqo8PrntM1r9NQLblP9ChVJdQBr9tgfcGy',
  app_only_auth: true,
  // timeout_ms: 60 * 1000,  // optional HTTP request timeout to apply to all requests. 
})

let nextCursor = -1;
let remaining;
let timestamp;
let curTimestamp;
function bringFollowers() {
  appConfig.get('/followers/list', { cursor: nextCursor, screen_name: 'rajesh664', count: 200, skip_status: true, include_user_entities: false }, function (err, data, res) {
    remaining = res.caseless.dict['x-rate-limit-remaining'];
    timestamp = res.caseless.dict['x-rate-limit-reset'];
    // console.log(remaining);
    // console.log(res.caseless.dict['x-rate-limit-limit']);
    // console.log(timestamp);
    if (data.users) {
      nextCursor = data.next_cursor;
      let csvData = papa.unparse({
        fields: ["name", "screen_name", "followers_count", "friends_count"],
        data: data.users,
      },
        {
          header: !fs.existsSync("followers.csv")
        }
      );

      fs.appendFileSync('followers.csv', csvData + '\n');
    }
    
    if (nextCursor != 0) {
      if (remaining > 20) 
        bringFollowers();
      else 
        setTimeout(bringFollowers, (timestamp * 1000) - new Date().getTime());
    }
  });
}

bringFollowers();

