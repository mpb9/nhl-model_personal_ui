<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");

include $_SERVER['DOCUMENT_ROOT'] . '/bet-nhl/bet-nhl-APIs/includes/db.inc.php';
include $_SERVER['DOCUMENT_ROOT'] . '/bet-nhl/bet-nhl-APIs/includes/helpers.inc.php';


$restJson = file_get_contents("php://input");
$_POST = json_decode($restJson, true);


try{
  $sql = "SELECT * FROM queries";
  $s = $pdo->prepare($sql);
  $s->execute();
} catch (PDOException $e) {
  echo $e->getMessage();
  exit();
}

while(($row = $s->fetch(PDO::FETCH_ASSOC)) != false){
  $queries[] = array(
    'query_id' => $row['query_id'],
    'table_name' => $row['table_name'],
    'base_url' => $row['base_url']
  );
  $num = 1;
}

if($num !== 0) echo json_encode($queries[0]);
