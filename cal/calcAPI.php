<?php

class calcAPI
{
	public $overTime = 600;
	function __construct() {
	       	
	   	}
	//restaurant
	//計算每人用餐時間
	public function calc_everyone_eating_time($filePath)
	{
		//30m 60m 90m 120m >120m
		$eatingTime = array('30m' => 0,'60m' => 0,'90m' => 0,'120m' => 0,'>120m' => 0);
		$txts = glob($filePath."/*.txt");
		//echo "filecounts".$filePath;

		for($i = 0; $i < count($txts);$i++)
		{
			//echo "filePath = ".$txts[$i];
			$fileHandle = fopen($txts[$i], "r");
			if ($fileHandle) 
			{
				$start_eating_time = "0";
				$counter = 1;
			    while (($line = fgets($fileHandle)) !== false) {
			        list($occupied,$a_mac,$time_stamp) = explode(";", $line, 3);
			        if($occupied == 1)
			        {//此行是有人坐上去之後傳入的資料 記錄下他坐下的時間
			        	$start_eating_time = $time_stamp;
			        }
			        else if($occupied == 0)
			        {//此行是在上面的人離開後傳入的資料 記錄他在座的時間 並將start_eating_time重置
			        	$during = (int)(strtotime($time_stamp) - strtotime($start_eating_time))/ (60);//單位為m鐘
			        	$start_eating_time = "0";
			        	if($during <= 30)
			        	{
			        		$eatingTime['30m']++;
			        	}else if($during > 30 && $during <= 60)
			        	{
			        		$eatingTime['60m']++;
			        	}else if($during > 60 && $during <= 120)
			        	{
			        		$eatingTime['90m']++;
			        	}else if($during <= 120)
			        	{
			        		$eatingTime['120m']++;
			        	}
			        }
			        $counter++;
			    }

			    fclose($fileHandle);
			} else {
			    die("讀取".$fileHandle."出現錯誤!");
			} 
		}
		return $eatingTime;
	}

	//計算每人平均用餐時間
	public function calc_avg_eating_time($filePath)
	{
		$total_eatingTime = 0;
		$counter = 0;
		$txts = glob($filePath."/*.txt");
		//echo "filecounts".$filePath;

		for($i = 0; $i < count($txts);$i++)
		{
			//echo "filePath = ".$txts[$i];
			$fileHandle = fopen($txts[$i], "r");
			if ($fileHandle) 
			{
				$start_eating_time = "0";
			    while (($line = fgets($fileHandle)) !== false) {
			        list($occupied,$a_mac,$time_stamp) = explode(";", $line, 3);
			        if($occupied == 1)
			        {//此行是有人坐上去之後傳入的資料 記錄下他坐下的時間
			        	$start_eating_time = $time_stamp;
			        }
			        else if($occupied == 0)
			        {//此行是在上面的人離開後傳入的資料 記錄他在座的時間 並將start_eating_time重置
			        	$during = (int)(strtotime($time_stamp) - strtotime($start_eating_time))/ (60);//單位為m鐘
			        	$start_eating_time = "0";
			        	$total_eatingTime += $during;
			        	$counter++;
			        }
			    }

			    fclose($fileHandle);
			} else {
			    die("讀取".$fileHandle."出現錯誤!");
			} 
		}
		if($counter == 0)
			return -1;
		else
		{
			return ($total_eatingTime / $counter);
		}
	}

