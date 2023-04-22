<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");

include $_SERVER['DOCUMENT_ROOT'] . '/bet-nhl/bet-nhl-APIs/includes/db.inc.php';
include $_SERVER['DOCUMENT_ROOT'] . '/bet-nhl/bet-nhl-APIs/includes/helpers.inc.php';


$restJson = file_get_contents("php://input");
$_POST = json_decode($restJson, true);

$query_id = $_POST['query_id'];

try{
  $sql = "SELECT * FROM query_page_paths WHERE query_id = :query_id";
  $s = $pdo->prepare($sql);
  $s->bindValue(':query_id', $query_id);
  $s->execute();
} catch (PDOException $e) {
  echo $e->getMessage();
  exit();
}

$count = 0;
while(($row = $s->fetch(PDO::FETCH_ASSOC)) != false){
  $path_id = $row['path_id'];
  if($path_id == 0){ $path_id = 'tablePath'; }
  else if($path_id == 1) { $path_id = 'tableBodyPath'; }
  else if($path_id == 2) { $path_id = 'dataPath'; }
  else $path_id = '';

  $page_paths[] = array(
    'path_id' => $path_id, 
    'type' => $row['path']
  );
  $count = 1;
}
if($count == 0) echo 'none';
else echo json_encode($page_paths);