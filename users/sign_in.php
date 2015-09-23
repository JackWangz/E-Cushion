<?php
	//驗證註冊
	const url = "sign_in.php?";
	if (!isset($_SESSION)) { session_start(); }

	//如果登入狀態再進入一次，則登出
	if (isset($_SESSION["Member_ID"])){
		unset($_SESSION["Member_ID"]);
		header('Location: ./sign_in.php');
		exit();
	}

	if ($_SERVER['REQUEST_METHOD'] == 'POST') {
		if (!empty($_POST["account"]) && !empty($_POST["password"])) {
			require_once("../connectDB.php");

			//圖形驗證確認
			if ($_POST['checknum'] != $_SESSION['ans_checknum']) {
				//回到登入頁面 錯誤訊息為2
				header('Location: '.url.'failed=2');
				exit();
			}

			$account = $_POST["account"];
			$password = $_POST["password"];

			$check = $db->prepare("SELECT * FROM `member` WHERE `Account` = ? AND `Password` = ?");
			$check->execute(array($account, $password));

			$num = $check->rowCount();

			if ($num == 1) { //如果登入成功
				$result = $check->fetch();
				$_SESSION["Member_ID"] = $result["Member_ID"];
				header('Location: ../index.php');
				exit();
			}
		}
		//回到登入頁面 錯誤訊息為1
		header('Location: '.url.'failed=1');
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
		<title>E-Cushion 會員登入</title>
		<meta charset="utf8" />
		<link rel=stylesheet type="text/css" href="../css/sign_page.css"> 
		<link href='https://fonts.googleapis.com/css?family=Roboto+Slab' rel='stylesheet' type='text/css'>
	</head>
	<body>
		<form class="main signin" action="sign_in.php" method="post" name="login">
			<table class="form">
				<tr><td colspan="2">
					<input class="form-item input1" name="account" id="account" type="text" placeholder="帳號ID Account" />
				</td></tr>
				<tr><td colspan="2">
					<input class="form-item input1" name="password" id="password" type="password" placeholder="密碼 Password"/>
				</td></tr>
				<tr>
					<td><input class="form-item input1" name="checknum" id="checknum" type="text" placeholder="請輸入驗證碼"/></td>
					<td><img class="form-item captcha" src="captcha_pic.php"></td>
				</tr>
				<tr><td></td></tr>
				<tr><td colspan="2">
					<button class="form-item button1" name="login" type="submit">登入</button>
				</td></tr>
				<tr><td colspan="2">
					<div class="form-item message1" name="register">還不是會員嗎？　<a href="register.php">加入會員</a></div>
				</td></tr>
				<tr><td colspan="2">
					<div class="form-item message2">
						<?php
					    	// echo $_SESSION['ans_checknum'];
					    	if (isset($_GET['failed'])){
					    		switch ($_GET['failed']) {
					    			case 1:
					    				echo "登入失敗";
					    				break;
					    			case 2:
					    				echo "驗證碼錯誤";
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