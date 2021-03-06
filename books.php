<?php
ini_set('display_startup_errors',1);
ini_set('display_errors',1);
require_once "connect.php";
require_once "login/includes/main.php";
$user= new User();
if(!$user->loggedIn()){
redirect("./login/index.php");
}
?>
<html>
<head><title>Course Management System</title>
<link rel='stylesheet' href='./css/bootstrap.min.css' />
<link rel='stylesheet' href='./css/application_custom.css' />
<script src='./js/jquery.min.js' ></script>
<script src='./js/bootstrap.min.js' ></script>
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
    <img src='./img/nitt_logo.png' align='left' height='100' />
    <h1 style='display:inline;position:relative;left:25%;bottom:-35px;'>Course Management System</h1>
    <img src='./img/nitt_gj_logo.png' align='right' height='100' />    
    </div>
  </div>
  <div class='row min10'>
    <div class='col1 min80 out'>
    <span style='position:relative;float:right' ><?php echo "$user->email ( ".$user->rank()." )";?></span>        
	<div class="panel panel-default">
	<a href='./' class='btn btn-info' >Go Back</a>
	<a href='/db/books.php' class='btn btn-info' >Books</a>	
	<a href='/db/' class='btn btn-info' >Departments</a>			
	<br/>	
<?php
if(!isset($_GET['book']) || $_GET['book']==""){
$html=<<<DOC
<div class="container">
      <div class="s-push"></div>
      <div class="span12" style="text-align:center">
  <h3>List of Books</h3>
</div>
  <a href="/admin/books/new" class="btn btn-default hidden">
    <span class="glyphicon glyphicon-plus" style="color: green;"></span>
    New Book
  </a><table class="table">
  <thead>
    <tr><th>Title</th>  <th>Author</th>      <th>Publisher</th>      <th>Edition</th>      <th ></th>    </tr>
  </thead>
  <tbody>
DOC;
$query="select * from books";
$res=mysql_query($query);
while($row=mysql_fetch_assoc($res))
{
$html.=<<<DOC0
  <tr>
    <td>
      <a href="books.php?book={$row['id']}">{$row['title']}</a>
      ({$row['year']})<br>
      <strong>ISBN:</strong>
      {$row['isbn']}
    </td>  
    <td>
      <div>
DOC0;
$q1="select authors.id,authors.name from book_authors,authors where book_authors.book_id = '".$row['id']."' and book_authors.author_id = authors.id";
$r1=mysql_query($q1);
while($rr1=mysql_fetch_assoc($r1))
$html.='<div>'.$rr1['name'].'</div>';
$html.=<<<DOC2
      </div>
    </td>
    <td>{$row['publisher']}</td>
    <td>{$row['edition']}</td>
    <td>
      <a href="books.php?edit={$row['id']}" class="btn btn-default hidden">
	<span class="glyphicon glyphicon-pencil" style="color: #322dd2;">Edit</span>
      </a>
      <a href="books.php?delete={$row['id']}" class="btn btn-default hidden" data-method="delete" data-confirm="Are you sure?" rel="nofollow">
        <span class="glyphicon glyphicon-trash" style="color: #d2322d;">Remove</span>
      </a>
    </td>
  </tr>
DOC2;
}
$html.=<<<DOC
</tbody></table>

<a href="books.php?new=1" class="btn btn-default hidden">
  <span class="glyphicon glyphicon-plus" style="color: green;"></span>
  New Book
</a>
    </div>
DOC;
echo $html;
}
else if(isset($_GET['book'])){
	$bookid=$_GET['book'];
$query="select * from books where id='$bookid'";
$res=mysql_query($query);
if(mysql_num_rows($res)==0)$html="NO Such Book found ,Try again";
else $html="";
while($row=mysql_fetch_assoc($res))
{
$html=<<<DOC
<div class="container">
      <div class="s-push"></div>
      <p id="notice"></p>
<div class="s-push"></div>

<table class="table table-hover">
  <thead>
    </thead><caption>
      <h3>Book Details</h3>
    </caption>
  
  <tbody>  
    <tr>
      <th>Title</th>
      <td>{$row['title']}</td>
    </tr>
    <tr>
      <th>Author(s)</th>
      <td>
	<ul>
DOC;
$q1="select authors.id,authors.name from book_authors,authors where book_authors.book_id = '".$row['id']."' and book_authors.author_id = authors.id";
$r1=mysql_query($q1);
while($rr1=mysql_fetch_assoc($r1))
$html.='<li>'.$rr1['name'].'</lli>';
$html.="</ul>
      </td>
    </tr>
    <tr>
      <th>Publisher</th>
      <td>{$row['publisher']}</td>
    </tr>
    <tr>
      <th>Edition</th>
      <td>{$row['edition']}</td>
    </tr>
    <tr>
      <th>ISBN</th>
      <td>{$row['isbn']}</td>
    </tr>
    <tr>
      <th>Year</th>
      <td>{$row['year']}</td>
    </tr>
    <tr>
      <th>Online Retail URL:</th>
      <td><a href=''>".($row['online_retail_url']!=''?$row['online_retail_url']:'Not updated')."</a></td>
    </tr>
  </tbody>
</table>
    </div>
";
}
echo $html;	
}
?>
    	</div>
    </div>
  </div>
</div>  
</body>
</html>
