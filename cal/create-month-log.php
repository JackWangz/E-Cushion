<?php
	require_once("../connectDB.php");
	$connection = $db;
	$root = "../datas/";
	$directories = glob($root . '/*' , GLOB_ONLYDIR);
	for($s = 0;$s < count($directories);$s++)
	{
		$tmp = explode('/',$directories[$s]);
		$ForWhom = end($tmp);
		$stmt = $connection->prepare("SELECT Model FROM `member` WHERE `Member_ID`='" . $ForWhom ."';");
		$stmt->execute();
		$relate = $stmt->fetch();
		$Model = $relate[0];
		if($Model == "餐廳")
		{
			$filePath = $directories[$s]."/past_datas";
			$date = date("y-m");
			$txts = glob($filePath."/" . $date . "-**.txt");

			$leave = array();
			$come = array();
			$eating_time = array();
			$G_ID_array = array();
			$popular_group = array();
			$avg_eating_time = -1;
			$turn_rate = -1;
			$temp_array = array("avg_temp" => -1);
			$popular_tmp_G_ID = -1;

			if(!is_dir($filePath))
			{//如果該目錄不存在 則建立
				if(!mkdir($filePath,"0777"))
				{
					die("創建past_data資料夾時失敗!");
				}
			}

			for($i = 0; $i < count($txts);$i++)
			{
				$fileHandle = fopen($txts[$i], "r");
				$counter = 0;
				while (($line = fgets($fileHandle)) !== false) 
				{
					list($key,$value) = explode("=", $line);
					if($value == "-1")
						continue;
					switch($counter)
					{
						case 0://turn_rate
							$turn_rate += $value;
						break;
						case 1://eating_Time
							$value = json_decode($value, true);
							//var_dump($value);
							foreach($value as $k=>$v)
							{
								if(!array_key_exists($k,$eating_time))
								{
									$eating_time[$k] = $v;
								}else
								{
									$eating_time[$k] += $v;
								}
							}
							break;
						case 2://avg_eating_time
							$value = str_replace("min", "", $value);
							$avg_eating_time += (int)$value;
							break;
						case 3://come_and_leave
							$value = json_decode($value, true);
							foreach($value[0] as $k=>$v)
							{
								if(!array_key_exists($k,$come))
								{
									$come[$k] = (int)$v;
								}else
								{
									$come[$k] += (int)$v;
								}
							}
							foreach($value[1] as $k=>$v)
							{
								if(!array_key_exists($k,$leave))
								{
									$leave[$k] = (int)$v;
								}else
								{
									$leave[$k] += (int)$v;
								}
							}
							break;
						case 4://G_ID
							$arr = json_decode($value, true);
							foreach($arr as $k=>$v)
							{
								if(!array_key_exists($k,$G_ID_array))
								{
									$G_ID_array[$k] = $v;
								}else
								{
									$G_ID_array[$k] += $v;
								}
							}
							break;
						case 5://最熱門桌號
							$value = (int)$value;
							if(!array_key_exists($value,$popular_group))
							{
								$popular_group[$value] = 1;
							}else
							{
								$popular_group[$value]++;
							}
							break;
						case 6://temp_array
							$arr = json_decode($value, true);
							$temp_array["avg_temp"] += $arr["avg_temp"];
							if(count($arr) > 1)
							{
								for($j = 0;$j < count($arr) - 1;$j++)
								{
									array_push($temp_array, $arr[$j]);
								}
							}
							break;
						default:
							break;
					}
					$counter++;
				}
				fclose($fileHandle);
			}

			$fileName = $filePath."/avg-month-".date("y-m").".txt";
			$file = fopen($fileName,"w");
			if(count($txts) == 0)
			{
				$turn_rate = -1;
				$turn_rate = $turn_rate/count($txts);
				foreach ($eating_time as $key => $value) {
					$eating_time[$key] = -1;
				}
				foreach ($come as $key => $value) {
					$come[$key] = -1;
				}
				foreach ($leave as $key => $value) {
					$leave[$key] = -1;
				}
				foreach ($G_ID_array as $key => $value) {
					$G_ID_array[$key] = -1;
				}
				$popular_tmp_G_ID = -1;
				$avg_eating_time = -1;
			}else
			{
				$turn_rate = $turn_rate/count($txts);
				foreach ($eating_time as $key => $value) {
					$eating_time[$key] = round($value/count($txts),2);
				}
				foreach ($come as $key => $value) {
					$come[$key] = round($value/count($txts),2);
				}
				foreach ($leave as $key => $value) {
					$leave[$key] = round($value/count($txts),2);
				}
				foreach ($G_ID_array as $key => $value) {
					$G_ID_array[$key] = round($value/count($txts));
				}
				foreach ($popular_group as $key => $value) {
					if($popular_tmp_G_ID == -1)
						$popular_tmp_G_ID = $key;
					else
						if($value >= $popular_group[$popular_tmp_G_ID])
							$popular_tmp_G_ID = $key;
				}
				
				$avg_eating_time = round($avg_eating_time/count($txts),2);
			}
			fputs($file, "turn_rate=".json_encode($turn_rate)."\r\n");
			fputs($file, "eating_Time=".json_encode($eating_time)."\r\n");
			fputs($file, "avg_eating_time=".json_encode($avg_eating_time)."min\r\n");
			$come_and_leave = array($come,$leave);
			fputs($file, "come_and_leave=".json_encode($come_and_leave)."\r\n");	
			fputs($file, "G_ID=".json_encode($G_ID_array)."\r\n");
			fputs($file, "最熱門桌號=".json_encode($popular_tmp_G_ID)."\r\n");
			fputs($file, "temp_array=".json_encode($temp_array)."\r\n");
			fputs($file, "更新時間=".json_encode(date("Y-m-d H:i:s"))."\r\n");
			fclose($file);
		}
		else if($Model == "計程車")
		{
			$filePath = $directories[$s]."/past_datas";
			$date = date("y-m");
			$txts = glob($filePath."/" . $date . "-**.txt");

			$leave = array();
			$come = array();
			$sit_time = array();
			$popular_group = array();
			$avg_sitting_time = 0;
			$people = array();
			$temp_array = array("avg_temp" => -1);
			$driver = array();
			$tired_array = array();

			if(!is_dir($filePath))
			{//如果該目錄不存在 則建立
				if(!mkdir($filePath,"0777"))
				{
					die("創建past_data資料夾時失敗!");
				}
			}

			for($i = 0; $i < count($txts);$i++)
			{
				$fileHandle = fopen($txts[$i], "r");
				$counter = 0;
				while (($line = fgets($fileHandle)) !== false) 
				{
					list($key,$value) = explode("=", $line);
					if($value == "-1")
						continue;
					switch($counter)
					{
						case 0://people
							$value = json_decode($value, true);
							foreach($value as $k=>$v)
							{
								if(!array_key_exists($k,$people))
								{
									$people[$k] = $v;
								}else
								{
									$people[$k] += $v;
								}
							}
							break;
						case 1://sit_Time
							$value = json_decode($value, true);
							//var_dump($value);
							foreach($value as $k=>$v)
							{
								if(!array_key_exists($k,$sit_time))
									{
									$sit_time[$k] = $v;
								}else
								{
									$sit_time[$k] += $v;
								}
							}
							break;
							case 2://avg_sitting_time
							$value = str_replace("min", "", $value);
							$avg_sitting_time += (int)$value;
							break;
						case 3://come_and_leave
							$value = json_decode($value, true);
							foreach($value[0] as $k=>$v)
							{
								if(!array_key_exists($k,$come))
								{
									$come[$k] = (int)$v;
								}else
								{
									$come[$k] += (int)$v;
								}
							}
							foreach($value[1] as $k=>$v)
							{
								if(!array_key_exists($k,$leave))
								{
									$leave[$k] = (int)$v;
								}else
								{
									$leave[$k] += (int)$v;
								}
							}
							break;
						case 4://司機
							$arr = json_decode($value, true);
							foreach($arr as $k=>$v)
							{
								$v = str_replace("\"", "", $v);
								$v = str_replace("\r\n", "", $v);
								if(!array_key_exists($k,$driver))
								{
									$driver[$k] = $v;
								}
							}
							break;
						case 5://超時
							$arr = json_decode($value, true);
							//var_dump($v);
									
							foreach($arr as $k=>$v)
							{
								if(count($v) > 0)
								{
									if(!array_key_exists($k,$tired_array))
									{
										$tired_array[$k] = $v;
									}else
									{
										foreach($v as $key=>$value)
										{
											array_push($tired_array[$k],$value);
										}
									}
								}else
								{
									if(!array_key_exists($k,$tired_array))
									{
										$tired_array[$k] = $v;
									}
								}
							}
							
							break;
						case 6://temp_array
							//var_dump($value);
							$arr = json_decode($value, true);
							if(count($arr) > 0)
								$temp_array["avg_temp"] += $arr["avg_temp"];
							if(count($arr) > 1)
							{
								for($l = 0;$l < count($arr) - 1;$l++)
								{
									array_push($temp_array, $arr[$l]);
								}
							}
							break;
						default:
							break;
					}
					$counter++;
				}
				fclose($fileHandle);
			}

			$fileName = $filePath."/avg-month-".date("m").".txt";
			$file = fopen($fileName,"w");
			if(count($txts) == 0)
			{
				foreach ($people as $key => $value) {
					$people[$key] = -1;
					}
				foreach ($eating_time as $key => $value) {
					$sit_time[$key] = -1;
				}
				foreach ($come as $key => $value) {
					$come[$key] = -1;
					}
				foreach ($leave as $key => $value) {
					$leave[$key] = -1;
				}
				$avg_sitting_time = -1;
			}else
			{
				foreach ($people as $key => $value) {
					$people[$key] = round($value/count($txts),2);
				}
				foreach ($eating_time as $key => $value) {
					$sit_time[$key] = round($value/count($txts),2);
				}
				var_dump($come);
				foreach ($come as $key => $value) {
					$come[$key] = round($value/count($txts),2);
				}
				foreach ($leave as $key => $value) {
					$leave[$key] = round($value/count($txts),2);
				}
				
				$avg_sitting_time = round($avg_sitting_time/count($txts),2);
			}
			var_dump($popular_group);
			fputs($file, "people=".json_encode($people)."\r\n");
			fputs($file, "sit_time=".json_encode($sit_time)."\r\n");
			fputs($file, "avg_sitting_time=".json_encode($avg_sitting_time)."min\r\n");
			$come_and_leave = array($come,$leave);
			fputs($file, "come_and_leave=".json_encode($come_and_leave)."\r\n");	
			fputs($file, "司機=".json_encode($driver)."\r\n");
			fputs($file, "超時=".json_encode($tired_array)."\r\n");
			fputs($file, "temp_array=".json_encode($temp_array)."\r\n");
			fputs($file, "更新時間=".json_encode(date("Y-m-d H:i:s")));
			fclose($file);
		}
	}
	echo "finish";
?>