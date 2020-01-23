'use strict';
let _ = require('underscore');
let async = require('async');
let moment = require('moment');
var fs = require("fs");
var soap = require('strong-soap').soap;
var xml2js = require('xml2js');
var parser = new xml2js.Parser();

module.exports = function(Invoice) {
  /**
   * @name buildLetterPorteXML
   * @description Método para generar la cadena xml de la carta porte.
   * @param {object} stock Objeto de arreglo con todos los productos.
   * @param {String} seller Nombre del ejecutivo
   * @return {callback} callback
   */
  Invoice.buildLetterPorteXML = function(stock, seller, cb) {
    //console.log("Recibiendo datos desde ---> buildLetterPorteXML (Lista de equipos)", stock);
    var cadena = ""; //Cadena con los datos de la carta porte
    let importConcept = 0; //Variable que va ir sumando el importe de cada concepto

    //PARTIDAS / CONCEPTOS DEL COMPROBANTE:
    cadena += "NumeroDePartidas=";
    cadena += stock.length + "\n";

    _.each(stock, function(prod, index) {
      let idx = index + 1;
      cadena += "Concepto_"+ idx +"_Cantidad=";
      cadena += prod.stocks.length + "\n";
      cadena += "Concepto_"+ idx +"_Unidad=";
      cadena += "PZA" + "\n";
      cadena += "Concepto_"+ idx +"_UnidadSAT=";
      cadena += "H87" + "\n";
      cadena += "Concepto_"+ idx +"_UnidadSATD=";
      cadena += "Pieza" + "\n";
      cadena += "Concepto_"+ idx +"_ClaveSAT=";
      cadena += "43191500" + "\n";
      cadena += "Concepto_"+ idx +"_ClaveSATD="; //Tengo duda sobre éste campo
      cadena += "Universidad" + "\n";

      let calculatedNeto = (prod.publicPrice).toFixed(2); //El precio del producto más el IVA (16%)
          importConcept = calculatedNeto * prod.stocks.length; //Calcular el subtotal de cada concepto con IVA

      cadena += "Concepto_"+ idx +"_NoIdentificacion=";
      cadena += prod.name + "\n";
      cadena += "Concepto_"+ idx +"_Descripcion=";
      cadena += prod.name +" "+ "IMEI" +" "+ prod.stocks.join("  ") + "\n";
      cadena += "Concepto_"+ idx +"_ValorUnitario=";
      cadena += calculatedNeto + "\n";
      cadena += "Concepto_"+ idx +"_Importe=";
      cadena += (importConcept).toFixed(2) + "\n";

      cadena += "Concepto_"+ idx +"_Num_Impuestos_Tras=";
      cadena += "0" + "\n";
      cadena += "Concepto_"+ idx +"_Num_Impuestos_Ret=";
      cadena += "0" + "\n";

      //Impuesto Trasladado # 1 del Concepto # 1
      cadena += "Concepto_"+ idx +"_Imp_Tras_1_Base=";
      cadena += "0.00"  + "\n";
      cadena += "Concepto_"+ idx +"_Imp_Tras_1_Impuesto=";
      cadena += "002" + "\n";
      cadena += "Concepto_"+ idx +"_Imp_Tras_1_TipoFactor=";
      cadena += "Tasa" + "\n";
      cadena += "Concepto_"+ idx +"_Imp_Tras_1_TasaOCuota=";
      cadena += "0.00" + "\n";
      cadena += "Concepto_"+ idx +"_Imp_Tras_1_Importe=";
      cadena += "0.00" + "\n";
    });

    //INFORMACIÓN GENERAL DEL COMPROBANTE:
    cadena += "AmbienteDePruebas=NO" + "\n";
    cadena += "TipoDeComprobante=";
    cadena += "Traslado" + "\n";
    cadena += "TipoDeFormato=";
    cadena += "CartaPorte" + "\n";
    //LAS OBSERVACIONES EXTRA DEL DOCUMENTO
    cadena += "Observaciones_1=";
    cadena += seller + "\n";
    cadena += "Serie=";
    cadena += "CP" + "\n";
    cadena += "FormaDePago=";
    cadena +=  "" + "\n";
    cadena += "CondicionesDePago=";
    cadena += "" + "\n";
    cadena += "MetodoDePago=";
    cadena += "" + "\n";
    cadena += "LugarExpedicion=";
    cadena += "11520" + "\n";
    cadena += "SubTotal=";
    cadena += "0.00"  + "\n";
    cadena += "Total=";
    cadena += "0.00" + "\n";
    cadena += "Moneda=";
    cadena += "MXN" + "\n";
    cadena += "RegimenEmisor=";
    cadena += "601" + "\n";

    //DATOS DEL CLIENTE / PROVEEDOR QUE RECIBE EL COMPROBANTE:
    cadena += "UsoCFDI=";
    cadena += "P01" + "\n";
    cadena += "RFCReceptor=";
    cadena += "XAXX010101000"+ "\n";
    cadena += "NombreReceptor=";
    cadena += "PUBLICO EN GENERAL" + "\n";
    cadena += "Pais=";
    cadena += "México" + "\n";
    cadena += "Estado=";
    cadena += "CIUDAD DE MEXICO" + "\n";
    cadena += "Localidad=";
    cadena += "México" + "\n";
    cadena += "Municipio=";
    cadena += "MIGUEL HIDALGO" + "\n";
    cadena += "Colonia=";
    cadena += "ANZUREZ" + "\n";
    cadena += "Calle=";
    cadena += "HALLEY" + "\n";
    cadena += "NoExterior=";
    cadena += "37" + "\n";
    cadena += "CodigoPostal=";
    cadena += "11520" + "\n";
    cadena += "Referencia=";
    cadena += "AV. THIERS Y AV.EJERCITO NACIONAL" + "\n";

    //NODO TOTALES DE IMPUESTOS DEL COMPROBANTE:
    cadena += "TotalDeImpuestosTrasladados=";
    cadena += "0.00" + "\n";
    cadena += "Num_TotalImpuestosTrasladados=";
    cadena += "0" + "\n";
    cadena += "ImpuestosTrasladado1_Tasa=";
    cadena += "0.00" + "\n";
    cadena += "ImpuestosTrasladado1_Importe=";
    cadena += "0.00" + "\n";
    cadena += "ImpuestosTrasladado1_TipoFactor=";
    cadena += "Tasa" + "\n";
    cadena += "ImpuestosTrasladado1_Impuesto=";
    cadena += "002" + "\n";
    return { cadena: cadena};
  };


  /**
   * @name generateLetter
   * @description Método remoto para generar la carta porte.
   * @param {object} data Objeto de arreglo con todos los productos.
   * @return {callback} callback
   */
  Invoice.generateLetter = (data,cb) => {
    //console.log("Generar carta porte desde el back-end", data);

    //... Validar que el tipo de dato sea objeto
    if (typeof data !== 'object') {
      return done(Stock.app.newError(422,
        'Tipo de dato invalido, se esperaba un objeto.'));
    }
    //... Validar que tenga productos
    if (!data.items || data.items.length <= 0) {
      return done(Stock.app.newError(422,
        'Arreglo vacío, sin datos de los productos.'));
    }

    //Generar la cadena para la carta porte
    var letterXMLObject = Invoice.buildLetterPorteXML(data.items, data.seller);
    var letterXML = letterXMLObject.cadena;

    //Autenticarse con el Web Service Factura Fiel y mandarle los datos para la carta porte
    Invoice.signInvoice(letterXML, data.items, function(err, response) {
      if (err) return cb(err);
      cb(null, response);
    });

  }

  /**
   * @name signInvoice
   * @description Método para autenticarse con el Web Service de Factura Fiel.
   * @param {string} letterXML Arreglo de string de la carta porte.
   * @param {object} stock Arreglo de objetos de productos
   * @return {callback} callback
   */
  Invoice.signInvoice = function(letterXML, stock, cb) {
    let ffConfig = Invoice.app.get("ff");
    let InvoiceHasItem = Invoice.app.models.InvoiceHasItem;
    let Product = Invoice.app.models.Product;
    let cc = Invoice.app.commonCallback;

    //La cadena que vamos a enviar debe ser de esta forma: RFC_Emisor ~ API_Key ~ Datos
    var cadena_Enviada = ffConfig.generate.RFC_Emisor +"~"+ ffConfig.generate.ApiKey +"~"+ letterXML;

    //Creamos el cliente para conectarse al Web service de factura fiel
    soap.createClient(ffConfig.generate.url, function(err, client) {
        if (err) return cb(err);

        var args = { xml: (new Buffer(cadena_Enviada)).toString() };

        client.servicio_timbrado(args, function(err, result, envelope, soapHeader) {

          let respuesta = JSON.stringify(result);
          let substr = JSON.stringify(result.return.$value);
          let substr2 = substr.substring(1, 6);
          let folio;

          if (err) return done(err);

          if (substr2 !== "Error") {
            //console.log("Timbrado exitoso", result.return.$value);

            parser.parseString(result.return.$value, function(err, result) {
              //console.log("conversión a parseString", result);

              const jsonString = JSON.stringify(result['cfdi:Comprobante']['cfdi:Complemento'], null, 2); // this is a string
              const object = JSON.parse(jsonString); // we convert it to an object
              //console.log("object", object);

              const timbre = JSON.stringify(object, ['tfd:TimbreFiscalDigital', '$', 'UUID']);
              //console.log("timbre", timbre);

              const data = JSON.parse(timbre);
              //console.log("data", JSON.stringify(data, ['tfd:TimbreFiscalDigital']['$']));

              //...Folio de la carta porte
              folio = `${'CP'}+${result['cfdi:Comprobante']['$']['Folio']}`
              //console.log("Folio de la factura", folio);

              //...Complemento de la carta porte
              let complemento = JSON.stringify(result['cfdi:Comprobante']['cfdi:Complemento']); //Datos del complemento
              //console.log("Datos del complemento", complemento);

              //...Emisor de la carta porte
              let emisor = JSON.stringify(result['cfdi:Comprobante']['cfdi:Emisor']); //Datos del emisor
              //console.log("Datos del emisor", emisor);

              //...Conceptos de la carta porte
              let conceptos = JSON.stringify(result['cfdi:Comprobante']['cfdi:Conceptos']); //Datos del concepto
              //console.log("Datos del concepto", conceptos);

              //Generar el pdf
              Invoice.generateInvoicePdf(folio, function(err, responsePdf) {
                if (err) return cb(err);

                cb(null, {folio: folio, responsePdf});
                cc();
              });

           });

          }else {
            return cb(new Error("Timbrado fallido", substr));
            //console.log("Timbrado fallido");
          }
        });
      });
  };


  /**
   * @name generateInvoicePdf
   * @description Método para convertir la carta porte en PDF.
   * @param {string} folio Folio de la carta porte.
   * @return {callback} callback
   */
  Invoice.generateInvoicePdf = function(folio, cb){
    //console.log("Recibo de folio ---> generateInvoicePdf", folio);
    let ffConfig = Invoice.app.get("ff");

    //La Cadena que vamos a enviar debe ser de esta forma: RFC_Emisor ~ API_Key ~ Folio
    var cadena_Enviada = ffConfig.generate.RFC_Emisor +"~"+ ffConfig.generate.ApiKey +"~"+ ffConfig.pdf.AmbienteDePruebas +"~"+ folio;

    //Creamos el cliente para conectarse al Web service de factura fiel para crear el pdf
    soap.createClient(ffConfig.pdf.url, function(err, client) {
      //console.log("Creando factura pdf", client);
        if (err) return cb("Error al generar la factura en pdf", err);

        var args = {
          xml: (new Buffer(cadena_Enviada)).toString()
        };

        client.servicio_pdf(args, function(err, result, raw) {
          //console.log("servicio_pdf---> result", JSON.stringify(result));
          if (err) return cb(err);

          let respuesta = JSON.stringify(result);
          let substr = JSON.stringify(result.return.$value);
          var url = substr.substr(1).slice(0, -1); //Extraer la url para descargar la factura
          let substr2 = substr.substring(1, 6); //Extraer string para verificar la respuesta
          let toUpperCase = substr.toUpperCase(); //Convertilo a mayúsculas

         let posicion = toUpperCase.indexOf('HTTP://'); //Verificar si en la respuesta trea la palabra "FUE CANCELADO EXITOSAMENTE"
         //console.log("posición encontrada", posicion);

          if (posicion !== -1 ) {
            //console.log("Se genero correctamente el pdf");
            cb(null, {url: url});
          }else {
            return cb(new Error(
              'No se pudo generar la carta porte en PDF'));
            //console.log("No se genero correctamente el pdf");
          }
        });
      });
  };

};