	//計算來店用餐時間和離開時間
	public function calc_coming_and_leaving_time($filePath)
	{
		//24小時制?
		$comingTime = array(0 => 0,1 => 0,2 => 0,3 => 0, 4 => 0, 5 => 0, 6 => 0,
							7 => 0, 8 => 0, 9 => 0, 10 => 0, 11 => 0, 12 => 0,
							13 => 0, 14 => 0, 15 => 0, 16 => 0, 17 => 0, 18 => 0,
							19 => 0, 20 => 0, 21 => 0, 22 => 0, 23 => 0);

		$leavingTime = array(0 => 0,1 => 0,2 => 0,3 => 0, 4 => 0, 5 => 0, 6 => 0,
							7 => 0, 8 => 0, 9 => 0, 10 => 0, 11 => 0, 12 => 0,
							13 => 0, 14 => 0, 15 => 0, 16 => 0, 17 => 0, 18 => 0,
							19 => 0, 20 => 0, 21 => 0, 22 => 0, 23 => 0);
		$txts = glob($filePath."/*.txt");
		//echo "filecounts".$filePath;

		for($i = 0; $i < count($txts);$i++)
		{
			//echo "filePath = ".$txts[$i];
			$fileHandle = fopen($txts[$i], "r");
			if ($fileHandle) 
			{
				$start_eating_time = "0";
			    while (($line = fgets($fileHandle)) !== false) {
			        list($occupied,$a_mac,$time_stamp) = explode(";", $line, 3);
			        list($date,$dayTime) = explode(" ", $time_stamp);
			        list($hour,$minute,$seconds) = explode(":", $dayTime);
			        if($occupied == 1)
			        {//此行是有人坐上去之後傳入的資料 記錄下他坐下的時間
			        	$start_eating_time = $time_stamp;
			        	$comingTime[(int)$hour]++;
			        }
			        else if($occupied == 0)
			        {//此行是在上面的人離開後傳入的資料 記錄他在座的時間 並將start_eating_time重置
			        	$during = (int)(strtotime($time_stamp) - strtotime($start_eating_time))/ (60);//單位為m
			        	$start_eating_time = "0";
			        	$leavingTime[(int)$hour]++;
			        }
			        //echo "hour = $hour";
			    }

			    fclose($fileHandle);
			} else {
			    die("讀取".$fileHandle."出現錯誤!");
			} 
		}
		$come_and_leave = array($comingTime,$leavingTime);
		return $come_and_leave;
	}

	//計算翻桌率
	public function calc_turn_table_rate($filePath)
	{
		$counter = 0;
		$txts = glob($filePath."/*.txt");
		//echo "filecounts".$filePath;
		$chair = count($txts);

		for($i = 0; $i < count($txts);$i++)
		{
			//echo "filePath = ".$txts[$i];
			$fileHandle = fopen($txts[$i], "r");
			if ($fileHandle) 
			{
			    while (($line = fgets($fileHandle)) !== false) {
			        list($occupied,$a_mac,$time_stamp) = explode(";", $line, 3);
			        if($occupied == 1)
			        {//此行是有人坐上去之後傳入的資料 記錄下他坐下的時間

			        }
			        else if($occupied == 0)
			        {//此行是在上面的人離開後傳入的資料 一筆交易 counter++
			        	$counter++;
			        }
			    }

			    fclose($fileHandle);
			} else {
			    die("讀取".$fileHandle."出現錯誤!");
			} 
		}
		if($chair == 0)
			return -1;
		else
			return ($counter / $chair);
	}

	//熱門座位
	public function calc_hot_seat($filePath)
	{
		$sit_counter = array();
		$txts = glob($filePath."/*.txt");
		//echo "filecounts".$filePath;

		for($i = 0; $i < count($txts);$i++)
		{
			$fileHandle = fopen($txts[$i], "r");
			if ($fileHandle) 
			{
			    while (($line = fgets($fileHandle)) !== false) {
			        list($occupied,$a_mac,$time_stamp) = explode(";", $line, 3);
			        //檢查$sit_counter陣列裡是否有$a_mac這個key
			        $a_mac = strtoupper ($a_mac);
				    if(!array_key_exists($a_mac,$sit_counter))
				    {//沒有 建立key
				       	$sit_counter[$a_mac] = 0;
				    }

			        if($occupied == 1)
			        {//此行是有人坐上去之後傳入的資料 記錄下他坐下的時間

			        }
			        else if($occupied == 0)
			        {//此行是在上面的人離開後傳入的資料
				        $sit_counter[$a_mac]++;
			        }
			    }

			    fclose($fileHandle);
			} else {
			    die("讀取".$fileHandle."出現錯誤!");
			} 
		}
		return $sit_counter;
	}
	
