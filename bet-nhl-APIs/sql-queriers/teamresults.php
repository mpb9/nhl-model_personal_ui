<?php

function team_results($team, $date, $homeOdds, $awayOdds, $otOdds, $homePM, $awayPM, $otPM){
  include $_SERVER['DOCUMENT_ROOT'] . '/betting/bettingAPI/includes/db.inc.php';

  try{
    $sql = "SELECT * FROM results
      WHERE result_date < :date
      AND (home_team = :team OR away_team = :team)
      AND (home_odds <= :homeOdds + :homePM AND home_odds >= :homeOdds - :homePM)
      AND (away_odds <= :awayOdds + :awayPM AND away_odds >= :awayOdds - :awayPM)
      AND (ot_odds <= :otOdds + :otPM AND ot_odds >= :otOdds - :otPM)
      ORDER BY result_date ASC";
    $s = $pdo->prepare($sql);
    $s->bindValue(':team', $team);
    $s->bindValue(':date', $date);
    $s->bindValue(':homeOdds', $homeOdds);
    $s->bindValue(':awayOdds', $awayOdds);
    $s->bindValue(':otOdds', $otOdds);
    $s->bindValue(':homePM', $homePM);
    $s->bindValue(':awayPM', $awayPM);
    $s->bindValue(':otPM', $otPM);
    $s->execute();
  } catch (PDOException $e) {
    echo $e->getMessage();
    exit();
  }

  $num = 0;
  while(($row = $s->fetch(PDO::FETCH_ASSOC)) != false){
    $dataTable[] = array(
      'game_id' => $num,
      'result_date' => $row['result_date'],
      'result_time' => $row['result_time'],
      'home_team' => $row['home_team'],
      'away_team' => $row['away_team'],
      'home_odds' => $row['home_odds'],
      'away_odds' => $row['away_odds'],
      'ot_odds' => $row['ot_odds'],
      'result' => $row['result'],
      'home_score' => $row['home_score'],
      'away_score' => $row['away_score']
    );
    $num=$num+1;
  }

  if($num != 0) return $dataTable;
  else {
    $dataTable[] = array(
      'game_id' => 0,
      'result_date' => '0000-00-00',
      'result_time' => '00:00:00',
      'home_team' => 'home',
      'away_team' => 'away',
      'home_odds' => 0.000,
      'away_odds' => 0.000,
      'ot_odds' => 0.000,
      'result' => 'result',
      'home_score' => 0,
      'away_score' => 0
    );
    return $dataTable;
  }
}