# Agenda de contactos 1.0

Agenda para guardar tus contactos. Esta aplicación esta realizada con Pug, Jade,
Sass, Javascript, Ajax y PHP. Las peticiones las realiza desde Javascript usando
Ajax y los datos son consultados en el lado del servidor a una base de datos MYSQL
Y éstos son devueltos codificados en JSON hacia el cliente.

Respecto al diseño, se esta elaborando un diseño adaptativo (Responsive).

Sus características son las siguientes:
  * Realizar altas de contactos, bajas, consultas y modificaciones.
  * Asignar una imagen al contacto.
  * Capacidad de mostrar los contactos poco a poco para aligerar la carga de la aplicación o también mostrar todos en una petición.

## Requisitos
Estos son los requisitos para que funcione la aplicación:

  * Servidor web con PHP 5.3 o mayor. Testeado en Wamp Server.
  * MySQL 5 o mayor.
  * Para el cliente: IE 11, Edge, Firefox 4+ o Webkit-based browser (Safari 3+, Chrome 10+, iOS 3+, Android Browser 2.2+), etc.

## Instalación

**ADVERTENCIA: ¡¡¡Esta aplicación no está en producción todavía!!!**

Hay que seguir estos pasos:

  * Descomprimir el codigo en una carpeta accesible ne el servidor web.
  * Modificar los datos de conexión con la base de datos en el fichero contactos.php, lineas 20, 21, 22 y 23.
  * Importar desde PHPMyAdmin el fichero agenda_contactos.sql para crear la base de datos.
  * Abrir el navegador e ir a la url en cuestión.

## Herramientas usadas para su diseño
Esta aplicación usa las siguientes tecnologías:

  * [PUG, JADE], un preprocesador del lenguaje HTML.
  * [SASS], un preprocesador del lenguaje CSS3.
  * [PHP], un lenguaje del lado del servidor.
  * [JAVASCRIPT], un lenguaje del lado del cliente.
  * [AJAX], una técnica que permite la comunicación asíncrona entre un servidor y un navegador en formato XML mediante programas escritos en Javascript.
  * [MYSQL], un motor de bases de datos relacional.
Se ha prestado especial atención a que se respeten sus respectivas licencias. Si encuentra alguna falta de cumplimiento, no dude en abrir un ticket de emisión.

## Licencia
Esta aplicación esta bajo licencia [MIT].
