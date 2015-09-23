<?php
		$dbc=mysql_connect("localhost","root","1234") or die("link fail");
	mysql_select_db("db") or die("select db fail");
	$insert_Arduino="INSERT INTO Arduino(A_MAC,CPU_TEMPERATURE,FOR_WHOM) VALUE('".$_POST["A_MAC_for_Arduino"]."','".$_POST["CPU_TEMPERATURE"]."','"."$_POST[FOR_WHOM]"."')";
	$insert_Switch_sensor="INSERT INTO Switch_sensor(A_MAC,OCCUPIED,LAST_CHANGE) VALUE('".$_POST["A_MAC_for_Switch_sensor"]."','".$_POST["OCCUPIED"]."','"."$_POST[LAST_CHANGE]"."')";
	
	$result_Arduino= mysqli_query($dbc,$insert_Arduino) or die('fail..');
	$result_Switch_sensor=mysqli_query($dbc,$insert_Switch_sensor) or die('fail..');
	
	echo "success!";
	mysqli_close($dbc);
?>