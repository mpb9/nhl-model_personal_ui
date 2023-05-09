<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");

include $_SERVER['DOCUMENT_ROOT'] . '/bet-nhl/bet-nhl-APIs/includes/db.inc.php';
include $_SERVER['DOCUMENT_ROOT'] . '/bet-nhl/bet-nhl-APIs/includes/helpers.inc.php';

$restJson = file_get_contents("php://input");
$_POST = json_decode($restJson, true);

if(empty($_POST['query_id'])) die();
$query_id = $_POST['query_id'];

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

try{
  $sql = "DELETE FROM query_page_paths
          WHERE query_id = :query_id";
  $s = $pdo->prepare($sql);
  $s->bindValue(':query_id', $query_id);
  $s->execute();
} catch (PDOException $e) {
  echo $e->getMessage();
  exit();
}