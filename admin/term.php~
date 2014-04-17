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
    <span style='position:relative;float:right' ><?php echo $user->email." ( ".$user->rank()." )";?></span>        
	<div class="panel panel-default">
	<a href='../' class='btn btn-info' >Go Back</a>
	<br/>
<?php

if(isset($_GET['term'])){
	$term=$_GET['term'];
$query="SELECT * from terms where id = '$term'";
$res=mysql_query($query);
if(mysql_num_rows($res)==0)$found=false;
else 
while($row=mysql_fetch_assoc($res))
{
$found=true;
$semester=$row['semester'];
$courseid=$row['course_id'];
}
$query="SELECT * from courses where id = '$courseid'";
$res=mysql_query($query);
if(mysql_num_rows($res)==0);
else 
while($row=mysql_fetch_assoc($res))
{
$subcode=$row['subject_code'];
$coursename=$row['name'];
$coursedetails=$row['about'];
$coursedetails=explode("####",$coursedetails);
$courseabout=$coursedetails[0];
$courseobj=$coursedetails[1];
$courseoutcomes=$coursedetails[2];
$credits=$row['credits'];
$islab=$row['is_laboratory'];
}
if(sizeof($_POST)>0)  
 {
	if(isset($_POST['objectives'])&&isset($_POST['outcomes'])&&isset($_POST['instructor']))
	{
		$courseobj=$obj=$_POST['objectives'];
		$courseoutcomes=$out=$_POST['outcomes'];
		$inst=$_POST['instructor'];
		$subcode=$code=$_POST['code'];
		$semester=$_POST['semester'];
		$islab=$isLab=$_POST['islab'];
		$credits=$_POST['credits'];		
		$coursename=$_POST['coursename'];						
		$about = "####".$obj."####".$out;
		$query="UPDATE courses SET is_laboratory='$isLab', credits='$credits', subject_code = '$code',name = '$coursename' ,about='$about' WHERE id = '$courseid'";
		mysql_query($query);
		$query="UPDATE terms SET semester = '$semester' WHERE id = '$term'";
		mysql_query($query);
		$query="UPDATE term_faculties SET faculty_id = (SELECT f.id from faculties as f,users as u WHERE f.user_id = u.id and u.email = '$inst' ) WHERE term_id = '$term'";
		mysql_query($query);
		if(mysql_error()=="")
		echo "Details Updated Successfully";
		else echo "Error: ".mysql_error();
	}
}

$html='	<div class="container" id="content" style="opacity: 1;">
  <div id="term">
        <form action="./term.php?term='.$term.'" method="POST">
    <h3>     
      <small><input name="code" value="'.$subcode.'" /></small>
	<input name="coursename" value="'.$coursename.'"/>
    </h3>
    <table>
<tr><td><h4>Semester</h4></td>
<td><input style="width:100px" name="semester" type="number" min="1" max="8" value="'.$semester.'"/></td></tr>
<tr><td><h4>Credits</h4></td>
<td><input style="width:100px" name="credits" type="number" min="0" max="8" value="'.$credits.'"/>   </td></tr> 	
<tr><td><h4>Is this Course a Lab Course ?</h4></td>
<td><label><input name="islab" type="radio" value="1" '.($islab?"checked":"").' />Yes</label>
    <label><input name="islab" type="radio" value="0" '.($islab?"":"checked").' />No</label>
   </td></tr> 	
</table>
    <div id="specialized_view">
    <div class="row" id="term-info-page">
    <script>
    $(function(){
    	$(".list-group-item").click(function(){
    		$(this).parent().find(".list-group-item.active").removeClass("active");
    		$(this).addClass("active");
    	});
    });
    </script>
    <div class="list-group local-nav col-md-3">
      <a class="list-group-item active" href="#overview" data-toggle="tab">Overview</a>
      <a class="list-group-item " href="#instructor" data-toggle="tab">Instructor</a>
    </div>
    <div class="tab-content col-md-9">
      <div class="tab-pane active" id="overview">
        <table class="table bottom_line">
          <tbody>';
          if($courseabout!=""){
          	$html.= "
          	<tr><td colspan='2'>
          		<h4>About</h4>
          		 $courseabout
          	</td></tr>
          	";
          }
          if($courseobj!=""){
          	$html.= "
          	<tr><td colspan='2'>
          		<h4>Objectives</h4>
          		<textarea name='objectives' style='width:60%;min-height:150px'>$courseobj</textarea>
          	</td>
          	</tr>
          	";
/*          $objectives=explode("*",$courseobj);          
          	for($i=1;$i<count($objectives);$i++)
          	$html.= "<li>".$objectives[$i]."</li>";
          	$html.= "</ul></td></tr>
          	";
*/          }          
          if($courseoutcomes!=""){
          	$html.= "
          	<tr><td colspan='2'>
          		<h4>Outcomes</h4>
          		<textarea class='input' name='outcomes' style='width:60%;min-height:150px'>$courseoutcomes</textarea>
          	</td>
          	</tr>
          	";
          }                    
$html.="          <tr><th>
              <strong>Course Instructor</strong>
            </th>
            <td>";
		$query="SELECT * from users as u,term_faculties as tf,faculties as f where tf.term_id = '$term' and tf.faculty_id = f.id and f.user_id = u.id";  
		$res=mysql_query($query);
		$facultyid=$facultyname=$facultymail=$facultydept="";
		while($row=mysql_fetch_assoc($res))
		{
			$facultyid=$row['faculty_id'];
			$facultyname=$row['name'];
			$facultymail=$row['email'];
			$facultydept=$row['department_id'];
		}
		$query="SELECT * from term_departments where term_id = '$term'";  
		$res=mysql_query($query);
		while($row=mysql_fetch_assoc($res))
		{
			$deptid=$row['department_id'];
		}
		$query="SELECT distinct(email),name from users as u,term_faculties as tf,faculties as f where tf.faculty_id = f.id and f.user_id = u.id and department_id='$deptid'";
		$res=mysql_query($query);
		$html.="<select name='instructor'><option value=''>Not Assigned</option>";
		while($row=mysql_fetch_assoc($res))						 
$html.= "<option value='".$row["email"]."' ".($row["email"]==$facultymail?"selected":"").">".$row["name"]."</option>";
		$html.="</select>";
$html.="  
          </td></tr>
          <tr><th>
              <strong>Departments Offered</strong>
            </th>
            <td>              ";
	$query="SELECT * from term_departments as td,departments as d where td.department_id = d.id and td.term_id = '$term'";  
		$res=mysql_query($query);
		$ct=0;
		while($row=mysql_fetch_assoc($res))
		{
			if($ct>0)$html.= ",";
			$html.= $row['name'];	
			$ct++;
		}
		$ct=0;
$html.='
          </td></tr>             
          <tr><td colspan="2"><input type="submit" class="btn btn-default" value="Update" /></td></tr>      
        </tbody></table>
        </form>
      </div>
      <div class="tab-pane " id="instructor">';
	$html.="
	<a href='/db/profile/$facultymail' >$facultyname</a><br/>
	Email:$facultymail@nitt.edu
	";   
$html.="	
      </div>
    </div>
  </div>
</div>
  </div>
</div>
  </div>";
//if(sizeof($_POST)==0)  
echo $html;
}
else if(isset($_GET['delete'])){
$deptid=$_GET['delete'];
$query="SELECT * FROM departments where id = '$deptid'";
$res=mysql_query($query);
while($row=mysql_fetch_assoc($res))
$deptname=$row['name'];
$html="<form action='dept.php?delete=$deptid' method='POST'>
Do You Really want to delete the $deptname Department ? This is a Irreversible action<br/><br/>
<input type='radio' value='yes' name='confirm' />Yes<br/><br/>
<input type='radio' value='no'  name='confirm' />No<br/><br/>
<input type='submit' value='Delete' />
</form>
";
if(sizeof($_POST)==0)echo $html;
else {
	$query="DELETE FROM departments where id = '$deptid'";
	if(isset($_POST['confirm']) && $_POST['confirm'] == 'yes'){
	mysql_query($query);
	echo $deptname." is deleted Successfully";
	}
	else
	{
	echo "Phew, $deptname is not deleted";
	}
}
}
else if(isset($_GET['edit'])){
$dept=$_GET['edit'];
$query="SELECT * FROM departments where id = '$dept'";
$res=mysql_query($query);
while($row=mysql_fetch_assoc($res))
{
$short=$row['short'];
$dname=$row['name'];
$hodid=$row['hod_id'];
$rollpre=$row['rollno_prefix'];
}
$query="SELECT name FROM faculties as f,users as u where f.id = '$hodid' and f.user_id = u.id";
$res=mysql_query($query);
while($row=mysql_fetch_assoc($res))
{
$hodname=$row['name'];
}
$html=<<<DOC
<div class="container">
      <div class="s-push"></div>
      <form action="/db/admin/dept.php?edit=$dept" class="new_department" id="new_department" method="post"><div style="margin:0;padding:0;display:inline">
  <fieldset>
    <legend>Edit Department</legend>
    <div class="field">
      <input class="form-control" id="department_short" name="department[short]" placeholder="Short Form. eg: CSE" type="text" value='$short'>
    </div>
    <div class="field">
      <input class="form-control" id="department_name" name="department[name]" placeholder="Department Name" type="text" value='$dname'>
    </div>
    <div class="field">
      <select class="selectpicker show-tick show-menu-arrow" data-header="Select a HOD" data-live-search="true" id="department_hod_id" name="department[hod_id]" title="Select HOD" style="">
DOC;
$query="SELECT f.id,u.name FROM faculties as f,users as u where f.user_id=u.id and department_id=".$_GET['edit'];
$res=mysql_query($query);
while($row=mysql_fetch_assoc($res))
$html.="<option value='".$row['id']."' ".($row['name']==$hodname?'selected':'').">".$row['name']."</option>";
$html.=<<<ABC
      </select>
    </div>
    <div class="field">
      <input class="form-control" id="department_rollno_prefix" name="department[rollno_prefix]" placeholder="Roll Number Prefix" type="text" value='$rollpre' >
    </div>
    <div class="actions">
      <input class="btn btn-primary btn-large" name="commit" type="submit" value="Update Department">
      <a class="btn btn-default btn-small" href="/db/admin/dept.php">Back</a>
    </div>
  </fieldset>
</form>
    </div>
ABC;

if(sizeof($_POST)==0)
echo $html;
else {
	$dept=$_POST['department'];
	$query="UPDATE departments SET ";
	$q1="";$i=0;
	foreach($dept as $entry=>$val){
	$entry=mysql_real_escape_string($entry);
	$val=mysql_real_escape_string($val);	
		if($i>0)$q1.=",";
		$i++;
		$q1.=$entry." = '$val'";
	}
	$query=$query.$q1." WHERE id = ".$_GET['edit'];
	echo $query;
	mysql_query($query);
}
}
else 
if(isset($_GET['new'])){
$html=<<<DOC
<div class="container">
      <div class="s-push"></div>
      <form action="/db/admin/dept.php?new=1" class="new_department" id="new_department" method="post"><div style="margin:0;padding:0;display:inline">
  <fieldset>
    <legend>New Department</legend>
    <div class="field">
      <input class="form-control" id="department_short" name="department[short]" placeholder="Short Form. eg: CSE" type="text">
    </div>
    <div class="field">
      <input class="form-control" id="department_name" name="department[name]" placeholder="Department Name" type="text">
    </div>
    <div class="field">
      <select class="selectpicker show-tick show-menu-arrow" data-header="Select a HOD" data-live-search="true" id="department_hod_id" name="department[hod_id]" title="Select HOD" style="">
DOC;
$query="SELECT f.id,u.name FROM faculties as f,users as u where f.user_id=u.id";
$res=mysql_query($query);
while($row=mysql_fetch_assoc($res))
$html.="<option value='".$row['id']."'>".$row['name']."</option>";
$html.=<<<ABC
      </select>
    </div>
    <div class="field">
      <input class="form-control" id="department_rollno_prefix" name="department[rollno_prefix]" placeholder="Roll Number Prefix" type="text">
    </div>
    <div class="actions">
      <input class="btn btn-primary btn-large" name="commit" type="submit" value="Create Department">
      <a class="btn btn-default btn-small" href="/db/admin/dept.php">Back</a>
    </div>
  </fieldset>
</form>
    </div>
ABC;

if(sizeof($_POST)==0)
echo $html;
else {
	$dept=$_POST['department'];
	$query="INSERT INTO departments(";
	$q1=$q2="";$i=0;
	foreach($dept as $entry=>$val){
	$entry=mysql_real_escape_string($entry);
	$val=mysql_real_escape_string($val);	
		if($i>0){$q1.=",";$q2.=",";}
		$i++;
		$q1.=$entry;
		$q2.="'$val'";
	}
	$query=$query.$q1.") VALUES(".$q2.")";
	echo $query;
	mysql_query($query);
}
}
else {
$html=<<<DOC
	<div class="container">
      <div class="s-push"></div>
      <div class="span12" style="text-align:center">
  <h3>Departments</h3>
      </div>
<a href="/db/admin/dept.php?new=1" class="btn btn-default btn-small">
  <span class="glyphicon glyphicon-plus" style="color: green; "></span> 
  Add Department
</a>
<br>
<br>

<table class="table">
  <thead>
    <tr>
      <th>Department Name</th>
      <th colspan="2">Action</th>
    </tr>
  </thead>
  <tbody>
DOC;
	$query="SELECT * FROM departments";
	$res=mysql_query($query);
	while($row=mysql_fetch_assoc($res))
	$html.='  
    <tr>
      <td><a class="btn btn-small btn-link" href="/db/admin/department.php?dept='.$row["id"].'">'.$row["name"].'</a></td>
      <td><a class="btn btn-default btn-small" href="/db/admin/dept.php?edit='.$row["id"].'">Edit</a></td>
      <td><a class="btn btn-mini btn-danger" data-confirm="Are you sure?" data-method="delete" href="/db/admin/dept.php?delete='.$row["id"].'" rel="nofollow">Remove</a></td>
    </tr>';
$html.=<<<DOC
  </tbody>
</table>

<br>

<a href="/db/admin/dept.php?new=1" class="btn btn-default btn-small">
  <span class="glyphicon glyphicon-plus" style="color: green; "></span> 
  Add Department
</a>
    </div>
DOC;
echo $html;
}
?>
  </div>
    </div>
  </div>
</div>
</body>
</html>
