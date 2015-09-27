<?php
	if (!isset($_SESSION)) { session_start(); }
	if (!isset($_SESSION["Member_ID"])) {
	    header('Location: ./users/sign_in.php');
	    exit();
	}
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

				$check = $db->prepare("SELECT EXISTS(SELECT * FROM `pi_to_group` WHERE `G_ID` = :groupn AND `PI_MAC` IN( SELECT `PI_MAC` FROM `pi` WHERE `Name` = :areaName)) ");
				$check->execute(array(":areaName"=> $area, ":groupn"=> $groupItem['no']));
				$checkExist = $check->fetch(PDO::FETCH_NUM);

				//Check whether the group number already exist.
				if($checkExist[0] == 0){
					//Insert new group
					$updatePitoGroup = $db->prepare("INSERT INTO `pi_to_group`(`G_ID`, `PI_MAC`) SELECT :groupn, `PI_MAC` FROM `pi` WHERE `Name` = :areaName");
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
	$uid = $_SESSION["Member_ID"];

	$check = $db->prepare("SELECT COUNT(*) FROM `pi` WHERE `PI_MAC` = :pimac");
	$check->execute(array(":pimac"=> $piMac));
	$checkExist = $check->fetch(PDO::FETCH_NUM);
	if($checkExist[0] > 0) die("Pi MAC [$piMac] exist!");

	$updatePi = $db->prepare("INSERT INTO `Pi`(`PI_MAC`, `Name`, `For_Whom`) SELECT :pimac, :area, :uid");
	$updatePi->execute(array(":pimac"=> $piMac, ":area"=> $areaName, ":uid"=> $uid) );

}
//Arduino
else if($_POST['target'] == 'bind')
{
	$groupn = $_POST['groupn'];
	$amac = $_POST['amac'];

	$check = $db->prepare("SELECT COUNT(*) FROM `arduino` WHERE `A_MAC` = :amac");
	
	$check->execute(array(":amac"=> $amac));
	$checkExist = $check->fetch(PDO::FETCH_NUM);
	if($checkExist[0] > 0) die("Arduino MAC [$amac] exist!");
	
	$addAMACtoGroup = $db->prepare("INSERT INTO `group`(`G_ID`, `A_MAC`) SELECT :groupn, :amac");
	$addAMACtoGroup->execute(array(":groupn"=> $groupn, ":amac"=> $amac) );

	$updateArduino = $db->prepare("INSERT INTO `arduino`(`A_MAC`) SELECT :amac");
	$updateArduino->execute(array(":amac"=> $amac) );

	$addAMACtoSensor = $db->prepare("INSERT INTO `sensor`(`A_MAC`) SELECT :amac");
	$addAMACtoSensor->execute(array(":amac"=> $amac) );
}

?>






