<?php
	$root = "../datas/";
	$directories = glob($root . '/*' , GLOB_ONLYDIR);
	for($i = 0; $i < count($directories);$i++)
	{
		$dirPath = $directories[$i]."/pi";
		echo $dirPath."<br>";
		$txts = glob($dirPath."/*.txt");
		for($j = 0; $j < count($txts);$j++)
		{
			echo $txts[$j]."<br>";
			$fileHandle = fopen($txts[$j], "w");

			fclose($fileHandle);
		}
	}
?>