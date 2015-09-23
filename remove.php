<?php
	include_once('connectDB.php');

	//Delete group
	if($_POST['target'] == 'group')
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
		$query3 = "DELETE FROM `pi_to_group` WHERE `Pi_MAC` IN(SELECT `Pi_MAC` FROM `pi` WHERE `Name`= :areaName)";
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

