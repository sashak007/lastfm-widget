<?php
// TODO : cache artist data
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
		
		$url = 'http://ws.audioscrobbler.com/2.0/?method=user.getWeeklyArtistChart&user=livid_pun&from='. $this->last_week .'&to='. $this->now .'&format=json&api_key=' . getenv('LASTFM_API_KEY');

		$weekly_stats_data = file_get_contents($url);

		$decoded_weekly_stats_data = json_decode($weekly_stats_data,true);

		return $decoded_weekly_stats_data;
	}

	public function get_artist_info_for_user($displayed) {
		$user_listening_data = $this->get_weekly_stats();

		$listening_data_artist_count = count($user_listening_data['weeklyartistchart']['artist']);

		$artist_list = array();
		$user_plays = array();
		$artist_info_data = array();

		for ($x = 0; $x < $displayed; $x++) {
			$artist_list[$x] = $user_listening_data['weeklyartistchart']['artist'][$x]['name'];
		
			$fetch_artist_info_url = 'http://ws.audioscrobbler.com/2.0/?method=artist.getInfo&artist='.urlencode($artist_list[$x]).'&format=json&api_key=' . getenv('LASTFM_API_KEY');

			$artist_info_data[$x] = file_get_contents($fetch_artist_info_url);

			$decoded_artist_info_data[$x] = json_decode($artist_info_data[$x], true);
		}
		
		for ($y = 0; $y < $displayed; $y++) {
			$user_data[$y] = array('artist' => $user_listening_data['weeklyartistchart']['artist'][$y]['name'],
													   'playcount' => $user_listening_data['weeklyartistchart']['artist'][$y]['playcount']);
		}

		return array($decoded_artist_info_data,$user_data);

	}

	public function get_artist_image($displayed) {

		$complete_artist_info_data = $this->get_artist_info_for_user($displayed);
		$artist_data = $complete_artist_info_data[0];
		$user_data = $complete_artist_info_data[1];
		$artist_count = count($artist_data);

		for ($i = 0; $i < $artist_count; $i++) {
			$artist_images_arr = $artist_data[$i]['artist']['image'];
			foreach ($artist_images_arr as &$img) {
				if ($img['size'] === 'mega') {
					
					$user_data[$i]['image'] = $img['#text'];
				}
			}
		}

		return $user_data;
	}
}

$displayed = $_GET["displayed"];
$weekly_artists_stats = new WeeklyArtists();

$result = $weekly_artists_stats->get_artist_image($displayed);
header("Content-Type: application/json");
echo json_encode($result);

?>