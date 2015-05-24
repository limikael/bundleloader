<?php

	ignore_user_abort(false);
	error_reporting(E_ALL);
	ini_set('display_errors', 1);	

	$chunk="window.helloWorld=window.helloWorld?window.helloWorld+1:1;\n";

	header("Content-Type: text/javascript");
	header("Content-Length: ".strlen($chunk)*200);
	echo $chunk;

	for ($i=0; $i<200; $i++) {
		echo $chunk;
		usleep(10000);
		flush();
	}