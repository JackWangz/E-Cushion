<?php
	const url = "register.php?";
	if (!isset($_SESSION)) { session_start(); }

	//model種類
	$type = array(
		0 => "請選擇商業模式",
		1 => "餐廳" ,
		2 => "計程車",
		3 => "理髮院",
		4 => "遊樂園",
		5 => "國道客運"
	);

	//驗證註冊
    if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    	if (!empty($_POST["name"]) && 
			!empty($_POST["account"]) && 
			!empty($_POST["password"]) && 
			!empty($_POST["comfirm_password"]) && 
			!empty($_POST["phone"]) && 
			!empty($_POST["address"]) && 
			!empty($_POST["email"]) && 
			!empty($_POST["model"])) {
				
    		require_once("../connectDB.php");

			//圖形驗證確認
			if ($_POST['checknum'] != $_SESSION['ans_checknum']) {
				//回到登入頁面 錯誤訊息為2
				header('Location: '.url.'failed=2');
				exit();
			}

			$name = $_POST["name"];
			$account = $_POST["account"];
			$password = $_POST["password"];
			$comfirm_password = $_POST["comfirm_password"];
			$phone = $_POST["phone"];
			$address = $_POST["address"];
			$email = $_POST["email"];
			$model = $_POST["model"];

			//確定商業模式選擇
			if ($model == "請選擇商業模式") {
				//回到登入頁面，錯誤訊息為3
				header('Location: '.url.'failed=3');
				exit();
			}
			
			//確認密碼與確認密碼一致
			if ($password != $comfirm_password) {
				//回到登入頁面，錯誤訊息為1
				header('Location: '.url.'failed=1');
				exit();
			}

			// echo $name."\n";
			// echo $account."\n";
			// echo $password."\n";
			// echo $comfirm_password."\n";
			// echo $phone."\n";
			// echo $address."\n";
			// echo $email."\n";
			// echo $model."\n";

			// 檢查是否已經被註冊
			$check = $db->prepare("SELECT * FROM `member` WHERE `Name` = ? OR `Account` = ?");
			$check->execute(array($name, $account));

			$num = $check->rowCount();

			if ($num == 0) {
				$insert  = $db->prepare("INSERT INTO `member` (Name, Account, Password, Phone, Address, Email, Model) VALUES (?, ?, ?, ?, ?, ?, ?)");
				$insert->execute(array($name, $account, $password, $phone, $address, $email, $model));
				if ($insert->rowCount() > 0) {
					$check = $db->prepare("SELECT * FROM `member` WHERE `Account` = ? AND `Password` = ?");
					$check->execute(array($account, $password));
					$result = $check->fetch();
					$_SESSION["member_id"] = $result["member_id"];
					//取出 member_id 導向主頁面
					header('Location: main.php');
					exit();
				}
			} else {
				//回到登入頁面 錯誤訊息為1
				header('Location: '.url.'failed=1');
				exit();
			}
    	}
		header('Location: '.url.'failed=3');
		exit();
    }

    //圖形驗證碼產生
	$_SESSION['ans_checknum'] = '';
	$ans_str = 0; $ans_now = '';
	mt_srand((double)microtime() * 1000000);  //重置隨機值

	//隨機取得6個小寫英字a-z
	for ($i = 0; $i < 4; $i++) {
	    $ans_str = mt_rand(97, 122);
	    $ans_now .= chr($ans_str);
    }
    $_SESSION['ans_checknum'] = $ans_now;  //將值放至session
    
?>

<html>
	<head>
		<title>E-Cushion - Sign Up</title>
		<meta charset="utf8" />
		<link rel=stylesheet type="text/css" href="../css/sign_page.css"> 
		<link href='https://fonts.googleapis.com/css?family=Roboto+Slab' rel='stylesheet' type='text/css'>
	</head>
	<body>
		<form class="main register" action="register.php" method="post" name="">
			<table class="form">
				<tr><td colspan="2"><input class="form-item input1" name="name" id="account" type="text" placeholder="姓名 Name"/></td></tr>
				<tr><td colspan="2"><input class="form-item input1" name="account" id="account" type="text" placeholder="帳號ID Account"/></td></tr>
				<tr><td colspan="2"><input class="form-item input1" name="password" id="password" type="password" placeholder="密碼 Password"/></td></tr>
				<tr><td colspan="2"><input class="form-item input1" name="comfirm_password" id="comfirm_password" type="password" placeholder="確認密碼 Comfirm Password"/></td></tr>
				<tr><td colspan="2"><input class="form-item input1" name="phone" id="phone" placeholder="連絡電話 Phone Number"/></td></tr>
				<tr><td colspan="2"><input class="form-item input1" name="address" id="address" placeholder="聯絡地址 Contact Address"/></td></tr>
				<tr><td colspan="2"><input class="form-item input1" name="email" id="account" type="text" placeholder="電子信箱 Email"//></td></tr>
				<tr>
					<td colspan="2">
						<select name="model" class="form-item input1">
							<?php
								for ($i = 0; $i < count($type); $i++)
									echo "<option>".$type[$i]."</option>";
							?>
						</select>
					</td>
				</tr>
				<tr>
					<td><input class="form-item input1" name="checknum" id="checknum" type="text" placeholder="驗證碼 Type the characters"/></td>
					<td><img class="form-item captcha" src="captcha_pic.php"></td>
				</tr>
				<tr><td colspan="2"><button class="form-item button1" name="submit" type="submit">送出 Submit</button></td></tr>
				<tr><td colspan="2">
					<div class="form-item message2">
						<?php
							// echo $_SESSION['ans_checknum'];
					    	if (isset($_GET['failed'])){
					    		switch ($_GET['failed']) {
					    			case 1:
					    				echo "註冊失敗";
					    				break;
					    			case 2:
					    				echo "驗證碼錯誤";
					    				break;
					    			case 3:
					    				echo "請填寫所有欄位";
					    				break;
					    			default:
					    				# code...
					    				break;
					    		}
					    	}
					    ?>
				    </div>
				</td></tr>
			</table>
		</form>
	</body>
</html>