<?php
	if ($_SERVER['REQUEST_METHOD'] == 'POST') {
		
		if (!empty($_POST["pi_mac"]) && !empty($_POST["cpu_temp"])) {
			
			require_once("../connectDB.php");
			require_once("../logtools.php");
			$logtool = new LogTools;
			
			$_POST["pi_mac"] = trim($_POST["pi_mac"]);
			$_POST["cpu_temp"] = trim($_POST["cpu_temp"]);
			
			//先判斷 pi_to_table 裡面是否有註冊

			$check = $db->prepare("SELECT * FROM `pi_to_group` WHERE `PI_MAC` = ?");

			$check->execute(array($_POST["pi_mac"]));

			$count = 0;

			if ($check->rowCount() > 0) { 
				
				$update = $db->prepare("UPDATE `pi` SET `CPU_Temp` = ? WHERE `PI_MAC` = ?");

				$update->execute(array($_POST["cpu_temp"], $_POST["pi_mac"]));

				$count = $update->rowCount();

			} else { //此台 pi尚未被註冊 or 惡意捏造 Mac

				//do nothing;

			}

			if ($count > 0){
				
				$logtool->save(Action::Update, "pi:PI_MAC-". $_POST["pi_mac"], "CPU_Temp:" . $_POST["cpu_temp"]);
				
				echo "success";
				
			}

			$db = null;
		}
	}

?>
