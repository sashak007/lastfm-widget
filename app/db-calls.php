<?php
require_once(__DIR__. '/../htconf/dbconf.php');

$displayed 				 = $_GET["displayed"];
$offset 				 = $_GET["offset"];
$select_artist_arr = array();

$select_artist_query  	= 'SELECT artist,playcount,image FROM '.$dbConnection['database'].'.'.$dbConnection['table'];
	$select_artist_query .= ' ORDER BY playcount DESC LIMIT '.$offset.', '.$displayed;

$dbConnected = mysqli_connect($dbConnection['hostname'],$dbConnection['username'],$dbConnection['password']);

if ($dbConnected) {

	$select_artist_result = mysqli_query($dbConnected,$select_artist_query);
	// this is an object
	while ($select_artist_row = $select_artist_result->fetch_assoc()) {
		array_push($select_artist_arr, $select_artist_row);
	}

	echo json_encode($select_artist_arr);
}


?>