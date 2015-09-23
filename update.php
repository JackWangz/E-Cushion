<?php
	include_once('connectDB.php');	

	$amac = $_POST['amac'];

	$query = $db->prepare("SELECT `Occupied` FROM `sensor` WHERE `A_MAC` = :amac");
	$query->execute(array(':amac'=> $amac));
	$row = $query->fetch(PDO::FETCH_ASSOC);
	if($query->rowCount() > 0){ 
		$row['Occupied'] == 0 ? $valueTochange = 1 : $valueTochange = 0 ;
		$query = $db->prepare("UPDATE `sensor` SET `Occupied`= :value WHERE `A_MAC` = :amac");
		$query->execute(array(':amac'=> $amac, ':value'=> $valueTochange));
	}
?>