<?php
require_once(__DIR__. '/../htconf/dbconf.php');

$displayed 				 = $_GET["displayed"];
$offset 				 = $_GET["offset"];
$select_artist_arr = array();
$artist_count_arr  = array();

$select_artist_query  	= 'SELECT artist,playcount,image FROM '.$dbConnection['database'].'.'.$dbConnection['table'];
	$select_artist_query .= ' ORDER BY playcount DESC LIMIT '.$offset.', '.$displayed;

$count_query = 'SELECT COUNT(*) from '.$dbConnection['database'].'.'.$dbConnection['table'];

$dbConnected = mysqli_connect($dbConnection['hostname'],$dbConnection['username'],$dbConnection['password']);

if ($dbConnected) {
	$select_artist_result = mysqli_query($dbConnected,$select_artist_query);
	$count_query_result = mysqli_query($dbConnected,$count_query);

	while ($select_artist_row = $select_artist_result->fetch_assoc()) {
		array_push($select_artist_arr, $select_artist_row);
	}

	array_push($artist_count_arr, $select_artist_arr);

	while($count = $count_query_result ->fetch_assoc()) {
		array_push($artist_count_arr, $count);
	}

	echo json_encode($artist_count_arr);
}


?>