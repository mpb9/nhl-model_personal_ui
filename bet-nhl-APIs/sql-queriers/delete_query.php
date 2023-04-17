<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");

include $_SERVER['DOCUMENT_ROOT'] . '/bet-nhl/bet-nhl-APIs/includes/db.inc.php';
include $_SERVER['DOCUMENT_ROOT'] . '/bet-nhl/bet-nhl-APIs/includes/helpers.inc.php';

$restJson = file_get_contents("php://input");
$_POST = json_decode($restJson, true);

$table = $_POST['table'];
if(empty($table['name']) || empty($table['columns'])) die();
$table_name = $table['name'];
$columns = $table['columns'];

$website = $_POST['website'];
if(empty($website['baseUrl']) || empty($website['extensions'])) die();
$base_url = $website['baseUrl'];
$extensions = $website['extensions'];

try{
  $sql = "SELECT * FROM queries
          WHERE table_name = :table_name 
          AND base_url = :base_url";
  $s = $pdo->prepare($sql);
  $s->bindValue(':table_name', $table_name);
  $s->bindValue(':base_url', $base_url);
  $s->execute();
} catch (PDOException $e) {
  echo $e->getMessage();
  exit();
}
$row = $s->fetch(PDO::FETCH_ASSOC);
$query_id = $row['query_id'];

try{
  $sql = "DELETE FROM queries 
          WHERE query_id = :query_id";
  $s = $pdo->prepare($sql);
  $s->bindValue(':query_id', $query_id);
  $s->execute();
} catch (PDOException $e) {
  echo $e->getMessage();
  exit();
}

try{
  $sql = "DELETE FROM query_columns 
          WHERE query_id = :query_id";
  $s = $pdo->prepare($sql);
  $s->bindValue(':query_id', $query_id);
  $s->execute();
} catch (PDOException $e) {
  echo $e->getMessage();
  exit();
}

try{
  $sql = "DELETE FROM query_extensions
          WHERE query_id = :query_id";
  $s = $pdo->prepare($sql);
  $s->bindValue(':query_id', $query_id);
  $s->execute();
} catch (PDOException $e) {
  echo $e->getMessage();
  exit();
}
