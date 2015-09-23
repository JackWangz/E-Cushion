<?php
	if ($_SERVER['REQUEST_METHOD'] == 'POST') {
		
		if (!empty($_POST["a_mac"]) && !empty($_POST["last_change_time"])) {
			
			require_once("../connectDB.php");
			require_once("../logtools.php");
			$logtool = new LogTools;
			
			$_POST["a_mac"] = trim($_POST["a_mac"]);
			$_POST["occupied"] = trim($_POST["occupied"]);
			$_POST["last_change_time"] = trim($_POST["last_change_time"]);
			
			//先判斷 table 裡面是否有註冊這台 Arduino
			$check = $db->prepare("SELECT * FROM `group` WHERE `A_MAC` = ?");
			$check->execute(array($_POST["a_mac"]));

			$count = 0;
			
			if ($check->rowCount() > 0) {

				$check_occupied = $db->prepare("SELECT `Occupied` FROM `sensor` WHERE `A_MAC` = ?");
				
				$check_occupied->execute(array($_POST["a_mac"]));
				
				if ($check_occupied->fetch()["Occupied"] != $_POST["occupied"]) { //如果狀態改變才更改
					
					$update = $db->prepare("UPDATE `sensor` SET `Occupied`= ?,`Last_Change_Time` = ? WHERE `A_MAC` = ?");
						
					$update->execute(array($_POST["occupied"], $_POST["last_change_time"], $_POST["a_mac"]));

					$logtool->save(Action::Update, "sensor:A_MAC-". $_POST["a_mac"], "Occupied:" . $_POST["occupied"] . ", " . "Last_Change_Time:" . $_POST["last_change_time"]);
					
					$count = $update->rowCount();
				}

			} else { //此台 Arduino 尚未被註冊 或是 惡意捏造 Mac

				//do nothing;

			}

			if ($count > 0) {
				echo "success";
			}
			$db = null;
		}
	}
?>