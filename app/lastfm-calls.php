<?php
// TODO : 
  // * cron artist data call to lastfm so db stays up to date.

require_once(__DIR__ . '/../htconf/dbconf.php');

class WeeklyArtists {
  private $last_week;
  private $now;

  function __construct() {
    $this->last_week = time() - (7 * 24 * 60 * 60);
    $this->now = time();
  }

  private function getTimes() {
    $times = array('last_week'=>$this->last_week,
                    'now'=>$this->now);
    return $times;
  }

  public function get_weekly_stats() {
    $current_times = $this->getTimes();
    
    $url = 'http://ws.audioscrobbler.com/2.0/?method=user.getWeeklyArtistChart&user=livid_pun&from='. $this->last_week .'&to='. $this->now .'&format=json&api_key=' . getenv('LASTFM_API_KEY');

    $weekly_stats_data = file_get_contents($url);

    $decoded_weekly_stats_data = json_decode($weekly_stats_data,true);

    return $decoded_weekly_stats_data;
  }

  public function get_artist_info_for_user() {
    $user_listening_data = $this->get_weekly_stats();
    $artist_count        = count($user_listening_data['weeklyartistchart']['artist']);
    $artist_list         = array();
    $user_plays          = array();
    $artist_info_data    = array();

    for ($x = 0; $x < $artist_count; $x++) {
      $artist_list[$x] = $user_listening_data['weeklyartistchart']['artist'][$x]['name'];
    
      $fetch_artist_info_url = 'http://ws.audioscrobbler.com/2.0/?method=artist.getInfo&artist='.urlencode($artist_list[$x]).'&format=json&api_key=' . getenv('LASTFM_API_KEY');

      $artist_info_data[$x] = file_get_contents($fetch_artist_info_url);

      $decoded_artist_info_data[$x] = json_decode($artist_info_data[$x], true);
    }
    
    for ($y = 0; $y <$artist_count ; $y++) {
      $user_data[$y] = array('artist' => $user_listening_data['weeklyartistchart']['artist'][$y]['name'],
                             'playcount' => $user_listening_data['weeklyartistchart']['artist'][$y]['playcount']);
    }

    return array($decoded_artist_info_data,$user_data);

  }

  public function get_artist_image_and_url() {

    $complete_artist_info_data = $this->get_artist_info_for_user();
    $artist_data = $complete_artist_info_data[0];
    $user_data = $complete_artist_info_data[1];
    $artist_count = count($artist_data);

    for ($i = 0; $i < $artist_count; $i++) {
      $user_data[$i]['url'] = $artist_data[$i]['artist']['url'];
      $artist_images_arr = $artist_data[$i]['artist']['image'];

      foreach ($artist_images_arr as &$img) {
        if ($img['size'] === 'large' && $img['#text'] !== '') {
          $user_data[$i]['image'] = $img['#text'];
        } elseif($img['#text'] === '') {
          $user_data[$i]['image'] = '../img/music-banner.jpg';
        }
      }
    }

    return $user_data;
  }
}


$weekly_artists_stats = new WeeklyArtists();
$result = $weekly_artists_stats->get_artist_image_and_url();

// print_r($result);

$dbConnected = mysqli_connect($dbConnection['hostname'],$dbConnection['username'],$dbConnection['password']);

$insert_sql    = 'INSERT INTO '.$dbConnection['database'].'.'.$dbConnection['table'];
  $insert_sql .= ' (artist,playcount,image,url)';

$select_sql = 'SELECT * FROM '.$dbConnection['database'].'.'.$dbConnection['table'];

$update_sql = 'UPDATE '.$dbConnection['database'].'.'.$dbConnection['table'];

$delete_sql = 'DELETE FROM '.$dbConnection['database'].'.'.$dbConnection['table'];

$count_rows = 'SELECT COUNT(*) FROM '.$dbConnection['database'].'.'.$dbConnection['table'];

$last_week = date('Y-m-d H:i:s',(time() - (7 * 24 * 60 * 60)));

$index  = 0;

if ($dbConnected) {
  while ($index < count($result)) { 

    $select_artist_sql_val      = $select_sql.' WHERE artist = "'.$result[$index]['artist'].'"';
    $select_artist_query_result = mysqli_query($dbConnected, $select_artist_sql_val);
    $selected_artist_row        = mysqli_fetch_assoc($select_artist_query_result);

    $delete_old_timestamp       = $delete_sql.' WHERE modified_at < CAST("'.$last_week.'" AS DATETIME)';

    if(($select_artist_query_result->num_rows !== 0) && ($result[$index]['playcount'] !== $selected_artist_row['playcount'])){
      $update_sql_val = $update_sql .' SET playcount="'.$result[$index]['playcount']
      .'" WHERE artist="'.$result[$index]['artist'].'"';

      if (mysqli_query($dbConnected, $update_sql_val)){
        echo $result[$index]['artist'] . " SUCCESS update playcount<br />";
      } else {
        echo $result[$index]['artist'] . " FAIL<br />".mysqli_error($dbConnected);
      }
    
    } else if ($select_artist_query_result->num_rows == 0) {

      $insert_sql_val = $insert_sql .' VALUES ("'.$result[$index]['artist'].'","'
      .$result[$index]['playcount'].'","'
      .$result[$index]['image'].'","'
      .$result[$index]['url'].'")';

      if (mysqli_query($dbConnected, $insert_sql_val)){
        echo $result[$index]['artist'] . " SUCCESS insert<br />";
      } else {
        echo $result[$index]['artist'] . " FAIL<br />".mysqli_error($dbConnected) . "<br/>";
        echo $insert_sql_val;
      }
    } else {
      echo $result[$index]['artist'] . " NO UPDATE, NO INSERT<br />";
    }

    $index++;
  }

  if(mysqli_query($dbConnected, $delete_old_timestamp)){
    echo "SUCCESS DELETE<br />";
  } else {
    echo "NO DELETION".mysqli_error($dbConnected)."<br />";
  }


}


?>