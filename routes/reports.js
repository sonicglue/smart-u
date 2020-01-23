'use strict';
// NodeJs modules
let _ = require('underscore');
let fs = require('fs');
let path = require('path');

module.exports = function(app) {
  /**
   * @name removeFile
   * @description Elimina el reporte una vez que fue descargado.
   * @param {string} file Ubicación del archivo para su descarga.
   */
  function removeFile(file) {
    // console.log('Dirección del archivo a eliminar', file);
    fs.unlink(file, (err) => {
      if (err) {
        return console.error('No se pudo eliminar el archivo', err);
      }
      // console.log('El archivo se elimino correctamente!!!');
    });
  }// End removeFile
  /**
   * Método de descargas
   */
  app.get('/download/:name', (req, res) => {
    let fileName = `${req.params.name}.xlsx`;
    let fileLocation = path.join('./report', fileName);
    res.download(fileLocation, fileName, err => {
      if (err) {
        // ...error
        return console.log('Hubo un error al descargar el archivo.', err);
      } else {
        // ...eliminar archivo
        removeFile(fileLocation);
      }
    });
  });// End
  /**
   * Método de cancelación
   */
  app.get('/download-cancel/:name', function(req, res) {
    let fileName = `${req.params.name}.xlsx`;
    var fileLocation = path.join('./report', fileName);
    removeFile(fileLocation);
    res.send('OK');
  });// End
  /**
   * GENERACIÓN DE REPORTES
   */
  // Reporte de garantías
  app.post('/guarantee-report', function(req, res) {
    app.models.Guarantee.makeReport(req.body, (err, report) => {
      if (err) {
        let msg = err.details;
        let code = err.status;
        return res.send({code: code, msg: msg});
      } else {
        return res.send({code: 200,
          msg: 'Se genero correctamente el reporte de series'});
      }
    });
  });// End
  // Rerporte de series
  app.post('/series-report', function(req, res) {
    // console.log('generate-report-->', req.body);
    app.models.Stock.setReportSeries(req.body, (err, report) => {
      if (err) {
        let msg = err.details;
        let code = err.status;
        return res.send({code: code, msg: msg});
      } else {
        return res.send({code: 200,
          msg: 'Se genero correctamente el reporte de series'});
      }
    });
  });// End
  // Reporte de ventas
  app.post('/sales-report', (req, res) => {
    app.models.Stock.setReportSale(req.body, (err, report) => {
      if (err) {
        let msg = err.details;
        let code = err.status;
        return res.send({code: code, msg: msg});
      } else {
        return res.send({code: 200,
          msg: 'Se genero correctamente el reporte de series'});
      }
    });
  });// End
  // Reporte de rutas
  app.post('/routes-report', (req, res) => {
    app.models.Stock.setReportRoutes(req.body, (err, report) => {
      if (err) {
        let msg = err.details;
        let code = err.status;
        return res.send({code: code, msg: msg});
      } else {
        return res.send({code: 200,
          msg: 'Se genero correctamente el reporte de rutas'});
      }
    });
  });// End
};
