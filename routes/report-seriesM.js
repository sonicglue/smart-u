'use strict';
// NodeJs Modules
let fs = require('fs');
let path = require('path');

module.exports = function(app) {
  /**
   * GENERAR REPORTE DE RUTAS
   */
  app.post('/generate-report-seriesM', function(req, res) {
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
  });

  /**
   * GENERAR REPORTE DE GARANTÍAS
   */
  app.post('/generate-report-guarantee', function(req, res) {
    // console.log('generate-report-->', req.body);
    app.models.Guarantee.setReportGuarantee(req.body, (err, report) => {
      if (err) {
        let msg = err.details;
        let code = err.status;
        return res.send({code: code, msg: msg});
      } else {
        return res.send({code: 200,
          msg: 'Se genero correctamente el reporte de series'});
      }
    });
  });
  /**
   * DESCARGAR REPORTE DE RUTAS
   */
  app.get('/download-report-seriesM', function(req, res) {
    let fileLocation = path.join('./report', 'reporte-de-series.xlsx');
    res.download(fileLocation, 'reporte-de-series.xlsx', err => {
      if (err) {
        return console.log('Hubo un error al descargar el archivo', err);
      } else {
        // console.log('El archivo se descargo correctamente!!!');
        removeFile(fileLocation);
      }
    });
  });
  /**
   * CANCELAR LA DESCARGA DEL REPORTE
   */
  app.get('/cancel-download', function(req, res) {
    let fileLocation = path.join('./report', 'reporte-de-series.xlsx');
    removeFile(fileLocation); // ...Eliminar el archivo
    res.send('OK');
  });
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
   * GENERAR REPORTE DE VENTAS
   */
  app.post('/generate-report-sales', (req, res) => {
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
  });
  /**
   * DESCARGAR REPORTE DE RUTAS
   */
  app.get('/download-report-sales', function(req, res) {
    let fileLocation = path.join('./report', 'reporte-de-ventas.xlsx');
    res.download(fileLocation, 'reporte-de-ventas.xlsx', err => {
      if (err) {
        return console.log('Hubo un error al descargar el archivo', err);
      } else {
        // console.log('El archivo se descargo correctamente!!!');
        removeFile(fileLocation);
      }
    });
  });//
};
