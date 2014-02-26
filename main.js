var vcapApp = JSON.parse(process.env.VCAP_APPLICATION)

var port = (process.env.VCAP_APP_PORT || 8192);
var host = (process.env.VCAP_APP_HOST || 'localhost');
var url = 'localhost';
if (process.env.VCAP_APP_PORT) {
	url = vcapApp.uris[0];
}

var express = require('express');
var passport = require('passport');
var app = express();
app.use(express.static(__dirname + '/static'));
app.use(express.bodyParser());
//app.use(express.json());
app.use(express.cookieParser());
app.use(express.session({ secret: "somesecretmagicword" }));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

var LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;

passport.use(new LinkedInStrategy({
          clientID: '77f46jpc6ozulf',
          clientSecret: 'FGPzUIrXswZfcmSb',
          callbackURL: 'http://' + url + '/auth/linkedin/callback',
          scope: ['r_emailaddress', 'r_basicprofile'],
    	  passReqToCallback: true
        }, function(req, accessToken, refreshToken, profile, done) {
            process.nextTick(function () {
              return done(null, profile);
            });
            }
        ));

app.get('/auth/linkedin',
    passport.authenticate('linkedin', { state: 'SOME STATE'  }),
	function(req, res) {
});


app.get('/auth/linkedin/callback', passport.authenticate('linkedin', {
   successRedirect: '/hello',
   failureRedirect: '/auth/linkedin'
}));        

app.post('/log', function(req, res) {
	console.log(req.body)
});

app.get('/hello',function(req, res) {
  res.send('Hello World\n');
}).listen(port, host);

