<?php
	if (!isset($_SESSION)) { session_start(); }
	include_once('connectDB.php');

	$rows = array();
	//Update tables & seats information
	if(isset($_POST['target']) && $_POST['target'] == 'mapInfo') 
	{	

		$amacs = $_POST['amac'];
		$numSeating = 0;
		foreach ($amacs as $amac) {
			$query = "SELECT Occupied FROM sensor WHERE A_MAC = :amac";
			$sth = $db->prepare($query);
			$sth->execute(array(':amac'=> $amac));
			$result = $sth->fetch(PDO::FETCH_ASSOC);
			if($result['Occupied'] == 1)
				$numSeating++;
		}

		$rows[] = $numSeating;
	}
	//Get information from 'arduino' and 'sensor' table
	//return Occupied, Last_Change_Time, A_MAC
	else if(isset($_POST['target']) && $_POST['target'] == 'seatInfo') 	
	{	
		$query = "SELECT Occupied, Last_Change_Time, A_MAC FROM sensor WHERE A_MAC = :amac";
		$sth = $db->prepare($query);
		$sth->execute(array(':amac'=> $_POST['amac']));
		$result = $sth->fetch(PDO::FETCH_NUM);

		if($sth->rowCount() == 0){
			$rows = array(0, 0);
		}else{
			$rows = $result;
			$rows[1] = strtotime($rows[1]);
		}
	}
	//Get all area names that match certain user by UID
	else if(isset($_POST['action']) && $_POST['action'] == 'areaName'){
		$uid = $_SESSION["Member_ID"];
		$query = "SELECT `Name`, `PI_MAC` FROM `pi` WHERE `For_Whom` = :uid";
		$sql = $db->prepare($query);
		$sql->execute(array(":uid"=> $uid));
		$sql_result = $sql->fetchAll(PDO::FETCH_ASSOC);

		foreach ($sql_result as $row) {
			$rows[] = array($row['Name'], $row['PI_MAC']);
		}
	}
	else if(isset($_POST['target']) && $_POST['target'] == 'Uid')
	{	
		$uid = $_SESSION["Member_ID"];
		$query = "SELECT `Model` FROM `Member` WHERE `Member_ID` = :uid";
		$sth = $db->prepare($query);
		$sth->execute(array(':uid'=> $uid));
		$result = $sth->fetch(PDO::FETCH_NUM);

		foreach ($result as $row) {
			$rows[] = $row;
		}
	}

	echo json_encode($rows);
?>