'use strict';
let _ = require('underscore');
var path = require('path');
const fs = require('fs')

module.exports = function(app) {

  /**
   * GENERAR REPORTE DE RUTAS
   */
   app.post('/generate-report', function(req, res) {
     //console.log("generate-report-->", req.body);
     app.models.SysUser.setSaleReport(req.body, (err, report) => {
       if (err) {
         var msg = err? "No hay equipos para generar el reporte de cambaceo" : "No se pudo generar el reporte de rutas, por favor intente más tarde!!!";
         var code = err? '500': '500';
         return res.send(JSON.stringify({code: code, msg: msg}));
       }else {
         return res.send(JSON.stringify({code: '200', msg: "Se genero correctamente el reporte de rutas"}));
       }
     });
   });

   /**
    * DESCARGAR REPORTE DE RUTAS
    */
   app.get('/download-report', function(req, res) {
     var fileLocation = path.join('./report','reporte-de-rutas.xlsx');
     res.download(fileLocation, 'reporte-de-rutas.xlsx', (err) => {
       if (err) {
         console.log("Hubo un error al descargar el archivo", err);
         return
       } else {
         //console.log("El archivo se descargo correctamente!!!");
         removeFile(fileLocation);
       }
     })
   });

   app.get('/cancel-download', function(req, res) {
     var fileLocation = path.join('./report','reporte-de-rutas.xlsx');
     removeFile(fileLocation); //...Eliminar el archivo
     res.send('OK');
   });

   function removeFile(file){
     //console.log("Dirección del archivo a eliminar", file);
     fs.unlink(file, (err) => {
       if (err) {
         console.error("No se pudo eliminar el archivo", err)
         return
       }
       //console.log("El archivo se elimino correctamente!!!");
     })
    }

};
