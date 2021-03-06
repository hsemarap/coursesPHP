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
<?php
$dept=$_GET['dept'];
$query="SELECT * from departments where id = '$dept'";
$res=mysql_query($query);
if(mysql_num_rows($res)==0)$deptfound=false;
else 
while($row=mysql_fetch_assoc($res))
{
$deptfound=true;
$deptid=$row['id'];
$deptfull=$row['name'];
$deptrollprefix=$row['rollno_prefix'];
$depthodid=$row['hod_id'];
}
$query="SELECT * from faculties where id = '$depthodid'";
$res=mysql_query($query);
while($row=mysql_fetch_assoc($res))
{
$hodprefix=$row['prefix'];
$hoduid=$row['user_id'];
$hodabout=$row['about'];
}
$query="SELECT * from users where id = '$hoduid'";
$res=mysql_query($query);
while($row=mysql_fetch_assoc($res))
{
$hodname=$row['name'];
$hodemail=$row['email'];
}
$html="";
$html.=<<<DOC
	<h1 style='display:inline'>$deptfull</h1><h2 style='display:inline'>($dept)</h2>
	<br/>Head of the Department : <h4 style='display:inline'><a href='/db/profile/$hodemail'>$hodprefix $hodname</a></h4>
	<a href="/db/admin/term.php?newcourse=1" class="btn btn-default btn-small" style='left:50%;position:relative'>
  <span class="glyphicon glyphicon-plus" style="color: green; "></span> 
  Add Course
</a>

    <table class="table table-hover">
    <caption>
      <h3>Courses Offered in $deptfull</h3>
    </caption>
    <thead>
      <tr>
        <th>Course Name</th>
        <th>Course Instructor</th>
        <th>No. of credits</th>
      </tr>
    </thead>
DOC;
    	$query="SELECT * from terms where id in (SELECT term_id FROM term_departments WHERE department_id = '$deptid') order by semester";    	
    	echo $query;
	$res=mysql_query($query);
	while($row=mysql_fetch_assoc($res))
	{
		$ans[$row['semester']][]=$row;
	}
$html.="
    <tbody>";            
    foreach($ans as $sem=>$semdetails){
    $html.="<tr><th colspan='3'>Sem #$sem</th></tr>";
	    foreach($semdetails as $semester){
	    	$courseid=$semester['course_id'];
	        $termid=$semester['id'];
                $query="SELECT * from courses where id = '$courseid'";    	
		$res=mysql_query($query);
		while($row=mysql_fetch_assoc($res))
		{
			$subcode=$row['subject_code'];
			$coursename=$row['name'];
			$credits=$row['credits'];
			$islab=$row['is_laboratory'];
		}
		$facultyid=$facultyname=$facultymail="";
		$query="SELECT * from users as u,term_faculties as tf,faculties as f where tf.term_id = '$termid' and tf.faculty_id = f.id and f.user_id = u.id";  
		$res=mysql_query($query);
		while($row=mysql_fetch_assoc($res))
		{
			$facultyid=$row['faculty_id'];
			$facultyname=$row['name'];
			$facultymail=$row['email'];
		}
		    $html.="  <tr>
			      <td>
				<a href='/db/admin/term.php?term=$termid'>
				  $subcode - $coursename
				</a>
			      </td>
			      <td>
				<small>
				  <a href='/db/profile/$facultymail'>$facultyname</a>
				</small>
			      </td>
			      <td>$credits</td>
			    </tr>";
            }
    }
$html.=<<<HTML
    </tbody>
  </table>
  </div>
    </div>
  </div>
HTML;
echo $html;
?>
</div>
</body>
</html>
