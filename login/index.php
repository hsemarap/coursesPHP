<?php

require_once 'includes/main.php';

if(isset($_GET['tkn'])){

	$user = User::findByToken($_GET['tkn']);

	if($user){
		$user->login();
		redirect('protected.php');
	}
	redirect('index.php');
}


//Logout code

if(isset($_GET['logout'])){

	$user = new User();

	if($user->loggedIn()){
		$user->logout();
	}

	redirect('index.php');
}


$user = new User();

if($user->loggedIn()){
	redirect('protected.php');
}



try{
	if(!empty($_POST) && isset($_SERVER['HTTP_X_REQUESTED_WITH'])){
		header('Content-type: application/json');
	if(!isset($_POST['pass'])||$_POST['pass']=="")
	throw new Exception("Please Enter a valid password.");
	if(!isset($_POST['email']) || !filter_var($_POST['email'], FILTER_VALIDATE_EMAIL)){
			throw new Exception('Please enter a valid email.');
		}
		rate_limit($_SERVER['REMOTE_ADDR']);
		rate_limit_tick($_SERVER['REMOTE_ADDR'], $_POST['email']);
		$message = '';
		$email = mysql_real_escape_string($_POST['email']);
		$pass  = mysql_real_escape_string($_POST['pass']);
		$subject = 'Your Login Link';
		
		if(!User::exists($email)){
			$subject = "Thank You For Registering!";
			$message = "Thank you for registering at our site!\n\n";
		}

		// Attempt to login or register the person
		$user = User::loginOrRegister($email,md5($pass));

		if($user){
//		$message.= "You can login from this URL:";
		$url= get_page_url()."?tkn=".$user->generateToken();
		$message.=$url."\n\n";
//		$message.= "The link is going expire automatically after 10 minutes.";
		
//		$result = send_email($fromEmail, $_POST['email'], $subject, $message);
		$result=true;
		throw new Exception($message);
		if(!$result){
			throw new Exception("There was an error sending your email. Please try again.");
		}
		
		die(json_encode(array(
			'message' => 'Thank you! We\'ve sent a link to your inbox. Check your spam folder as well.'
		)));
		}
		else {
			throw new Exception("Wrong Password. Please try again.");
		}
	}
}
catch(Exception $e){
	die(json_encode(array(
		'error'=>1,
		'message' => $e->getMessage()
	)));
}

//	Output the login form
?>

<!DOCTYPE html>
<html>

	<head>
		<meta charset="utf-8"/>
		<title>Login To Course Management System</title>

		<link href="assets/css/google.css" rel="stylesheet">

		<!-- The main CSS file -->
		<link href="assets/css/style.css" rel="stylesheet" />

		<!--[if lt IE 9]>
			<script src="http://html5shiv.googlecode.com/svn/trunk/html5.js"></script>
		<![endif]-->
	</head>

	<body>

		<form id="login-register" method="post" action="index.php">

			<h1>Login or Register</h1>

			<input type="text" placeholder="your@email.com" name="email" autofocus />
			<input type="password" placeholder="Your Password" name="pass" />
			<button type="submit">Login / Register</button>

			<span></span>

		</form>

		<footer>
            <div id="tzine-actions"></div>
            <span class="close"></span>
        </footer>
        
		<!-- JavaScript Includes -->
		<script src="../js/jquery.min.js"></script>
		<script src="assets/js/script.js"></script>

	</body>
</html>
