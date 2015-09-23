<?php
$filearray = $_GET["f"];
$filename = explode(",", $filearray);
if (!isset($_SESSION)) { session_start(); }
$member_id = $_SESSION["Member_ID"];
$path="datas/".$member_id."/past_datas/";

if(count($filename)==1){
	$handle = @fopen($path.$filename[0], "r");
	$arr;
	if ($handle)
	{
	      while (!feof($handle))
	      {
	            $buffer = fgets($handle);
	            $split =  explode("=",$buffer);
	            $arr[$split[0]] = $split[1];
	      }
	}
	fclose($handle);
	echo json_encode($arr);
}
else{
	for($i=0;$i<count($filename);$i++){
		$handle = fopen($path.$filename[$i], "r");
		$arr;
		if ($handle)
		{
		      while (!feof($handle))
		      {
		            $buffer = fgets($handle);
		            $split =  explode("=",$buffer);
		            $arr[$split[0]] = $split[1];
		      }
		}
		fclose($handle);
		echo json_encode($arr);
		echo "~~~~~~~~~~";
	}
}
?>