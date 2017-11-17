'use strict';
  var app = angular.module('nextbook20App')
  app.service('repositorioFacturas', function ($resource, urlService, $localStorage) {
    // --------------------------------FACTURAS CORREOS--------------------------------//
    this.Leer_Facturas_Correo = function() {
      return $resource(urlService.server().appnext()+'Leer_Facturas_Correo', {} , {
        get: {
          method: 'POST', isArray: false,
          params: {
              token: $localStorage.token
          }
        }
      });
    };
    this.Get_Xml_Factura_Correo = function() {
      return $resource(urlService.server().appnext()+'Get_Xml_Factura_Correo', {} , {
        add: {
          method: 'POST', isArray: false,
          params: {
              token: $localStorage.token
          }
        }
      });
    };
    // ---------------------------------SUBIR FACTURAS---------------------------------//
    this.Get_Tipo_Documentos = function() {
      return $resource(urlService.server().appnext()+'Get_Tipo_Documentos', {} , {
        get: {
          method: 'POST', isArray: false,
          params: {
              token: $localStorage.token
          }
        }
      });
    };
    // ------------------------------FACTURAS RECHAZADAS------------------------------//
    this.Get_Facturas_Rechazadas = function() {
      return $resource(urlService.server().appnext()+'Get_Facturas_Rechazadas', {} , {
        get: {
          method: 'POST', isArray: false,
          params: {
              token: $localStorage.token
          }
        }
      });
    };
    // ------------------------------MIS FACURAS------------------------------//
    this.Get_Mis_Facturas = function() {
      return $resource(urlService.server().appnext()+'Get_Mis_Facturas', {} , {
        get: {
          method: 'POST', isArray: false,
          params: {
              token: $localStorage.token
          }
        }
      });
    };
    // ------------------------------GET TOTALES------------------------------//
    this.Get_Totales_Facturas = function() {
      return $resource(urlService.server().appnext()+'Get_Totales_Facturas', {} , {
        get: {
          method: 'POST', isArray: false,
          params: {
              token: $localStorage.token
          }
        }
      });
    };
    // ------------------------------GET TOTALES------------------------------//
    this.Generar_PDF = function() {
      return $resource(urlService.server().appnext()+'Generar_PDF', {} , {
        get: {
          method: 'POST', isArray: false,
          params: {
              token: $localStorage.token
          }
        }
      });
    };
    this.Estado_Factura = function() {
      return $resource(urlService.server().appserviciosnext()+'estado_factura', {} , {
        add: {
          method: 'POST', isArray: false,
        }
      });
    };
    this.Upload_Factura = function() {
      return $resource(urlService.server().appnext()+'Upload_Factura', {} , {
        add: {
          method: 'POST', isArray: false,
          params: {
              token: $localStorage.token
          }
        }
      });
    };
    this.Get_Gastos = function() {
          return $resource(urlService.server().appnext()+'Get_Gastos', {} , {
              get: {
                  method: 'POST', isArray: false,
                  params: {
                      token: $localStorage.token
                  }
              }
          });
    };
    // -------------------------------------------INICIO FACTURAS------------------------------------------
    this.Get_Totales_Facturas = function() {
        return $resource(urlService.server().appnext()+'Get_Totales_Facturas', {} , {
            get: {
                method: 'POST', isArray: false,
                params: {
                    token: $localStorage.token
                }
            }
        });
    }; 
    this.money = function(string) {
        
        return parseFloat(string);
    }; 
    // ----------------------------------- lectura xml extraccion clave -----------------------------------
    this.buscar_comprobante = function(xml_sin_empresa) {
        var campos_vector = _.keys(xml_sin_empresa);
        for (var i = 0; i < campos_vector.length; i++) {
            if (campos_vector[i] == 'comprobante') {
              return true;
              break;
            }
        }
        return false;
    };
    this.Extraer_Clave_Acceso = function($fileContent) {
      var xml = $fileContent;
      var data;
      if (xml.length != 0) {
          var x2js = new X2JS();
          var xml_final = x2js.xml_str2json(xml);
          var nombre_empresa = _.keys(xml_final);

          var xml_sin_empresa = xml_final[nombre_empresa[0]];
          var xml_final;
          var resultado = this.buscar_comprobante(xml_sin_empresa);

          if (resultado) { // Verdadero
            
            if (xml_sin_empresa.comprobante.constructor === String) {
              xml_final = xml_sin_empresa.comprobante;
            }

            if (xml_sin_empresa.comprobante.constructor === Object) {
              xml_final = xml_sin_empresa.comprobante.__cdata
            }
            

          } else {
              var campos_vector = _.keys(xml_sin_empresa);
              for (var i = 0; i < campos_vector.length; i++) {
                  var entrada1 = xml_sin_empresa[campos_vector[i]];
                  if (typeof entrada1 == "object") {
                      if (!this.buscar_comprobante(entrada1)) {
                          var nivel2 = entrada1;
                          var cat_nivel2 = _.keys(nivel2)
                          for (var j = 0; j < cat_nivel2.length; j++) {
                              var cat_sec = cat_nivel2[j];
                              var entrada2 = nivel2[cat_sec];
                              if (typeof entrada2 == "object") {
                                  if (!this.buscar_comprobante(entrada2)) {
                                      var nivel3 = entrada2;
                                      var cat_nivel3 = _.keys(entrada2)
                                      for (var k = 0; k < cat_nivel3.length; k++) {
                                          var cat_ter = cat_nivel3[k];
                                          var entrada3 = entrada2[cat_ter];
                                          if (typeof entrada3 == "object") {
                                              if (!this.buscar_comprobante(entrada3)) {
                                                  var nivel4 = entrada3;
                                                  var cat_nivel4 = _.keys(entrada3)
                                                  for (var l = 0; l < cat_nivel3.length; l++) {
                                                      var cat_cua = cat_nivel4[l];
                                                      var entrada4 = entrada3[cat_cua];

                                                      if (typeof entrada4 == "object") {
                                                          if (!this.buscar_comprobante(entrada4)) {
                                                              var nivel5 = entrada4;
                                                              var cat_nivel5 = _.keys(entrada4)
                                                              for (var m = 0; m < cat_nivel5.length; m++) {
                                                                  var cat_qui = cat_nivel5[m];
                                                                  var entrada5 = entrada4[cat_qui];
                                                                  if (!this.buscar_comprobante(entrada5)) {
                                                                      console.log(entrada5);
                                                                  } else {
                                                                      xml_final = entrada5.comprobante;
                                                                  }
                                                              }
                                                          } else {
                                                              xml_final = entrada4.comprobante;
                                                          }
                                                      }
                                                  }
                                              } else {
                                                  xml_final = entrada3.comprobante;
                                              }
                                          }
                                      }
                                  } else {
                                      xml_final = entrada2.comprobante;
                                  }
                              }
                          }
                      } else {
                          xml_final = entrada1.comprobante;
                      }
                  }
              }
          }
          
          if (typeof xml_final == "object") {
              data = [{
                  clave: xml_final.factura.infoTributaria.claveAcceso
              }];
          } else {
              var xml;
              var xml_filter = x2js.xml_str2json(xml_final);
              if (!xml_filter) {
                  var f = xml_final;
                  var m = f.replace("<![CDATA[", "");
                  var m = m.replace("]]>", "");
                  var xml_filter = x2js.xml_str2json(m);
              }
              if (xml_filter.factura) {
                data = [{clave: xml_filter.factura.infoTributaria.claveAcceso}];
              }
              if (xml_filter.notaCredito) {
                data = [{clave: xml_filter.notaCredito.infoTributaria.claveAcceso}];
              }
          }
          // revision_factura(data[0]);
      }
      return data[0];
    };
  });