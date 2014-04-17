<?php
$term=$_GET['query'];
$term=explode("/",$term);
$term=$term[1];
require_once "connect.php";
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
}
?>
<html>
<head><title>Course Management System</title>
<link rel='stylesheet' href='/db/css/bootstrap.min.css' />
<link rel='stylesheet' href='/db/css/application_custom.css' />
<script src='/db/js/jquery.min.js' ></script>
<script src='/db/js/bootstrap.min.js' ></script>
</head>
<body>
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
    <img src='/db/img/nitt_logo.png' align='left' height='100' />
    <h1 style='display:inline;position:relative;left:25%;bottom:-35px;'>Course Management System</h1>
    <img src='/db/img/nitt_gj_logo.png' align='right' height='100' />    
    </div>
  </div>
  <div class='row min10'>
    <div class='col1 min80 out'>
    <span style='position:relative;float:right' ><?php echo "$user->email ( ".$user->rank()." )";?></span>        
	<div class="panel panel-default">
	<a href='/db/' class='btn btn-info' >Go Back</a>
	<br/>
	<div class="container" id="content" style="opacity: 1;">
  <div id="term">
    <h3>     
      <small><?php echo $subcode?></small>
	<?php echo $coursename?>
    </h3>
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
          <tbody>
          <?php
          if($courseabout!=""){
          	echo "
          	<tr><td colspan='2'>
          		<h4>About</h4>
          		 $courseabout
          	</td></tr>
          	";
          }
          if($courseobj!=""){
          $objectives=explode("*",$courseobj);          
          	echo "
          	<tr><td colspan='2'>
          		<h4>Objectives</h4><ul>
          	";
          	for($i=1;$i<count($objectives);$i++)
          	echo "<li>".$objectives[$i]."</li>";
          	echo "</ul></td></tr>
          	";
          }          
          if($courseoutcomes!=""){
          $outcomes=explode("*",$courseoutcomes);          
          	echo "
          	<tr><td colspan='2'>
          		<h4>Outcomes</h4><ul>
          	";
          	for($i=1;$i<count($outcomes);$i++)
          	echo "<li>".$outcomes[$i]."</li>";
          	echo "</ul></td></tr>
          	";
          }                    
          ?>
          <tr><th>
              <strong>Course Instructor</strong>
            </th>
            <td>
<?php
		$query="SELECT * from users as u,term_faculties as tf,faculties as f where tf.term_id = '$term' and tf.faculty_id = f.id and f.user_id = u.id";  
		$res=mysql_query($query);
		while($row=mysql_fetch_assoc($res))
		{
			$facultyid=$row['faculty_id'];
			$facultyname=$row['name'];
			$facultymail=$row['email'];
		}
		echo "<a href='/db/profile/$facultymail'>$facultyname</a>";
?>              
          </td></tr>
          <tr><th>
              <strong>Departments Offered</strong>
            </th>
            <td>              
<?php
	$query="SELECT * from term_departments as td,departments as d where td.department_id = d.id and td.term_id = '$term'";  
		$res=mysql_query($query);
		$ct=0;
		while($row=mysql_fetch_assoc($res))
		{
			if($ct>0)echo ",";
			echo $row['name'];	
			$ct++;
		}
		$ct=0;
?>
          </td></tr>                   
        </tbody></table>
      </div>
      <div class="tab-pane " id="instructor">
	<?php echo "
	<a href='/db/profile/$facultymail' >$facultyname</a><br/>
	Email:{$facultymail}@nitt.edu
	";   
     ?>
	
      </div>
    </div>
  </div>
</div>
  </div>
</div>
  </div>
    </div>
  </div>
</div>
</body>
</html>
