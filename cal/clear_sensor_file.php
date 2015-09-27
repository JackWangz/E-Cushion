<?php
	$root = "../datas/";
	$directories = glob($root . '/*' , GLOB_ONLYDIR);
	for($i = 0; $i < count($directories);$i++)
	{
		$dirPath = $directories[$i]."/sensor";
		echo $dirPath."<br>";
		$txts = glob($dirPath."/*.txt");
		if(count($txts) > 0)
		{
			for($j = 0; $j < count($txts);$j++)
			{
				echo $txts[$j]."<br>";
				$fileHandle = fopen($txts[$j], "w");

				fclose($fileHandle);
			}			
		}
		else
		{
			$cars = glob($dirPath . '/*' , GLOB_ONLYDIR);
			for($s = 0 ; $s < count($cars);$s++)
			{
				$txts = glob($cars[$s]."/*.txt");
				var_dump($txts);
				for($j = 0; $j < count($txts);$j++)
				{
					$fileHandle = fopen($txts[$j], "w");

					fclose($fileHandle);
				}	
			}
		}
	}
?>