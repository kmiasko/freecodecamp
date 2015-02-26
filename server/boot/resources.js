var User = require('../../common/models/User'),
    resources = require('../utils/resources'),
    secrets = require('../../config/secrets'),
    passportUtils = require('../../config/passportUtils'),
    Client = require('node-rest-client').Client,
    client = new Client(),
    debug = require('debug')('freecc:cntr:bonfires');

module.exports = function(app) {
  var router = app.loopback.Router();
  router.get('/privacy', privacy);
  router.get('/jquery-exercises', jqueryExercises);
  router.get('/chat', chat);
  router.get('/live-pair-programming', livePairProgramming);
  router.get('/install-screenhero', installScreenHero);
  router.get('/javascript-in-your-inbox', javaScriptInYourInbox);
  router.get('/chromebook', chromebook);
  router.get('/deploy-a-website', deployAWebsite);
  router.get('/gmail-shortcuts', gmailShortcuts);
  router.get('/control-shortcuts', controlShortcuts);
  router.get('/control-shortcuts', deployAWebsite);
  router.get('/stats', function(req, res) {
    res.redirect(301, '/learn-to-code');
  });
  router.get('/learn-to-code', about);
  router.get('/about', function(req, res) {
    res.redirect(301, '/learn-to-code');
  });
  router.get('/api/github', gitHubCalls);
  router.get('/api/blogger', bloggerCalls);
  router.get('/api/trello', trelloCalls);
  //router.get(
  //  '/nonprofit-project-instructions',
  //  passportUtils.isAuthenticated,
  //  nonprofitProjectInstructions
  //);

  function privacy(req, res) {
      res.render('resources/privacy', {
          title: 'Privacy'
      });
  }

  function deployAWebsite(req, res) {
      res.render('resources/deploy-a-website', {
          title: 'Deploy a Dynamic Website in 7 Minutes'
      });
  }

  function chat(req, res) {
      res.render('resources/chat', {
          title: "Enter Free Code Camp's Chat Rooms"
      });
  }

  function nonprofitProjectInstructions(req, res) {
      res.render('resources/nonprofit-project-instructions', {
          title: 'Nonprofit Project Instructions'
      });
  }

  function gmailShortcuts(req, res) {
      res.render('resources/gmail-shortcuts', {
          title: 'These Gmail Shortcuts will save you Hours'
      });
  }

  function controlShortcuts(req, res) {
      res.render('resources/control-shortcuts', {
          title: 'These Control Shortcuts will save you Hours'
      });
  }

  function chromebook(req, res) {
      res.render('resources/chromebook', {
          title: 'Win a Chromebook'
      });
  }

  function jqueryExercises(req, res) {
      res.render('resources/jquery-exercises', {
          title: 'jQuery Exercises'
      });
  }

  function livePairProgramming(req, res) {
      res.render('resources/live-pair-programming', {
          title: 'Live Pair Programming'
      });
  }

  function installScreenHero(req, res) {
      res.render('resources/install-screenhero', {
          title: 'Install ScreenHero'
      });
  }

  function javaScriptInYourInbox(req, res) {
      res.render('resources/javascript-in-your-inbox', {
          title: 'JavaScript in your Inbox'
      });
  }
  function gitHubCalls(req, res) {
      var githubHeaders = {headers: {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/29.0.1521.3 Safari/537.36'}, port:80 };
      client.get('https://api.github.com/repos/freecodecamp/freecodecamp/pulls?client_id=' + secrets.github.clientID + '&client_secret=' + secrets.github.clientSecret, githubHeaders, function(pulls, res3) {
          pulls = pulls ? Object.keys(JSON.parse(pulls)).length : "Can't connect to github";
          client.get('https://api.github.com/repos/freecodecamp/freecodecamp/issues?client_id=' + secrets.github.clientID + '&client_secret=' + secrets.github.clientSecret, githubHeaders, function (issues, res4) {
              issues = ((pulls === parseInt(pulls)) && issues) ? Object.keys(JSON.parse(issues)).length - pulls : "Can't connect to GitHub";
              res.send({"issues": issues, "pulls" : pulls});
          });
      });
  }
  function trelloCalls(req, res) {
      client.get('https://trello.com/1/boards/BA3xVpz9/cards?key=' + secrets.trello.key, function(trello, res2) {
          trello = trello ? (JSON.parse(trello)).length : "Can't connect to to Trello";
          res.send({"trello": trello});
      });
  }
  function bloggerCalls(req, res) {
      client.get('https://www.googleapis.com/blogger/v3/blogs/2421288658305323950/posts?key=' + secrets.blogger.key, function (blog, res5) {
          var blog = blog.length > 100 ? JSON.parse(blog) : "";
          res.send({
              blog1Title: blog ? blog["items"][0]["title"] : "Can't connect to Blogger",
              blog1Link: blog ? blog["items"][0]["url"] : "http://blog.freecodecamp.com",
              blog2Title: blog ? blog["items"][1]["title"] : "Can't connect to Blogger",
              blog2Link: blog ? blog["items"][1]["url"] : "http://blog.freecodecamp.com",
              blog3Title: blog ? blog["items"][2]["title"] : "Can't connect to Blogger",
              blog3Link: blog ? blog["items"][2]["url"] : "http://blog.freecodecamp.com",
              blog4Title: blog ? blog["items"][3]["title"] : "Can't connect to Blogger",
              blog4Link: blog ? blog["items"][3]["url"] : "http://blog.freecodecamp.com",
              blog5Title: blog ? blog["items"][4]["title"] : "Can't connect to Blogger",
              blog5Link: blog ? blog["items"][4]["url"] : "http://blog.freecodecamp.com"
          });
      });
  }

  function about(req, res) {
      var date1 = new Date("10/15/2014");
      var date2 = new Date();
      var progressTimestamps = req.user.progressTimestamps;
      var now = Date.now() / 1000 | 0;
      if (req.user.pointsNeedMigration) {
          var challengesHash = req.user.challengesHash;
          for(var key in challengesHash) {
              if (challengesHash[key] > 0) {
                  req.user.progressTimestamps.push(challengesHash[key]);
              }
          }
          req.user.pointsNeedMigration = false;
          req.user.save();
      }
      if (progressTimestamps[progressTimestamps.length - 1] <= (now - 43200)) {
          req.user.progressTimestamps.push(now);
      }
      var timeDiff = Math.abs(date2.getTime() - date1.getTime());
      var daysRunning = Math.ceil(timeDiff / (1000 * 3600 * 24));
      var announcements = resources.announcements;
      User.count({}, function (err, c3) {
          if (err) {
              debug('User err: ', err);
              next(err);
          }
          User.count({'points': {'$gt': 53}}, function (err, all) {
              if (err) {
                  debug('User err: ', err);
                  next(err);
              }
              res.render('resources/learn-to-code', {
                  title: 'About Free Code Camp and Our Team of Volunteers',
                  daysRunning: daysRunning,
                  c3: c3,
                  all: all,
                  announcements: announcements
              });
          });
      });
  }

  app.use(router);
};