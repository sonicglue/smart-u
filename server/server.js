'use strict';

var loopback = require('loopback');
var boot = require('loopback-boot');
let bodyParser = require('body-parser');

var app = module.exports = loopback();
// Rutas que serán ignoradas por AngularJS
let ignoredPaths = ['/api', '/assets', '/explorer'];
//
let path = require('path');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

/**
 * @name startsWith
 * @description Recibe una cadena de texto y evalua si la ruta inicia con alguno
 * de los valores en el arreglo
 * @param {String} string Cadena de texto de tipo URL
 * @param {Array} array Arreglo con valores a buscar
 */
function startsWith(string, array) {
  for (let i = 0; i < array.length; i++)
    if (string.startsWith(array[i]))
      return true;
  return false;
};

// Ruta generar reporte de rutas
// require('../routes/report-routes')(app);
// require('../routes/report-seriesM')(app);
// require('../routes/reports')(app);

// Define el directorio para los archivos estaticos
app.use(loopback.static(path.resolve(__dirname, '../client')));
// Loopback filtrará las rutas para atender sólo algunas de ellas
app.all('/*', (req, res, next) => {
  // Redirecting to index only the requests that do not start with ignored paths
  if (!startsWith(req.url, ignoredPaths)) {
    let file = {
      root: path.resolve(__dirname, '../', 'client')};
    res.sendFile('index.html', file);
  } else {
    next();
  }
});

app.start = function() {
  // start the web server
  return app.listen(function() {
    app.emit('started');
    var baseUrl = app.get('url').replace(/\/$/, '');
    console.log('Web server listening at: %s', baseUrl);
    if (app.get('loopback-component-explorer')) {
      var explorerPath = app.get('loopback-component-explorer').mountPath;
      console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
    }
  });
};
// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function(err) {
  if (err) throw err;

  // start the server if `$ node server.js`
  if (require.main === module)
    app.start();
});
