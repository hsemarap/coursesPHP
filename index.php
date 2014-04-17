<?php
require_once 'login/includes/main.php';
$user = new User();
if(!$user->loggedIn())
redirect('/db/login/index.php');
require_once 'connect.php';
$query=$_GET['query'];
$query=explode("/",$query);
if($query[0]=="departments")
{
include "dept.php";
die();
}
else if($query[0]=="terms")
{
include "term.php";
die();
}
else if($query[0]=="profile")
{
include "profiles.php";
die();
}

?>
<html>
<head><title>Course Management System</title>
<link rel='stylesheet' href='css/bootstrap.min.css' />
<link rel='stylesheet' href='css/application_custom.css' />
<script src='js/jquery.min.js' ></script>
<script src='js/bootstrap.min.js' ></script>
</head>
<body >
<style>
.out{border:1px solid black;}
.min100{min-height:100%;}
.min90{min-height:90%;}.min80{min-height:80%;}.min70{min-height:70%;}
.min60{min-height:60%;}.min50{min-height:50%;}.min40{min-height:40%;}
.min30{min-height:30%;}.min20{min-height:20%;}.min10{min-height:10%;}
</style>
<div class='out container min80' style='width:100%;margin:auto'>
  <div class='row min10'>
    <div class='col1 min20 out'>
    <img src='images/nitt_logo.png' align='left' height='100' />
    <h1 style='display:inline;position:relative;left:25%;bottom:-35px;'>Course Management System</h1>
    <img src='images/nitt_gj_logo.png' align='right' height='100' />    
    </div>
  </div>
  <div class='row min10'>
    <div class='col1 min80 out'>
    <span style='position:relative;float:right' ><?php echo "$user->email ( ".$user->rank()." )";?></span>        
	<div class="panel panel-default">
    <table class="table table-striped table-hover">
      <thead>
        <tr>
          <th>Departments</th>
        </tr>
      </thead>
      <tbody>        
      <?php
      $query="SELECT * FROM departments";
      $res=mysql_query($query);
      while($row=mysql_fetch_assoc($res)){
      echo "
          <tr>
            <td>
              <a href='./departments/".$row['short']."'>".$row['name']."</a>
            </td>
          </tr>\n";
      }
	?>
      </tbody>
    </table>
  </div>
    </div>
  </div>
</div>
</body>
</html>