	//計算pi的平均溫度跟過熱
	public function calc_pi_overheat($filePath)
	{
		$counter = 0;
		$txts = glob($filePath."/*.txt");

		$sum_temp = 0;
		$datacount = 0;
		$temp_array = array();
		for($i = 0; $i < count($txts);$i++)
		{
			$fileHandle = fopen($txts[$i], "r");
			if ($fileHandle) 
			{
			    while (($line = fgets($fileHandle)) !== false) {
			    	list($temp,$mac,$time_stamp) = explode(";", $line);
			    	$time_stamp = preg_replace("/\r\n|\r|\n/",'',$time_stamp);
			    	//str_replace("\r\n", '', $time_stamp);
			    	$sum_temp += (int)$temp;

			    	if((int)$temp > 60.0)
			    	{
			    		array_push($temp_array, $temp.";".$mac.";".$time_stamp);
			    	}
			    	$datacount++;
			    }

			    fclose($fileHandle);
			} else {
			    die("讀取".$fileHandle."出現錯誤!");
			} 
		}
		if($datacount == 0)
		{
			return $temp_array;
		}else{
			$temp_array["avg_temp"] = $sum_temp / $datacount;
			return $temp_array;	
		}
	}
	//taxi
	//計算每次上車幾人
	public function calc_taxi_people($filePath)
	{
		$people = array('1' => 0,'2' => 0,'3' => 0,'4' => 0,'>4' => 0);
		$txts = glob($filePath."/*.txt");

		for($i = 0; $i < count($txts);$i++)
		{
			$tmp_record = array();
			$fileHandle = fopen($txts[$i], "r");
			if ($fileHandle) 
			{
			    while (($line = fgets($fileHandle)) !== false) {
			        list($occupied,$a_mac,$time_stamp) = explode(";", $line, 3);
			        if($occupied == 1)
			        {//此行是有人坐上去之後傳入的資料 記錄下他坐下的時間
			        	array_push($tmp_record, substr($time_stamp,0,-2));
			        }
			    }
			    fclose($fileHandle);
			} else {
			    die("讀取".$fileHandle."出現錯誤!");
			}
			//var_dump($tmp_record);
			while(count($tmp_record) > 0)
			{
				$counter = 1;
				$conpare_time = $tmp_record[0];
				array_splice($tmp_record, 0, 1);
				//echo strtotime($conpare_time.' + 3 minute')."<br>";
				//unset($tmp_record[0]);
				foreach ($tmp_record as $key => $value) 
				{
					if(strtotime($value) < strtotime($conpare_time.' + 3 minute') && strtotime($value) > strtotime($conpare_time.' - 3 minute'))
					{
						// echo $value."-".$conpare_time."<br>";
						array_splice($tmp_record, $key, $key);
						$counter++;
					}
				}
				// echo "<br>";

				switch ($counter) {
					case 1:
						$people["1"]++;
						break;
					case 2:
						$people["2"]++;
						break;
					case 3:
						$people["3"]++;
						break;
					case 4:
						$people["4"]++;
						break;
					default:
						if($counter > 4)
							$people[">4"]++;
						else
							echo "錯誤人數";
						break;
				}

			}
		}
		return $people;
	}
	//司機
	public function calc_taxi_driver($filePath)
	{
		$txts = glob($filePath."/*.txt");
		$seats = array();

		for($i = 0; $i < count($txts);$i++)
		{
			$fileHandle = fopen($txts[$i], "r");
			if ($fileHandle) 
			{
				$start_sit_time = "0";
			    while (($line = fgets($fileHandle)) !== false) {
			        list($occupied,$a_mac,$time_stamp) = explode(";", $line, 3);
			        if($occupied == 1)
			        {//此行是有人坐上去之後傳入的資料 記錄下他坐下的時間
						$start_sit_time = $time_stamp;
			        }
			        else if($occupied == 0)
			        {//此行是在上面的人離開後傳入的資料
						if(!array_key_exists($a_mac,$seats))
						{//沒有 建立key
							$seats[$a_mac] = 0;
						}
				        $seats[$a_mac] += (int)(strtotime($time_stamp) - strtotime($start_sit_time))/ (60);//單位為m
			        }
			    }
			    fclose($fileHandle);
			} else {
			    die("讀取".$fileHandle."出現錯誤!");
			}
			//var_dump($seats);
		}
		return array_search(max($seats), $seats);
	}
	//司機是否超時
	public function calc_driver_tired($filePath)
	{
		$fileHandle = fopen($filePath, "r");
		$tired = array();
		if ($fileHandle) 
		{
			$start_sit_time = "0";
		    while (($line = fgets($fileHandle)) !== false) {
				$during = 0;
		        list($occupied,$a_mac,$time_stamp) = explode(";", $line, 3);
			    if($occupied == 1)
		        {//此行是有人坐上去之後傳入的資料 記錄下他坐下的時間
					$start_sit_time = $time_stamp;
		        }
		        else if($occupied == 0)
		        {//此行是在上面的人離開後傳入的資料
			        $during = (int)(strtotime($time_stamp) - strtotime($start_sit_time))/ (60);//單位為m
		        }
				if($during >= 600)
				{
					array_push($tired,$during - 600);
				}
		    }
		    fclose($fileHandle);
		} else {
		    die("讀取".$fileHandle."出現錯誤!");
		}
		return $tired;
	}
}


?>