<?php
	require_once("../connectDB.php");
	require_once("calcAPI.php");
	header("Content-Type:text/html; charset=utf-8");

	$calcAPI = new calcAPI;
	$root = "../datas/";
	if(!is_dir($root))
	{//如果該目錄不存在 則建立
		if(!mkdir($root,"0777"))
		{
			die("創建".$root."時失敗!");
		}
	}
	$dir = "";
	$connection = $db;
	$stmt  = $connection->prepare("SELECT * FROM `log` WHERE `Timestamp` BETWEEN '".date("Y-m-d")."' AND '" . date("Y-m-d",strtotime("+1 days")) . "' ORDER BY `log`.`log_id` ASC");
	//echo "SELECT * FROM `log` WHERE `Timestamp` BETWEEN '".date("Y-m-d")."' AND '" . date("Y-m-d",strtotime("+1 days")) . "' ORDER BY `log`.`log_id` ASC";
	$stmt->execute();
	$result = $stmt->fetchAll(PDO::FETCH_ASSOC);

	$logs = $result;
	$length = $stmt->rowCount();
	// echo $length."<br>";
	for($i = 0;$i < $length;$i++)
	{
		$sensor_PI_Name = "-1";
		//table = table的名字 key = 主鍵 key_value = 主鍵的值
		list($table,$rest) = explode(":", $result[$i]["Target"],2);
		list($key,$key_value) = explode("-", $rest,2);
		// echo $table."<br>";
		if($table == "sensor")
		{
			$stmt = $connection->prepare("SELECT G_ID FROM `group` WHERE `" . $key . "`='" . $key_value . "';");
			$stmt->execute();
			$relate = $stmt->fetch();
			
			$stmt = $connection->prepare("SELECT PI_MAC FROM `pi_to_group` WHERE `G_ID`='" . $relate[0] ."';");
			$stmt->execute();
			$relate = $stmt->fetch();
			
			$stmt = $connection->prepare("SELECT Name FROM `pi` WHERE `PI_MAC`='" . $relate[0] ."';");
			$stmt->execute();
			$nameResult = $stmt->fetch();
			$sensor_PI_Name = $nameResult[0];

			$stmt = $connection->prepare("SELECT For_Whom FROM `pi` WHERE `PI_MAC`='" . $relate[0] ."';");
			$stmt->execute();
			$relate = $stmt->fetch();
			$dir = $relate[0];
			//echo $relate[0]."<br>";

		}
		else if($table == "pi")
		{
			$stmt = $connection->prepare("SELECT For_Whom FROM `pi` WHERE `" . $key . "`='" . $key_value ."';");
			$stmt->execute();
			$relate = $stmt->fetch();
			$dir = $relate[0];
			
			$stmt = $connection->prepare("SELECT Name FROM `pi` WHERE `". $key ."`='" . $key_value ."';");
			$stmt->execute();
			$nameResult = $stmt->fetch();
			$sensor_PI_Name = $nameResult[0];
		}
		else
		{
			die("傳入未知的Log Table?");
		}

		if(!is_dir($root.$dir))
		{//如果該目錄不存在 則建立
			if(!mkdir($root.$dir,"0777"))
			{
				die("創建".$root.$dir."時失敗!");
			}
		}

		//將資料存入$root.$dir
		if($table == "sensor")
		{
			$dirPath = $root.$dir."/sensor";
			if(!is_dir($dirPath))
			{//如果該目錄不存在 則建立
				if(!mkdir($dirPath,"0777"))
				{
					die("創建sensor資料夾時失敗!");
				}
			}
			$dirPath = $dirPath."/".$sensor_PI_Name;
				/*var_dump($dirPath);
				echo "<br>";*/
			if(!is_dir($dirPath))
			{//如果該目錄不存在 則建立
				if(!mkdir($dirPath,"0777"))
				{
					die("創建".$dirPath."資料夾時失敗!");
				}
			}
			
			
			$replaced_a_mac = str_replace(":","-",$key_value);
			$fileName = $dirPath."/".$replaced_a_mac.".txt";
			
			echo $fileName."<br>";
			
			$file = fopen($fileName,"a");

			$valueArray = explode(",", $logs[$i]['Value']);

			$value = explode(":",$valueArray[0]);
			$time = explode(":",$valueArray[1],2);
			// echo $time[1]."<br>";
			fputs($file,$value[1].";".$key_value.";".$time[1]."\r\n");
			fclose($file);
		}
		else if($table == "pi")
		{
			$dirPath = $root.$dir."/pi";
			if(!is_dir($dirPath))
			{//如果該目錄不存在 則建立
				if(!mkdir($dirPath,"0777"))
				{
					die("創建pi資料夾時失敗!");
				}
			}
			$dirPath = $dirPath."/".$sensor_PI_Name;
			if(!is_dir($dirPath))
			{//如果該目錄不存在 則建立
				if(!mkdir($dirPath,"0777"))
				{
					die("創建".$dirPath."資料夾時失敗!");
				}
			}
			$replaced_a_mac = str_replace(":","-",$key_value);
			$fileName = $dirPath."/".$replaced_a_mac.".txt";
			$file = fopen($fileName,"a");

			$value = explode(":",$logs[$i]['Value']);
			fputs($file,$value[1].";".$key_value.";".$logs[$i]['Timestamp']."\r\n");
			fclose($file);
		}
		//-------------
	}
	//刪除資料庫資料

	
	
	//做資料運算?
	$directories = glob($root . '/*' , GLOB_ONLYDIR);
	for($i = 0; $i < count($directories);$i++)
	{
		$array = explode('/',$directories[$i]);
		$ForWhom = end($array);
		//echo $ForWhom;
		$stmt = $connection->prepare("SELECT Model FROM `member` WHERE `Member_ID`='" . $ForWhom ."';");
		$stmt->execute();
		$relate = $stmt->fetch();
		$Model = $relate[0];

		if($Model == "餐廳")
		{
			$dirPath = $directories[$i]."/past_datas";
			if(!is_dir($dirPath))
			{//如果該目錄不存在 則建立
				if(!mkdir($dirPath,"0777"))
				{
					die("創建past_data資料夾時失敗!");
				}
			}
			//Do the job
			$fileName = $dirPath."/".date("y-m-d").".txt";
			$file = fopen($fileName,"w");
			
			//計算翻桌率
			$turn_rate = $calcAPI->calc_turn_table_rate($directories[$i]."/sensor");
			fputs($file, "turn_rate=".json_encode($turn_rate)."\r\n");

			//用餐時間
			$eatingTime = $calcAPI->calc_everyone_eating_time($directories[$i]."/sensor");
			fputs($file, "eating_Time=".json_encode($eatingTime)."\r\n");

			//平均用餐時間
			$avg_eating_time = $calcAPI->calc_avg_eating_time($directories[$i]."/sensor");
			fputs($file, "avg_eating_time=".json_encode($avg_eating_time)."min\r\n");

			//計算來店用餐時間和離開時間
			$come_and_leave = $calcAPI->calc_coming_and_leaving_time($directories[$i]."/sensor");
			fputs($file, "come_and_leave=".json_encode($come_and_leave)."\r\n");
			//熱門座位
			$hot_seat = $calcAPI->calc_hot_seat($directories[$i]."/sensor");
			if( empty( $hot_seat ) )
			{
			    fputs($file,"最熱門座位=No seats!\r\n");
			}
			else
			{
				$seats = array();
				while (list($key, $val) = each($hot_seat)) {

					$stmt = $connection->prepare("SELECT G_ID FROM `group` WHERE `A_MAC`='" . $key ."';");
					$stmt->execute();
					$No_Table = $stmt->fetch();
					$No_Table = $No_Table[0];
					if(!array_key_exists($No_Table,$seats))
				    {//沒有 建立key
				    	$seats[$No_Table] = $val;
					}
					else
					{//有 ++
				    	$seats[$No_Table]+=$val;
					}
				    //fputs($file, "$key => $val\r\n");
				}	
				fputs($file, "t_id=".json_encode($seats)."\r\n");
				$larget_key = array_search(max($seats), $seats);
				fputs($file, "最熱門桌號=".json_encode($larget_key)."\r\n");
				//fputs($file, "最熱門桌號 : ".$larget_key."桌\r\n");
			}
			$temp_array = $calcAPI->calc_pi_overheat($directories[$i]."/pi");
			fputs($file, "temp_array=".json_encode($temp_array)."\r\n");


			fputs($file, "更新時間=".json_encode(date("Y-m-d H:i:s")));
			
			fclose($file);
		}
		else if($Model == "計程車")
		{
			$PI_Names = glob($directories[$i].'/sensor/*' , GLOB_ONLYDIR);
			$driver_array = array();
			$over_time_array = array();
			$people = array();
			$sit_time = array();
			$avg_sitting_time = 0;
			$come = array();
			$leave = array();
			$temp_array = array();
			for($j = 0;$j < count($PI_Names);$j++)//將計程車資料夾底下的sensor資料夾依PI_NAME做分類 找出每台車的駕駛
			{
				//var_dump($directories[$i]."/sensor/".$PI_Names[$j]);
				$driver = $calcAPI->calc_taxi_driver($PI_Names[$j]);
				if($driver == -1)
				{
					//echo "driver not working!";
					continue;
				}
				$driver = str_replace(":","-",$driver);
				
				$tmp = explode('/',$PI_Names[$j]);
				$driver_array[end($tmp)] = $driver;
				
				$over_time_array[$driver] = $calcAPI->calc_driver_tired($PI_Names[$j]."/".$driver.".txt");
				//計算上車一次幾個人
				$tmp = $calcAPI->calc_taxi_people($PI_Names[$j]);
				foreach($tmp as $k=>$v)
				{
					if(!array_key_exists($k,$people))
					{
						$people[$k] = $v;
					}else
					{
						$people[$k] += $v;
					}
				}
				//座多久
				$tmp = $calcAPI->calc_everyone_eating_time($PI_Names[$j]);
				foreach($tmp as $k=>$v)
				{
					if(!array_key_exists($k,$sit_time))
					{
						$sit_time[$k] = $v;
					}else
					{
						$sit_time[$k] += $v;
					}
				}
				//平均座多久
				$avg_sitting_time += $calcAPI->calc_avg_eating_time($PI_Names[$j]);
				//計算上車時間和離開時間
				$tmp = $calcAPI->calc_coming_and_leaving_time($PI_Names[$j]);
				foreach($tmp[0] as $k=>$v)
				{
					if(!array_key_exists($k,$sit_time))
					{
						$come[$k] = $v;
					}else
					{
						$come[$k] += $v;
					}
				}
				foreach($tmp[1] as $k=>$v)
				{
					if(!array_key_exists($k,$sit_time))
					{
						$leave[$k] = $v;
					}else
					{
						$leave[$k] += $v;
					}
				}
				$tmp = $calcAPI->calc_pi_overheat($directories[$i]."/pi");
				foreach($tmp as $k=>$v)
				{
					if(!array_key_exists($k,$sit_time))
					{
						$temp_array[$k] = $v;
					}else
					{
						$temp_array[$k] += $v;
					}
				}
				
			}
			$dirPath = $directories[$i]."/past_datas";
			if(!is_dir($dirPath))
			{//如果該目錄不存在 則建立
				if(!mkdir($dirPath,"0777"))
				{
					die("創建past_data資料夾時失敗!");
				}
			}
			//Do the job
			$fileName = $dirPath."/".date("y-m-d").".txt";
			$file = fopen($fileName,"w");
			
			fwrite($file, "people=".json_encode($people)."\r\n");

			fwrite($file, "sit_time=".json_encode($sit_time)."\r\n");

			fwrite($file, "avg_sitting_time=".json_encode($avg_sitting_time)."min\r\n");

			$come_and_leave = array($come,$leave);
			fwrite($file, "come_and_leave=".json_encode($come_and_leave)."\r\n");

			fwrite($file, "司機=".json_encode($driver_array)."\r\n");
			fwrite($file, "超時=".json_encode($over_time_array)."\r\n");

			fwrite($file, "temp_array=".json_encode($temp_array)."\r\n");


			fwrite($file, "更新時間=".json_encode(date("Y-m-d H:i:s")));
			
			fclose($file);
		}
	}
	
?>