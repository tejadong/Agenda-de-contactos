document.addEventListener("DOMContentLoaded", main);

function main() {

  function msg(msg, msgType) {
    panelErrores.classList.remove("alert");
    panelErrores.classList.remove("info");
    panelErrores.classList.remove("warning");
    panelErrores.classList.remove("success");
    panelErrores.classList.add(msgType);
    panelErrores.classList.remove("ocultar");
    panelErrores.childNodes[0].innerHTML = "<span>"+msg+"</span>";
    panelErrores.childNodes[0].innerHTML += "<span>&times;</span>";
    panelErrores.childNodes[0].onclick = function() {
      this.parentNode.classList.add("ocultar");
      this.parentNode.childNodes[0].innerHTML = "";
    };
  }

  function leer(url, parametros, eventCargado, asincrono, metodo, cabeceras) {
    var solicitud = new XMLHttpRequest();
    solicitud.addEventListener("load", eventCargado);
    solicitud.open(metodo, url, asincrono);
    if (cabeceras !== null) {
      for (var item in cabeceras)
        solicitud.setRequestHeader(item, cabeceras[item]);
    }
    document.getElementById("estadoPeticion").classList.remove("ocultar");
    solicitud.send(parametros);
  }

  function nuevaAlta(e) {
    document.getElementById("estadoPeticion").classList.add("ocultar");
    var datos = e.target;
    if(datos.status == 200 && datos.readyState == 4) {
      try  {
         var respuesta = JSON.parse(datos.responseText);
         if (respuesta.log.estado === 1) {
            // Limpiamos los campos y mostramos mensaje de éxito.
             var inputs = document.querySelectorAll("#cajaNuevaAltaUsuario input");
             for (var i=0; i<inputs.length; i++)
              inputs[i].value = "";
             tituloFoto.innerHTML = "Seleccione una foto...";
             foto.value = "";
             cajaContactos.innerHTML = "";
             leer("contactos.php?operacion=listar&nombre="+txtBuscar.value+"&limit="+limiteContactos+"&offset=0", null, listarContactos, true, "GET", null);
             msg("Contacto añadido correctamente.", "success");
         } else {
           msg("<ul>"+
               "<li>- Código de error SQLSTATE: "+respuesta.log[0]+"</li>"+
               "<li>- Código de error específico del driver: "+respuesta.log[1]+"</li>"+
               "<li>- Mensaje del error específico del driver: "+respuesta.log[2]+"</li></ul>", "alert");
         }
      } catch(e) {
         msg('Error en el servidor.', "alert");
      }
    }
    btnEnviar.disabled = false;
    btnCancelar.disabled = false;
  }

  function borrarContacto(e) {
    document.getElementById("estadoPeticion").classList.add("ocultar");
    var datos = e.target;
    if(datos.status == 200 && datos.readyState == 4) {
      try  {
         var respuesta = JSON.parse(datos.responseText);
         if (respuesta.log.estado === 1) {
           /*var contacto = document.getElementById(respuesta.dni);
           contacto.parentNode.removeChild(contacto);*/
           cajaContactos.innerHTML = "";
           leer("contactos.php?operacion=listar&nombre="+txtBuscar.value+"&limit="+limiteContactos+"&offset=0", null, listarContactos, true, "GET", null);
           msg("El contacto se ha borrado correctamente", "success");
         } else {
           msg("<ul>"+
               "<li>- Código de error SQLSTATE: "+respuesta.log[0]+"</li>"+
               "<li>- Código de error específico del driver: "+respuesta.log[1]+"</li>"+
               "<li>- Mensaje del error específico del driver: "+respuesta.log[2]+"</li></ul>", "alert");
         }
      } catch(e) {
         msg('Error en el servidor.', "alert");
      }
    }
  }

  function guardarContactoModificado(e) {
    document.getElementById("estadoPeticion").classList.add("ocultar");
    var datos = e.target;
    if(datos.status == 200 && datos.readyState == 4) {
      try  {
        var respuesta = JSON.parse(datos.responseText);
        if (respuesta.log.estado === 1) {
          var campos = document.getElementById(mdni.value).querySelectorAll("figure figcaption h1 span");
          campos[0].innerHTML = mnombre.value + " " + mapellidos.value;
          campos[1].innerHTML = mtelefono.value;
          if (respuesta.log.cambioFoto === true) {
            cajaFoto.setAttribute("src", "fotos/"+mdni.value+mtituloFoto.innerHTML.substr(mtituloFoto.innerHTML.lastIndexOf(".") ,mtituloFoto.innerHTML.lenght)+"?time="+new Date().getTime());
            document.getElementById(mdni.value).querySelector("figure img").setAttribute("src", "fotos/"+mdni.value+mtituloFoto.innerHTML.substr(mtituloFoto.innerHTML.lastIndexOf(".") ,mtituloFoto.innerHTML.lenght)+"?time="+new Date().getTime());
            mtituloFoto.innerHTML = "Seleccione una foto...";
            mfoto.value = "";
          }
          msg("Contacto modificado correctamente.", "success");
        } else {
          msg("<ul>"+
              "<li>- Código de error SQLSTATE: "+respuesta.log[0]+"</li>"+
              "<li>- Código de error específico del driver: "+respuesta.log[1]+"</li>"+
              "<li>- Mensaje del error específico del driver: "+respuesta.log[2]+"</li></ul>", "alert");
        }
      } catch(e) {
        msg('Error en el servidor.', "alert");
      }
    }
    mbtnEnviar.disabled = false;
    mbtnCancelar.disabled = false;
  }

  function modificarContacto(e) {
    document.getElementById("estadoPeticion").classList.add("ocultar");
    var datos = e.target;
    if(datos.status == 200 && datos.readyState == 4) {
      try  {
         var respuesta = JSON.parse(datos.responseText);
         if (respuesta.log.estado === 1) {
           for (var i=0; i<Object.keys(respuesta).length-1; i++) {
             mnombre.value = respuesta[i].nombre;
             mdni.value = respuesta[i].dni;
             mapellidos.value = respuesta[i].apellidos;
             mcurso.value = respuesta[i].curso;
             mtelefono.value = respuesta[i].telefono;
             mdireccion.value = respuesta[i].direccion;
             //mfoto.value = respuesta[i].imagen;
             var imagen = respuesta[i].imagen;
             if (imagen === null)
               imagen = "img/sinimagen.png";
             cajaFoto.setAttribute("src", imagen+"?time="+new Date().getTime());
             cajaFoto.setAttribute("alt", respuesta[i].nombre);
           }

           mcontenedorFoto.onclick = function() {
             minputFile.click();
             minputFile.addEventListener("change", function(e) {
               if (minputFile.value !== "")
                 mtituloFoto.innerHTML = minputFile.files[0].name;
             });
           };

           mbtnCancelar.onclick = function() {
             document.getElementById("botonesMostrar").classList.remove("ocultar");
             document.getElementById("cajaBuscar").classList.remove("ocultar");
             document.getElementById("listado").classList.remove("ocultar");
             panelErrores.classList.add("ocultar");
             document.getElementById("cajaModificar").classList.add("ocultar");
             mtituloFoto.innerHTML = "Seleccione una foto...";
           };

           mbtnEnviar.onclick = function() {
             if (mnombre.value.trim() === "") {
               msg("El nombre no puede estar vacío.", "alert");
               return;
             } else if (mapellidos.value.trim() === "") {
               msg("Los apellidos no pueden estar vacío.", "alert");
               return;
             } else if (mtelefono.value.trim() === "") {
               msg("El teléfono no puede estar vacío.", "alert");
               return;
             } else if( !(/^\d{9}$/.test(mtelefono.value)) ) {
               msg("El teléfono no es correcto.", "alert");
               return;
             }

             mbtnEnviar.disabled = true;
             mbtnCancelar.disabled = true;

             var formData = new FormData();
             /*var headers = {
                 "Content-Type": "multipart/form-data"
             };*/
             formData.append("operacion", "guardarModificacion");
             if (mfoto.files.length > 0)
               formData.append("fotoUsuario", mfoto.files[0]);
             formData.append("mnombre", mnombre.value);
             formData.append("mdni", mdni.value);
             formData.append("mapellidos", mapellidos.value);
             formData.append("mcurso", mcurso.value);
             formData.append("mtelefono", mtelefono.value);
             formData.append("mdireccion", mdireccion.value);
             leer("contactos.php", formData, guardarContactoModificado, true, "POST", null);
           };
         } else {
           msg("<ul>"+
               "<li>- Código de error SQLSTATE: "+respuesta.log[0]+"</li>"+
               "<li>- Código de error específico del driver: "+respuesta.log[1]+"</li>"+
               "<li>- Mensaje del error específico del driver: "+respuesta.log[2]+"</li></ul>", "alert");
         }
      } catch(e) {
         msg('Error en el servidor.', "alert");
      }
    }
  }

  function listarContactos(e) {
    document.getElementById("estadoPeticion").classList.add("ocultar");
    var datos = e.target;
    if(datos.status == 200 && datos.readyState == 4) {

      try  {
        var respuesta = JSON.parse(datos.responseText);
        if (respuesta.log.estado === 1) {
          var acciones;
          var dnis = []; // array para guardar los dnis y luego asignarle el onclick a las acciones

          if ( Object.keys(respuesta).length-1 === 0) {
            msg("No hay contactos.", "warning");
          } else {
            for (var i=0; i<Object.keys(respuesta).length-1; i++) {
              var imagen;
              if (respuesta[i].imagen === null)
                imagen = "img/sinimagen.png";
              else
                imagen = respuesta[i].imagen;

              dnis.push(respuesta[i].dni);

              cajaContactos.innerHTML +=
                '<div id="'+respuesta[i].dni+'" class="contacto">' +
                  '<figure>' +
                    '<img src="'+ imagen +'" alt="'+ respuesta[i].nombre +'" />' +
                    '<figcaption>' +
                      '<h1><span class="fa fa-user-circle fa-2x">&nbsp;' + respuesta[i].nombre + '&nbsp;' + respuesta[i].apellidos + '</span></h1>' +
                      '<h1><span class="fa fa-phone fa-2x">&nbsp;' + respuesta[i].telefono + '</span></h1>' +
                      '<div class="acciones">' +
                        '<i class="fa fa-pencil-square-o fa-2x"></i>' +
                        '<i class="fa fa-times fa-2x"></i>' +
                      '</div>' +
                    '</figcaption>' +
                  '</figure>' +
                '</div>';
            }

            // Añade los eventos a cada boton de las acciones de cada contacto
            for (var i=0; i<dnis.length; i++) {
              acciones = document.getElementById(respuesta[i].dni).childNodes[0].childNodes[1].childNodes[2];
              // Botón Editar contacto
              acciones.childNodes[0].onclick = function() {
                var dniContacto = this.parentNode.parentNode.parentNode.parentNode.id;
                leer("contactos.php?operacion=editar&dni="+dniContacto, null, modificarContacto, true, "GET", null);
                document.getElementById("botonesMostrar").classList.add("ocultar");
                document.getElementById("cajaBuscar").classList.add("ocultar");
                document.getElementById("listado").classList.add("ocultar");
                document.getElementById("cajaModificar").classList.remove("ocultar");
              };
              // Botón Borrar contacto
              acciones.childNodes[1].onclick = function() {
                var dniContacto = this.parentNode.parentNode.parentNode.parentNode.id;
                var r = confirm("¿Está seguro que desea borrar este contacto?");
                if (r === true) {
                  leer("contactos.php?operacion=borrar&dni="+dniContacto, null, borrarContacto, true, "GET", null);
                }
              };
            }
            offset+=(Object.keys(respuesta).length-1);
          }
        } else {
          msg("<ul>"+
              "<li>- Código de error SQLSTATE: "+respuesta.log[0]+"</li>"+
              "<li>- Código de error específico del driver: "+respuesta.log[1]+"</li>"+
              "<li>- Mensaje del error específico del driver: "+respuesta.log[2]+"</li></ul>", "alert");
        }
      } catch(e) {
        msg('Error en el servidor.', "alert");
      }
    }
    btnMas.disabled = false;
    btnTodos.disabled = false;
    btnBuscar.disabled = false;
  }

  // Menu
    var myTopnav = document.getElementById("myTopnav").querySelectorAll("li");
    // Botón inicio
    myTopnav[0].onclick = function() {
      document.getElementById("cajaBuscar").classList.remove("ocultar");
      document.getElementById("listado").classList.remove("ocultar");
      document.getElementById("cajaModificar").classList.add("ocultar");
      document.getElementById("cajaNuevaAlta").classList.add("ocultar");
      document.getElementById("botonesMostrar").classList.remove("ocultar");
      panelErrores.classList.add("ocultar");
    };
    // Botón Altas
    myTopnav[1].onclick = function() {
      document.getElementById("botonesMostrar").classList.add("ocultar");
      document.getElementById("cajaBuscar").classList.add("ocultar");
      document.getElementById("listado").classList.add("ocultar");
      document.getElementById("cajaModificar").classList.add("ocultar");
      document.getElementById("cajaNuevaAlta").classList.remove("ocultar");
      panelErrores.classList.add("ocultar");
    };
  // Botones buscador
    var offset = 0;
    var limiteContactos = 5;
    var txtBuscar = document.getElementById("buscar");
    var btnMas = document.getElementById("btnMas");
    var btnTodos = document.getElementById("btnTodos");
    var btnBuscar = document.getElementById("btnBuscar");
    var panelErrores = document.getElementById("panelErrores");
    var cruzAlertas = document.getElementsByClassName("closebtn");
    var cajaContactos = document.getElementById("listado");
    cruzAlertas.onclick = function() {
      this.parentNode.classList.add("ocultar");
    };
  // Botones nuevo
  //
    var nombre = document.getElementById("nombre");
    var dni = document.getElementById("dni");
    var apellidos = document.getElementById("apellidos");
    var cursos = document.getElementById("cursos");
    var telefono = document.getElementById("telefono");
    var direccion = document.getElementById("direccion");
    var foto = document.getElementById("foto");
    var contenedorFoto = document.getElementById("contenedorFoto");
    var inputFile = document.getElementById("foto");
    var btnEnviar = document.getElementById("btnEnviar");
    var btnCancelar = document.getElementById("btnCancelar");
    var tituloFoto = document.getElementById("tituloFoto");
  // Botones editar
    var mnombre = document.getElementById("mnombre");
    var mdni = document.getElementById("mdni");
    var mapellidos = document.getElementById("mapellidos");
    var mcursos = document.getElementById("mcursos");
    var mtelefono = document.getElementById("mtelefono");
    var mdireccion = document.getElementById("mdireccion");
    var mfoto = document.getElementById("mfoto");
    var cajaFoto = document.getElementById("cajaFoto");
    var mbtnEnviar = document.getElementById("mbtnEnviar");
    var mbtnCancelar = document.getElementById("mbtnCancelar");
    var mcontenedorFoto = document.getElementById("mcontenedorFoto");
    var minputFile = document.getElementById("mfoto");
    var mtituloFoto = document.getElementById("mtituloFoto");

    // Casilla donde se sube la foto en las altas
    contenedorFoto.onclick = function() {
      inputFile.click();
      inputFile.addEventListener("change", function(e) {
        if (inputFile.value !== "")
          tituloFoto.innerHTML = inputFile.files[0].name;
      });
    };

    // Botón enviar de las altas
    btnEnviar.onclick = function() {
      if (nombre.value.trim() === "") {
        msg("El nombre no puede estar vacío.", "alert");
        return;
      } else if (apellidos.value.trim() === "") {
        msg("Los apellidos no pueden estar vacío.", "alert");
        return;
      } else if (!(/^\d{8}[A-Z]$/.test(dni.value))) {
        msg("El dni no es correcto.", "alert");
        return;
      } else if (telefono.value.trim() === "") {
        msg("El teléfono no puede estar vacío.", "alert");
        return;
      } else if( !(/^\d{9}$/.test(telefono.value)) ) {
        msg("El teléfono no es correcto.", "alert");
        return;
      }

      // Desactivamos los botones de enviar y cancelar
      this.disabled = true;
      btnCancelar.disabled = true;

      var formData = new FormData();
      formData.append("operacion", "nuevaAlta");
      formData.append("fotoUsuario", foto.files[0]);
      formData.append("nombre", nombre.value);
      formData.append("dni", dni.value);
      formData.append("apellidos", apellidos.value);
      formData.append("curso", curso.value);
      formData.append("telefono", telefono.value);
      formData.append("direccion", direccion.value);
      leer("contactos.php", formData, nuevaAlta, true, "POST", null);
    };

    // Botón cancelar de las altas
    btnCancelar.onclick = function() {
      document.getElementById("botonesMostrar").classList.remove("ocultar");
      document.getElementById("cajaBuscar").classList.remove("ocultar");
      document.getElementById("listado").classList.remove("ocultar");
      document.getElementById("cajaNuevaAlta").classList.add("ocultar");
      panelErrores.classList.add("ocultar");
      mtituloFoto.innerHTML = "Seleccione una foto...";
    };

  btnBuscar.onclick = function() {
    panelErrores.classList.add("ocultar");
    if (txtBuscar.value.trim() === "") {
      limiteContactos = 5;
    } else {
      limiteContactos = offset;
    }
    cajaContactos.innerHTML = "";
    offset = 0;
    this.disabled = true;
    btnMas.disabled = true;
    btnTodos.disabled = true;
    leer("contactos.php?operacion=listar&nombre="+txtBuscar.value+"&limit="+limiteContactos+"&offset="+offset, null, listarContactos, true, "GET", null);
  };

  btnMas.onclick = function() {
    this.disabled = true;
    btnBuscar.disabled = true;
    btnTodos.disabled = true;
    leer("contactos.php?operacion=listar&nombre="+txtBuscar.value+"&limit="+limiteContactos+"&offset="+offset, null, listarContactos, true, "GET", null);
  };

  btnTodos.onclick = function() {
    this.disabled = true;
    btnBuscar.disabled = true;
    btnMas.disabled = true;
    cajaContactos.innerHTML = "";
    txtBuscar.value = "";
    leer("contactos.php?operacion=listar&nombre="+txtBuscar.value, null, listarContactos, true, "GET", null);
  };

  txtBuscar.onkeypress = function(event) {
    if ( (event.which || event.keyCode) === 13)
      btnBuscar.click();
  };

  panelErrores.classList.add("ocultar");
  leer("contactos.php?operacion=listar&nombre="+txtBuscar.value+"&limit=5&offset=0", null, listarContactos, true, "GET", null);


}
