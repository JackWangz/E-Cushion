<?php
	ob_start();
	if(!isset($_SESSION)){ session_start(); }

	header('content-Type:image/gif');

	echo mt_srand(time());

	const width = 105;
	const height = 33;

	$length = strlen($_SESSION['ans_checknum']);
	$img = imagecreate(width, height);
	imagefill($img, 0, 0, ImageColorAllocate($img, 200, 200, 200));

	for($i = 0; $i < 250; $i++) //加入干擾象素
	{
		$randcolor = ImageColorallocate($img, rand(10, 250), rand(10, 250), rand(10, 250));
		imagesetpixel($img, rand() % width, rand() % height, $randcolor);
	}

	for ($i = 0; $i < $length; $i++) {
		$color = imagecolorallocate($img, abs(mt_rand() % 128), abs(mt_rand() % 128), abs(mt_rand() % 128));
		imagechar($img, height / 2, abs(mt_rand() % width / 8) + $i * width / 4, abs(mt_rand() % height / 2), $_SESSION['ans_checknum'][$i], $color);
	}
	imagegif($img);
	imageDestroy($img);
	ob_end_flush();
?>