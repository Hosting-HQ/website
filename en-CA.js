module.exports = {
    async start() {

let express = require('express');
let bodyParser = require('body-parser');
let multer = require('multer');
let upload = multer();
let app = express();
let responseTime = require('response-time')
let favicon = require('serve-favicon')
let path = require('path')
let chalk = require('chalk')
let rateLimit = require("express-rate-limit");
const Keyv = require('keyv')
const bcrypt = require('bcrypt')

// Databases


console.log(chalk.green('CA Online'))

let limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 50,
  skip: (req, res) => {
     if (req.path.includes('/assets/')) {
       return true;
    } else {
      return false;
    } 
},
  handler: function(req, res) {
    res.status(429).render('errors/429', {
      result: "RATELIMITED", 
      message: "Too many requests, please try again later",
  })}});
 
//  apply to all requests
app.use(limiter);

/*     
app.get('/', async function(req, res){
   res.render('form');
   })
*/
global.maintenance = false

app.set('view engine', 'ejs');
app.set('views', 'views')
// for setting the site favicon
app.use(favicon(path.join(__dirname, 'public', '/assets/icons/favicon.ico')))

// for parsing application/json
app.use(bodyParser.json()); 

// for recording server response time
app.use(responseTime())

// for parsing application/xwww-
app.use(bodyParser.urlencoded({ extended: true })); 
//form-urlencoded

// for parsing multipart/form-data
app.use(upload.array()); 
app.use(express.static('public'));

app.listen(10425);

app.get('/', limiter, async function(req, res){
   if (maintenance === true) {
       res.status(200).render('lang/en-CA/errors/503')
   } else {
   res.status(200).render('lang/en-CA/home');
   }
   })

app.get('/careers', limiter, async function(req, res){
   if (maintenance === true) {
       res.status(200).render('lang/en-CA/errors/503')
   } else {
   res.status(200).render('lang/en-CA/careers/index');
   }
   })
app.get('/careers/apply', limiter, async function(req, res){
   if (maintenance === true) {
       res.status(200).render('lang/en-CA/errors/503')
   } else {
   res.status(200).render('lang/en-CA/careers/apply');
   }
   })

app.get('/myip', limiter, async function(req, res){
    
let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
let sanitizedIP = ip.replace('::ffff:', '')

   res.status(200).send(sanitizedIP);
   })
 
app.post('/careers/submitted', async (req, res) => {
    
let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
let sanitizedIP = ip.replace('::ffff:', '')

let name = req.body.name
let birthday = req.body.birthday
let email = req.body.email
let discord = req.body.discord
let twitter = req.body.twitter
let position = req.body.position
let experience = req.body.experience

if (req.body.discord.length < 1 || req.body.discord == null) {
    discord = 'Not Provided'
}
if (req.body.twitter.length < 1 || req.body.twitter == null) {
    twitter = 'Not Provided'
}
    
let embed = new Discord.MessageEmbed()
	.setTitle('Job Application')
	.addField('Name', name, true)
	.addField('Birthday', birthday)
	.addField('Email', email)
	.addField('Discord', discord)
	.addField('Twitter', twitter, true)
	.addField('Position', position)
	.addField('experience', experience)
	.addField('\u200B', '\u200B')
	.addField('ref:', 'en-CA')
	.setTimestamp()
	.setFooter(sanitizedIP)

await form_client.channels.cache.get('831603820609798215').send(embed)
    
res.status(200).redirect('https://ca.hostinghq.xyz/')
})

// Sudo view error pages
app.get('/sudo/404', limiter, async function(req, res){
   res.status(200).render('lang/en-CA/errors/404');
   })
app.get('/sudo/403', limiter, async function(req, res){
   res.status(200).render('lang/en-CA/errors/403');
   })
app.get('/sudo/401', limiter, async function(req, res){
   res.status(200).render('lang/en-CA/errors/401');
   })
app.get('/sudo/429', limiter, async function(req, res){
   res.status(200).render('lang/en-CA/errors/429');
   })
app.get('/sudo/500', limiter, async function(req, res){
   res.status(200).render('lang/en-CA/errors/500');
   })
app.get('/sudo/503', limiter, async function(req, res){
   res.status(200).render('lang/en-CA/errors/503');
   })

// Legal Pages
app.get('/terms', limiter, async function(req, res){
    res.status(200).render('lang/en-CA/legal/terms')
})
app.get('/disclaimer', limiter, async function(req, res){
    res.status(200).render('lang/en-CA/legal/disclaimer')
})
app.get('/refunds', limiter, async function(req, res){
    res.status(200).render('lang/en-CA/legal/refunds')
})
app.get('/privacy', limiter, async function(req, res){
    res.status(200).render('lang/en-CA/legal/privacy')
})
app.get('/cookies', limiter, async function(req, res){
    res.status(200).render('lang/en-CA/legal/cookies')
})

// Redirects
app.get('/contact/ccpa', limiter, async function(req, res){
    res.status(200).redirect('https://members.hostinghq.xyz/submitticket.php?step=2&deptid=6&subject=CCPA')
})
app.get('/contact/gdpr', limiter, async function(req, res){
    res.status(200).redirect('https://members.hostinghq.xyz/submitticket.php?step=2&deptid=6&subject=GDPR')
})

// Must Be Kept At BOTTOM, Above Middlewares
app.get('*', limiter, async function(req, res){
    res.status(404).render('lang/en-CA/errors/404')
})

app.use(function(err, req, res, next) {
   console.log(err.stack)
   res.status(500).render('lang/en-CA/errors/500')
});
        
    }}
