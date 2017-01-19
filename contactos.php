<?php
	//ini_set("display_errors", 1);
	//header('Access-Control-Allow-Origin: *');

	if (isset($_GET['operacion']) && trim($_GET['operacion']) != '')
		$operacion = $_GET['operacion'];
	else if (isset($_POST['operacion']) && trim($_POST['operacion']) != '')
		$operacion = $_POST['operacion'];
	else
		exit;

	if (!isset($_GET['nombre']) || trim($_GET['nombre']) == '')
		$nombre =  '1=1';

	$estado = [
	  'estado' => 1
	];

	try {
		$dbname = "agenda";
		$dbuser = "root";
		$dbpass = "oretania";
		$db = new PDO('mysql:host=localhost;dbname='.$dbname.';charset=utf8mb4', $dbuser, $dbpass);
	} catch(PDOException $e) {
		$estado[0] = 'Código de error SQLSTATE: '. $e->getCode();
		$estado[1] = 'Código de error específico del driver: '. $e->getLine();
		$estado[2] = $e->getMessage();
		$estado['estado'] = 0;
		$results["log"] = $estado;
		echo json_encode($results);
		exit;
	}

	if ($operacion == 'listar') {
		$nombre =  htmlentities(trim($_GET['nombre']));
		$consulta = "SELECT * FROM contacto WHERE nombre LIKE '%$nombre%' ORDER BY nombre ";
		if (isset($_GET['limit'])) {
			$limit =  htmlentities(trim($_GET['limit']));
			$consulta .= "LIMIT $limit ";
			if (isset($_GET['offset'])) {
				$offset =  htmlentities(trim($_GET['offset']));
				$consulta .= "OFFSET $offset";
			}
		}


		try{
			$stmt = $db->query($consulta);
		}catch(PDOException  $e){
			$estado['excepcion'] = $e->getMessage();
		}
	} else if ($operacion == 'editar') {
		if (!isset($_GET['dni']) || trim($_GET['dni']) == '')
			exit;
		$dni = htmlentities(trim($_GET['dni']));
		try {
			$stmt = $db->query("SELECT * FROM contacto WHERE dni='$dni'");
		}catch(PDOException  $e ){
			$estado['excepcion'] = $e->getMessage();
		}
	} else if ($operacion == 'nuevaAlta') {
		$nombre = htmlentities($_POST['nombre']);
		$dni = htmlentities($_POST['dni']);
		$apellidos = htmlentities($_POST['apellidos']);
		$curso = htmlentities($_POST['curso']);
		$telefono = htmlentities($_POST['telefono']);
		$direccion = htmlentities($_POST['direccion']);

		if (isset($_FILES['fotoUsuario']) && !empty($_FILES['fotoUsuario'])) {
			$nombre_archivo = $_FILES['fotoUsuario']['name'];
			$tipo_archivo = $_FILES['fotoUsuario']['type'];
			$tamano_archivo = $_FILES['fotoUsuario']['size'];
			$tmp_archivo = $_FILES['fotoUsuario']['tmp_name'];
			$ruta_destino = 'fotos/'.$dni. substr($nombre_archivo, -4);

			if (!move_uploaded_file($tmp_archivo, $ruta_destino)) {
				$estado[0] = 'Código de error SQLSTATE: Desconocido';
				$estado[1] = 'Código de error específico del driver: Desconocido';
				$estado[2] = "Error al mover el fichero subido desde $tmp_archivo a $ruta_destino";
				$estado['estado'] = 0;
			} else {
				try {
					$stmt = $db->query("INSERT INTO contacto (nombre, dni, apellidos, curso, telefono, direccion, imagen)
										VALUES ('$nombre', '$dni', '$apellidos', '$curso', '$telefono', '$direccion', '$ruta_destino')");

				} catch(PDOException  $e ){
					$estado['excepcion'] = $e->getMessage();
				}
			}
		} else {
			try {
				$stmt = $db->query("INSERT INTO contacto (nombre, dni, apellidos, curso, telefono, direccion, imagen)
									VALUES ('$nombre', '$dni', '$apellidos', '$curso', '$telefono', '$direccion', null)");

			} catch(PDOException  $e ){
				$estado['excepcion'] = $e->getMessage();
			}
		}
	} else if ($operacion == 'guardarModificacion') {
		$mnombre = htmlentities($_POST['mnombre']);
		$mdni = htmlentities($_POST['mdni']);
		$mapellidos = htmlentities($_POST['mapellidos']);
		$mcurso = htmlentities($_POST['mcurso']);
		$mtelefono = htmlentities($_POST['mtelefono']);
		$mdireccion = htmlentities($_POST['mdireccion']);

		if (isset($_FILES['fotoUsuario']) && !empty($_FILES['fotoUsuario'])) {
			// Borra los archivos que tengan el mismo dni y con la extension que sea para que no haya duplicados
			foreach (glob("fotos/$mdni"."*.*") as $filename) {
				if (file_exists($filename))
					unlink($filename);
			}

			$nombre_archivo = $_FILES['fotoUsuario']['name'];
			$tipo_archivo = $_FILES['fotoUsuario']['type'];
			$tamano_archivo = $_FILES['fotoUsuario']['size'];
			$tmp_archivo = $_FILES['fotoUsuario']['tmp_name'];
			$ruta_destino = 'fotos/'.$mdni. substr($nombre_archivo, -4);

			if (file_exists($tmp_archivo) && !move_uploaded_file($tmp_archivo, $ruta_destino)) {
				$estado[0] = 'Desconocido';
				$estado[1] = 'Desconocido';
				$estado[2] = "Error al mover el fichero subido desde $tmp_archivo a $ruta_destino";
				$estado['estado'] = 0;
			} else {
				$estado['cambioFoto'] = true;
				try {
					$stmt = $db->query("UPDATE contacto
										SET nombre='$mnombre',
											apellidos='$mapellidos',
											curso='$mcurso',
											telefono='$mtelefono',
											direccion='$mdireccion',
											imagen='$ruta_destino'
										WHERE dni='$mdni'");

				} catch(PDOException  $e ){
					$estado['excepcion'] = $e->getMessage();
				}
			}
		} else {
			$estado['cambioFoto'] = false;
			try {
				$stmt = $db->query("UPDATE contacto
									SET nombre='$mnombre',
										apellidos='$mapellidos',
										curso='$mcurso',
										telefono='$mtelefono',
										direccion='$mdireccion'
									WHERE dni='$mdni'");

			} catch(PDOException  $e ){
				$estado['excepcion'] = $e->getMessage();
			}
		}
	} else if ($operacion == 'borrar') {
		$dni = htmlentities($_GET['dni']);
		try {
			$stmt = $db->query("DELETE FROM contacto WHERE dni='$dni'");
		} catch(PDOException  $e ){
			$estado['excepcion'] = $e->getMessage();
		}
	}

	if ($operacion == "listar" || $operacion == "editar") {
		if (!$stmt) {
			$estado['estado'] = 0;
			$estado = array_merge($estado, $db->errorInfo());
		} else {
			$results = $stmt->fetchAll(PDO::FETCH_ASSOC);
			if ($operacion == "editar") {
				foreach ($results[0] as $clave => $valor)
					if ($clave != "imagen")
						$results[0][$clave] = html_entity_decode($results[0][$clave]);
			}
		}
	} else if ($operacion == "borrar") {
		if (!$stmt) {
			$estado['estado'] = 0;
			$estado = array_merge($estado, $db->errorInfo());
		} else $results['dni'] = $_GET['dni'];
	} else {
		if (!$stmt) {
			$estado['estado'] = 0;
			$estado = array_merge($estado, $db->errorInfo());
		}
	}
	$results["log"] = $estado;
	echo json_encode($results);

?>
