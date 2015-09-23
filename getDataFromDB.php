<?php
	if (!isset($_SESSION)) { session_start(); }
	include_once('connectDB.php');

	$rows = array();
	//Arduino
	if(isset($_POST['table_name']) && $_POST['table_name'] == 0)
	{
		$sql = 'SELECT * FROM `Arduino`';

		$result = mysql_query($sql);
		while($r = mysql_fetch_assoc($result)) {
	    	$rows[] = $r;
		}
	}
	//Sensor
	else if(isset($_POST['table_name']) && $_POST["table_name"] == 1)
	{
		$A_MAC = $_POST["select"];
		$A_MAC = str_replace("_", " ", $A_MAC);
		$sql = "SELECT * FROM `Switch_sensor` WHERE `A_MAC` = '" . $A_MAC . "'";

		$result = mysql_query($sql);
		while($r = mysql_fetch_assoc($result)) {
	    	$rows[] = $r;
		}
	}

	//Update tables & seats information
	else if(isset($_POST['table_name']) && $_POST["table_name"] == 2) 
	{
		//first, get the number of every single table
		$query = "SELECT `T_ID` FROM `table` WHERE `T_ID` IN(SELECT `T_ID` FROM `pi_to_table` WHERE `Pi_MAC` IN(SELECT `Pi_MAC` FROM `pi` WHERE `Name` = :areaName)) ORDER BY `T_ID` ASC";
		$sql = $db->prepare($query);
		$sql->execute(array(":areaName"=> $_POST['area']));
		$sql_result = $sql->fetchAll(PDO::FETCH_ASSOC);

		//second, search for all seats' number belong to each tables' number
		foreach ($sql_result as $result) {
			$tablen = $result['T_ID'];
			$seats = array();
			$query = "SELECT * FROM `arduino` WHERE `T_ID` = :tablen AND `T_ID` IN (SELECT `T_ID` FROM `pi_to_table` WHERE `Pi_MAC` IN( SELECT `Pi_MAC` FROM `pi` WHERE `Name` = :areaName ) ) ORDER BY `arduino`.`A_ID` ASC";
			$sql2 = $db->prepare($query);
			$sql2->execute(array(":tablen"=> $tablen ,":areaName"=> $_POST['area']) );

			while($seat = $sql2->fetch(PDO::FETCH_ASSOC)){
				//check whether the Arduino(Seat) is bound;
				if(is_numeric($seat['A_MAC'])){
				  	$seats[] = array($seat['A_ID'], 0);
				}else{
					$sql = "SELECT `Occupied` FROM `sensor` WHERE `A_MAC` = :amac AND `A_MAC` IN( SELECT `A_MAC` FROM `arduino` WHERE `T_ID` IN( SELECT `T_ID` FROM `pi_to_table` WHERE `Pi_MAC` IN( SELECT `Pi_MAC` FROM `pi` WHERE `Name` = :areaName ) ) )";
					$sql_result = $db->prepare($sql);
					$sql_result->execute(array(":amac"=> $seat['A_MAC'] ,":areaName"=> $_POST['area']));
					$occupied = $sql_result->fetch(PDO::FETCH_ASSOC);
					$seats[] = array($seat['A_ID'], $occupied['Occupied']);
				}
			}
			$row = array($tablen, $seats);
			$rows[] = $row;
		}
	}
	//Get information from 'arduino' and 'sensor' table
	//return Occupied, Last_Change_Time
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
	else if(isset($_POST['action']) && $_POST['action'] == 'areaName'){
		$uid = $_SESSION["Member_ID"];
		$query = "SELECT `Name` FROM `pi` WHERE `For_Whom` = :uid";
		$sql = $db->prepare($query);
		$sql->execute(array(":uid"=> $uid));
		$sql_result = $sql->fetchAll(PDO::FETCH_ASSOC);

		foreach ($sql_result as $row) {
			$rows[] = $row['Name'];
		}
	}
	echo json_encode($rows);
?>