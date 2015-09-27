<?php
	include_once('connectDB.php');
    if (!isset($_SESSION)) { session_start(); }
    if (!isset($_SESSION["Member_ID"])) {
        header('Location: ./users/sign_in.php');
        exit();
    }
	//Delete area
	if($_POST['target'] == 'area'){
		$pimac = $_POST['pimac'];
		$amac  = $_POST['amac'];
		$areaName = $_POST['areaName'];
		$path  = 'data/' . $areaName . '.json';

		foreach ($amac as $item) {
			$query = "DELETE FROM `sensor` WHERE `A_MAC` = :amac";
			$sth = $db->prepare($query);
			$sth->execute(array(':amac'=> $item));

			$query = "DELETE FROM `arduino` WHERE `A_MAC` = :amac";
			$sth = $db->prepare($query);
			$sth->execute(array(':amac'=> $item));

			$query = "DELETE FROM `group` WHERE `A_MAC` = :amac";
			$sth = $db->prepare($query);
			$sth->execute(array(':amac'=> $item));
		}

		$query = "DELETE FROM `pi` WHERE `PI_MAC` = :pimac";
		$sth = $db->prepare($query);
		$sth->execute(array(':pimac'=> $pimac));

		$query = "DELETE FROM `pi_to_group` WHERE `PI_MAC` = :pimac";
		$sth = $db->prepare($query);
		$sth->execute(array(':pimac'=> $pimac));

		unlink($path);

	}
	//Delete group
	else if($_POST['target'] == 'group')
	{	
		$groupn = $_POST['groupn'];
		$areaName = $_POST['areaName'];
		$amac = $_POST['amac'];

		
		foreach ($amac as $amacItem) {
			//Delete arduino & sensor
			$query1 = "DELETE a, s FROM `arduino` a JOIN `sensor` s ON a.A_MAC = s.A_MAC Where a.A_MAC = :amac";
			$sth = $db->prepare($query1);
			$sth->execute(array(':amac'=> $amacItem));
			//Delete group
			$query2 = "DELETE FROM `group` WHERE `A_MAC` = :amac";
			$sth = $db->prepare($query2);
			$sth->execute(array(':amac'=> $amacItem));
		}

		//Delete pi_to_group
		$query3 = "DELETE FROM `pi_to_group` WHERE `PI_MAC` IN(SELECT `PI_MAC` FROM `pi` WHERE `Name`= :areaName)";
		$sth = $db->prepare($query3);
		$sth->execute(array(':areaName'=> $areaName));

		
	}
	//Delete seat
	elseif ($_POST['target'] == 'seat')
	{
		$amac = $_POST['amac'];

		$query1 = "DELETE a, s FROM `arduino` a JOIN `sensor` s ON a.A_MAC = s.A_MAC Where a.A_MAC = :amac";
		$sth = $db->prepare($query1);
		$sth->execute(array(':amac'=> $amac));

		$query2 = "DELETE FROM `group` Where `A_MAC` = :amac";
		$sth = $db->prepare($query2);
		$sth->execute(array(':amac'=> $amac));
	}
?>

