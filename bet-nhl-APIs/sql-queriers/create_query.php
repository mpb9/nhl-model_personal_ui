<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");

include $_SERVER['DOCUMENT_ROOT'] . '/bet-nhl/bet-nhl-APIs/includes/db.inc.php';
include $_SERVER['DOCUMENT_ROOT'] . '/bet-nhl/bet-nhl-APIs/includes/helpers.inc.php';

$restJson = file_get_contents("php://input");
$_POST = json_decode($restJson, true);

$table = $_POST['table'];
if(empty($table['name']) || empty($table['colums'])) die();
$table_name = $table['name'];
$columns = $table['columns'];

$website = $_POST['website'];
if(empty($website['baseUrl']) || empty($website['extensions'])) die();
$base_url = $website['baseUrl'];
$extensions = $website['extensions'];

try{
  $sql = "SELECT COUNT(*) FROM queries";
  $s = $pdo->prepare($sql);
  $s->execute();
} catch (PDOException $e) {
  echo $e->getMessage();
  exit();
}

$count = $s->fetch();
$new_query_index = $count[0];

try{
  $sql = "INSERT INTO queries SET
          query_id = :query_id,
          table_name = :table_name,
          base_url = :base_url";
  $s = $pdo->prepare($sql);
  $s->bindValue(':query_id', $new_query_index);
  $s->bindValue(':table_name', $table_name);
  $s->bindValue(':base_url', $base_url);
  $s->execute();
} catch (PDOException $e) {
  echo $e->getMessage();
  exit();
}

for($i = 0; $i < count($columns); $i++){
  try{
    $sql = "INSERT INTO query_columns SET
            query_id = :query_id,
            col_id = :col_id,
            col_name = :col_name,
            col_type = :col_type";
    $s = $pdo->prepare($sql);
    $s->bindValue(':query_id', $new_query_index);
    $s->bindValue(':col_id', $i);
    $s->bindValue(':col_name', $columns[$i]['name']);
    $s->bindValue(':col_type', $columns[$i]['type']);
    $s->execute();
  } catch (PDOException $e) {
    echo $e->getMessage();
    exit();
  }
}

for($i = 0; $i < count($extensions); $i++){
  try{
    $sql = "INSERT INTO query_extensions SET
            query_id = :query_id,
            ext_id = :ext_id,
            ext = :ext";
    $s = $pdo->prepare($sql);
    $s->bindValue(':query_id', $new_query_index);
    $s->bindValue(':ext_id', $i);
    $s->bindValue(':ext', $extensions[$i]);
    $s->execute();
  } catch (PDOException $e) {
    echo $e->getMessage();
    exit();
  }
}