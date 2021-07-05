module.exports = {
    async start() {
let express = require('express');
let app = express();
let responseTime = require('response-time')
let favicon = require('serve-favicon')
let path = require('path')
let chalk = require('chalk')

console.log(chalk.green('Server Online'))


// Turn maintenance on or off to allow editing the site 
// without causing an internal server error
let maintenance = false

// Set the view engine to allow rendering ejs files
app.set('view engine', 'ejs');
app.set('views', 'views')

// for setting the site favicon
app.use(favicon(path.join(__dirname, 'public', '/pathtoyourfavicon')))

// for recording server response time
app.use(responseTime())

// for rendering public files
app.use(express.static('public'));

// The port for your site to listen on
app.listen(3000);

app.get('/', async function(req, res){
   if (maintenance === true) {
       res.status(200).render('errors/503')
   } else {
   res.status(200).render('home');
   }
   })

// Return 404 for all not-found directories
// Must Be Kept At BOTTOM, Above Middlewares
app.get('*', async function(req, res){
    res.status(404).render('errors/404')
})

// Error catching middleware
app.use(function(err, req, res, next) {
   console.log(err.stack)
   res.status(500).render('errors/500')
});
    }}
