<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");

include $_SERVER['DOCUMENT_ROOT'] . '/bet-nhl/bet-nhl-APIs/includes/db.inc.php';
include $_SERVER['DOCUMENT_ROOT'] . '/bet-nhl/bet-nhl-APIs/includes/helpers.inc.php';

$restJson = file_get_contents("php://input");
$_POST = json_decode($restJson, true);

try{
  $sql = "SELECT COUNT(*) FROM queries";
  $s = $pdo->prepare($sql);
  $s->execute();
} catch (PDOException $e) {
  echo $e->getMessage();
  exit();
}
$count = $s->fetch();

$queries = array();

for($i = 0; $i < $count[0]; $i++){

  try{
    $sql = "SELECT * FROM queries WHERE query_id = :query_id";
    $s = $pdo->prepare($sql);
    $s->bindValue(':query_id', $i);
    $s->execute();
  } catch (PDOException $e) {
    echo $e->getMessage();
    exit();
  }
  $row = $s->fetch(PDO::FETCH_ASSOC);
  $query = array('table_name' => $row['table_name'], 'base_url' => $row['base_url']);
  
  try{
    $sql = "SELECT * FROM query_columns WHERE query_id LIKE :query_id";
    $s = $pdo->prepare($sql);
    $s->bindValue(':query_id', $i);
    $s->execute();
  } catch (PDOException $e) {
    echo $e->getMessage();
    exit();
  }
  while(($row = $s->fetch(PDO::FETCH_ASSOC)) != false){
    $columns[] = array(
      'name' => $row['col_name'], 
      'type' => $row['col_type']
    );
  }

  try{
    $sql = "SELECT * FROM query_extensions WHERE query_id LIKE :query_id";
    $s = $pdo->prepare($sql);
    $s->bindValue(':query_id', $i);
    $s->execute();
  } catch (PDOException $e) {
    echo $e->getMessage();
    exit();
  }
  while(($row = $s->fetch(PDO::FETCH_ASSOC)) != false){
    $extensions[] = $row['ext'];
  }

  try{
    $sql = "SELECT * FROM query_page_paths WHERE query_id LIKE :query_id";
    $s = $pdo->prepare($sql);
    $s->bindValue(':query_id', $i);
    $s->execute();
  } catch (PDOException $e) {
    echo $e->getMessage();
    exit();
  }
  $row = $s->fetch(PDO::FETCH_ASSOC);
  $pagePath = array(
    'to_table' => $row['to_table'], 
    'to_all_data' => $row['to_all_data'],
    'to_data_element' => $row['to_data_element']
  );


  $queries[$i] = array(
    'query_id' => $i,
    'table' => array(
      'query_id' => $i,
      'table_name' => $query['table_name'],
      'columns' => $columns
    ),
    'website' => array(
      'query_id' => $i,
      'base_url' => $query['base_url'],
      'extensions' => $extensions
    ),
    'page_path' => $pagePath
  );
  $extensions = array();
  $columns = array();
  $pagePath = array();
}

echo json_encode($queries);