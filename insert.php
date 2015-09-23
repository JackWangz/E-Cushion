<?php
	include_once('connectDB.php');

//Group
if($_POST['target'] == 'map')
{
		$area = $_POST['area'];
		$data = $_POST['data'];

		
		$flag = 0;
		// print_r($data['group']);
		foreach ($data['group'] as $groupItem) {

			if($groupItem['no'] != $flag){
				$flag = $groupItem['no'];

				$check = $db->prepare("SELECT EXISTS(SELECT * FROM `pi_to_group` WHERE `G_ID` = :groupn AND `Pi_MAC` IN( SELECT `Pi_MAC` FROM `pi` WHERE `Name` = :areaName)) ");
				$check->execute(array(":areaName"=> $area, ":groupn"=> $groupItem['no']));
				$checkExist = $check->fetch(PDO::FETCH_NUM);

				//Check whether the group number already exist.
				if($checkExist[0] == 0){
					//Insert new group
					$updatePitoGroup = $db->prepare("INSERT INTO `pi_to_group`(`G_ID`, `Pi_MAC`) SELECT :groupn, `Pi_MAC` FROM `pi` WHERE `Name` = :areaName");
					$updatePitoGroup->execute(array(":groupn"=> $groupItem['no'], "areaName"=> $area));
				}
			}
		}


		// $updatePitoTable = $db->prepare("INSERT INTO `pi_to_table`(`T_ID`, `Pi_A_MAC`) SELECT :tablen, `Pi_A_MAC` FROM `pi` WHERE `Name` = :areaName");
		// $updatePitoTable->execute(array(":tablen"=> $tablen, "areaName"=> $area));

		// $updateTable = $db->prepare("INSERT INTO `table`(`T_ID`, `Arduino_Num`) VALUES (:tablen, :seatn)");
		// $updateTable->execute(array(":tablen"=> $tablen, ":seatn"=> $seatn));
		
		// for ($i = 0; $i < $seatn; $i++) { 
		// 	$query = "INSERT INTO `arduino`(`T_ID`, `A_ID`) VALUES ($tablen, $i + 1)";
		// 	mysql_query($query);
		// }	

}
//Pi
else if($_POST['target'] == 'pi')
{
	$areaName = $_POST['areaName'];
	$piMac = $_POST['piMac'];

	$check = $db->prepare("SELECT COUNT(*) FROM `pi` WHERE `Pi_MAC` = :pimac");
	$check->execute(array(":pimac"=> $piMac));
	$checkExist = $check->fetch(PDO::FETCH_NUM);
	if($checkExist[0] > 0) die("Pi MAC [$piMac] exist!");

	$updatePi = $db->prepare("INSERT INTO `Pi`(`Pi_MAC`, `Name`) SELECT :pimac, :area");
	$updatePi->execute(array(":pimac"=> $piMac, ":area"=> $areaName) );

}
//Arduino
else if($_POST['table_name'] == 'bind')
{
	$groupn = $_POST['groupn'];
	$amac = $_POST['amac'];

	$check = $db->prepare("SELECT COUNT(*) FROM `arduino` WHERE `A_MAC` = :amac");
	
	$check->execute(array(":amac"=> $amac));
	$checkExist = $check->fetch(PDO::FETCH_NUM);
	if($checkExist[0] > 0) die("Arduino MAC [$amac] exist!");

	$updateArduino = $db->prepare("INSERT INTO `arduino`(`A_MAC`) SELECT :amac");
	$updateArduino->execute(array(":amac"=> $amac) );

	$addAMACtoSensor = $db->prepare("INSERT INTO `sensor`(`A_MAC`) SELECT :amac");
	$addAMACtoSensor->execute(array(":amac"=> $amac) );

	$addAMACtoGroup = $db->prepare("INSERT INTO `group`(`G_ID`, `A_MAC`) SELECT :groupn, :amac");
	$addAMACtoGroup->execute(array(":groupn"=> $groupn, ":amac"=> $amac) );
	echo $amac;
}

?>






