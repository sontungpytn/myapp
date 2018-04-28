var express = require('express');
var router = express.Router();
const Nightmare = require('nightmare')


var anticaptcha = require('../utils/anticaptcha')('2e6615d7a2a7bdfd5b598b5f2113199f')
anticaptcha.setWebsiteURL("https://accounts.spotify.com/vi-VN/login?continue=https:%2F%2Fwww.spotify.com%2Fvn-vi%2Faccount%2Foverview%2F");
anticaptcha.setWebsiteKey("6LeIZkQUAAAAANoHuYD1qz5bV_ANGCJ7n7OAW3mo");

anticaptcha.setProxyType("http");
anticaptcha.setProxyAddress("8.8.8.8");
anticaptcha.setProxyPort(80);
// anticaptcha.setProxyLogin("proxylogin");
// anticaptcha.setProxyPassword("proxypassword");

//browser header parameters
anticaptcha.setUserAgent("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.116");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/test', function(req, res, next) {
  //res.render('index', { title: 'Express' });
  const nightmare = Nightmare({
    show: true,
    waitTimeout: 10000
  })
  nightmare
    .goto('https://accounts.spotify.com/vi-VN/login?continue=https:%2F%2Fwww.spotify.com%2Fvn-vi%2Faccount%2Foverview%2F')
    .insert('#login-username', 'fawn9bgqdoran@hotmail.com')
    .insert('#login-password', 'Duonglove92@#')
    .click('#login-button')
    .wait('#submenu-item-account-overview')
    .evaluate(() => document.querySelector('#submenu-item-account-overview a').href)
    .end()
    .then(
      console.log
    )
    .catch(error => {
      console.error('Nightmare error:', error)

      anticaptcha.getBalance(function (err, balance) {
        if (err) {
          console.error('getBalance err:');
          console.error(err);
          return;
        }

        if (balance > 0) {
          anticaptcha.createTask(function (err, taskId) {
            if (err) {
              console.error('createTask err:');
              console.error(err);
              return;
            }

            console.log(taskId);

            anticaptcha.getTaskSolution(taskId, function (err, taskSolution) {
              if (err) {
                console.error('getTaskSolution err:');
                console.error(err);
                return;
              }

              console.log(taskSolution);
            });
          });
        } else {
          console.log('balance <0')
        }
      });

    })
  res.render('index', { title: 'Express' });
});


module.exports = router;
