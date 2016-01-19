<?php

class WeeklyArtists {
	private $last_week;
	private $now;

	function __construct() {
		$this->last_week = time() - (7 * 24 * 60 * 60);
		$this->now = time();
	}

	private function getTimes() {
		$times = array('last_week'=>$this->last_week,
										'now'=>$this->now
									);
		return $times;

	}

	public function get_weekly_stats() {
		$current_times = $this->getTimes();
		
		$url = 'http://ws.audioscrobbler.com/2.0/?method=user.getWeeklyArtistChart&user=livid_pun&from='. $this->last_week .'&to='. $this->now .'&format=json&api_key=' . getenv('API_KEY');

		echo 'url: ' . $url . "\n";
		$weekly_stats_data = file_get_contents($url);

		echo 'data: ' . $weekly_stats_data . "\n";
		$decoded_weekly_stats_data = json_decode($weekly_stats_data,true);

		return $decoded_weekly_stats_data;
	}

	public function get_artist_info() {
		$user_listening_data = $this->get_weekly_stats();

		$listening_data_artist_count = count($user_listening_data['weeklyartistchart']['artist']);

		$artist_list = array();
		$artist_info_data = array();

		for ($x = 0; $x < $listening_data_artist_count; $x++) {
			$artist_list[$x]= $user_listening_data['weeklyartistchart']['artist'][$x]['name'];
		
			$url = 'http://ws.audioscrobbler.com/2.0/?method=artist.getInfo&artist='.$artist_list[$x].'&format=json&api_key=' . getenv('API_KEY');

			$artist_info_data[$x] = file_get_contents($url);
		}
		
		$decoded_artist_info_data = json_decode($artist_info_data, true);

		var_dump($decoded_artist_info_data);

		// return $decoded_artist_info_data;

	}

	public function get_artist_image() {

	}
	
}
	
$weekly_artists_stats = new WeeklyArtists();
// $weekly_artists_stats->get_weekly_stats();
$weekly_artists_stats->get_artist_info();
// $artistInfo      = new ArtistInfo;



?>