<?php

include('config.php');


	$mysqli = new mysqli($host, $user, $password, $db);
	if ($mysqli->connect_errno) {
		die ("Failed to connect to MySQL: (" . $mysqli->connect_errno . ") " . $mysqli->connect_error);
	}

	// $id = $mysqli->real_escape_string($_PUT['id']);

	$query = "UPDATE users SET task1 = 1 WHERE id = '25' ";


	$result = $mysqli->query($query);
	if (!$result) {
		die ("Failed to retrieve data: (" . $mysqli->errno . ") " . $mysqli->error);
    }
    echo $result;

	// header('Content-Type: text/xml');
	// while($row = mysqli_fetch_array($result)) {
	// 	echo 'yes';
	// 	break;
	// }


?>