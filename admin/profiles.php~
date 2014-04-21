<?php
ini_set('display_startup_errors',1);
ini_set('display_errors',1);
error_reporting(-1);
require_once "../connect.php";
require_once "../login/includes/main.php";
$user= new User();
if(!$user->loggedIn()){
redirect("../login/index.php");
}
if($user->rank()!="administrator"){
echo "You do not have Admin privileges to access this page";
echo "<script>setTimeout(function(){window.location='../';},2000);</script>";
die();
}
$pro=$_GET['mail'];
if($pro=="me");// do some stuff 
$femail=$pro;
require_once "connect.php";
$query="SELECT * from users where email = '$pro'";
$res=mysql_query($query);
while($row=mysql_fetch_assoc($res))
{
$fname=$row['name'];
$fid=$row['id'];
$fdeptid=$row['department_id'];
}
$query="SELECT * from faculties,departments where user_id = '$fid'";
$res=mysql_query($query);
while($row=mysql_fetch_assoc($res))
{
$fprefix=$row['prefix'];
$fabout=$row['about'];
$fdeptname=$row['name'];
}
$query="SELECT * from departments where id = '$fdeptid'";
$res=mysql_query($query);
while($row=mysql_fetch_assoc($res))
{
$fdeptname=$row['name'];
}
?>
<html>
<head><title>Course Management System</title>
<link rel='stylesheet' href='../css/bootstrap.min.css' />
<link rel='stylesheet' href='../css/application_custom.css' />
<script src='../js/jquery.min.js' ></script>
<script src='../js/bootstrap.min.js' ></script>
</head>
<body >
<style>
.row{margin-right:0px!important;}
.out{border:1px solid black;}
.min100{min-height:100%;}
.min90{min-height:90%;}.min80{min-height:80%;}.min70{min-height:70%;}
.min60{min-height:60%;}.min50{min-height:50%;}.min40{min-height:40%;}
.min30{min-height:30%;}.min20{min-height:20%;}.min10{min-height:10%;}
</style>
<div class='out container min80' style='width:100%;margin:auto'>
  <div class='row min10'>
    <div class='col1 min20 out'>
    <img src='../img/nitt_logo.png' align='left' height='100' />
    <h1 style='display:inline;position:relative;left:25%;bottom:-35px;'>Course Management System</h1>
    <img src='../img/nitt_gj_logo.png' align='right' height='100' />    
    </div>
  </div>
  <div class='row min10'>
    <div class='col1 min80 out'>
    <span style='position:relative;float:right' ><?php echo "$user->email ( ".$user->rank()." )";?></span>        
	<div class="panel panel-default">
	<a href='../' class='btn btn-info' >Go Back</a>
	<br/>
	<div class="row">
        <div class="col-md-3">
        <?php
        $fimage="default.jpg";
        $dir='img/fac/';
        if(file_exists($dir.$femail.".jpg"))$fimage=$femail.".jpg";                
        else 
	if(file_exists($dir.$femail.".jpeg"))$fimage=$femail.".jpeg";                
        else 
        if(file_exists($dir.$femail.".png"))$fimage=$femail.".png";   
        $fimage='../'.$dir.$fimage;     
        ?>
          <img height='150' src="<?php echo $fimage?>" id="avatar" style='float:right'>
        </div>
        <div class="col-md-9">
          <table class="table table-striped">
            <tbody>
              
                <tr>
                  <th>Name</th>
                  <?php echo "<td> $fprefix $fname</td>"?>
                </tr>
                <tr>
                  <th>Department</th>
                  <td><?php echo $fdeptname;?></td>
                </tr>
                <tr>
                  <th>Email</th>
                  <td><?php echo $femail?>@nitt.edu</td>
                </tr>
                <tr>
                  <th>Status</th>
                  <td>Faculty</td>
                </tr>
                <tr>
                  <th>About</th>
                  <td>
                  <?php
                  $fabout1=explode("####",$fabout);
                  $fabouttext=$fabout1[0];
                  $fbooks=$fabout1[1];
                  echo "<p>$fabouttext</p>";
                  if($fbooks!="")
                  {
                  echo "<h4>Books Published</h4>";
                  echo "<ul>";
                  $fbooklist=explode("*",$fbooks);
                  for($i=1;$i<count($fbooklist);$i++)
                  echo "<li>".$fbooklist[$i]."</li>";
                  echo "</ul>";
                  }
                  ?>
</td>
                </tr>              
            </tbody>
          </table>
        </div>
      </div>	
  </div>
    </div>
  </div>
</div>
</body>
</html>
