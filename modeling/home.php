<!-- <?php
session_start();
?>

<!DOCTYPE html>
<html>
<head>
	<title>Hello</title>
</head>
<body>


<h1>Hello,   </strong><?php echo $_SESSION['name'];  ?> </h1>
<p><strong>Id: </strong><?php echo $_SESSION['id'];  ?></p>
<p><strong>Name: </strong><?php echo $_SESSION['name'];  ?></p>
<p><strong>Email: </strong><?php echo $_SESSION['email'];  ?></p>

<form action="../snap.html?assignment=view">
    <input type="submit" value="Task 1" />
</form>
<br><br>

<form action="task.php">
    <input type="submit" value="Task 2" />
</form>
<br><br>

<form action="task.php">
    <input type="submit" value="Task 3" />
</form>
<br><br>

<form action="task.php">
    <input type="submit" value="Task 4" />
</form>
<br><br>

</body>
</html> -->


<?php

include('config.php');


	$mysqli = new mysqli($host, $user, $password, $db);
	if ($mysqli->connect_errno) {
		die ("Failed to connect to MySQL: (" . $mysqli->connect_errno . ") " . $mysqli->connect_error);
	}

	// $id = $mysqli->real_escape_string($_PUT['id']);

	$query = "SELECT task1 FROM users WHERE id = '25' ";


  $task1 = $mysqli->query($query);
  $test = "";
	if (!$task1) {
		die ("Failed to retrieve data: (" . $mysqli->errno . ") " . $mysqli->error);
    }
    while($row = mysqli_fetch_array($task1)) {
      // echo $row['task1'];
      $test = $row['task1'];
      break;
    }

?>

<!DOCTYPE html>
<html lang="en">
<head>
  <!-- Theme Made By www.w3schools.com -->
  <title>Hello</title>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.0/css/bootstrap.min.css">
  <link href="https://fonts.googleapis.com/css?family=Montserrat" rel="stylesheet" type="text/css">
  <link href="https://fonts.googleapis.com/css?family=Lato" rel="stylesheet" type="text/css">
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
  <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.0/js/bootstrap.min.js"></script>
  <style>
  body {
    font: 400 15px Lato, sans-serif;
    line-height: 1.8;
    color: #818181;
  }

  h4 {
    font-size: 19px;
    line-height: 1.375em;
    color: #303030;
    font-weight: 400;
    margin-bottom: 30px;
  }
  .jumbotron {
    background-color: #808080;
    color: #fff;
    padding: 5em inherit;
    font-family: Montserrat, sans-serif;
  }
  .container-fluid {
    padding: 60px 50px;
  }
  .bg-grey {
    background-color: #f6f6f6;
  }

  .thumbnail {
    padding: 0 0 15px 0;
    border: none;
    border-radius: 0;
  }
  .thumbnail img {
    width: 100%;
    height: 100%;
    margin-bottom: 10px;
  }


  .item h4 {
    font-size: 19px;
    line-height: 1.375em;
    font-weight: 400;
    font-style: italic;
    margin: 70px 0;
  }
  .item span {
    font-style: normal;
  }

  .panel-heading {
    color: #fff !important;
    background-color: #808080 !important;
    /* height: 50px; */
    padding: 0.3em;
    border-bottom: 1px solid transparent;
    border-top-left-radius: 0px;
    border-top-right-radius: 0px;
    border-bottom-left-radius: 0px;
    border-bottom-right-radius: 0px;
  }
  .panel-footer {
    background-color: white !important;
  }
  .panel-footer h3 {
    font-size: 32px;
  }
  .panel-footer h4 {
    color: #aaa;
    font-size: 14px;
  }
  .panel-footer .btn {
    margin: 15px 0;
    background-color: #808080;
    color: #fff;
  }
  .navbar {
    margin-bottom: 0;
    background-color: #808080;
    z-index: 9999;
    border: 0;
    font-size: 12px !important;
    line-height: 1.42857143 !important;
    letter-spacing: 4px;
    border-radius: 0;
    font-family: Montserrat, sans-serif;
  }
  .navbar li a, .navbar .navbar-brand {
    color: #fff !important;
  }

  .navbar-default .navbar-toggle {
    border-color: transparent;
    color: #fff !important;
  }

  .slideanim {visibility:hidden;}
  .slide {
    animation-name: slide;
    -webkit-animation-name: slide;
    animation-duration: 1s;
    -webkit-animation-duration: 1s;
    visibility: visible;
  }
  @keyframes slide {
    0% {
      opacity: 0;
      transform: translateY(70%);
    }
    100% {
      opacity: 1;
      transform: translateY(0%);
    }
  }
  @-webkit-keyframes slide {
    0% {
      opacity: 0;
      -webkit-transform: translateY(70%);
    }
    100% {
      opacity: 1;
      -webkit-transform: translateY(0%);
    }
  }
  @media screen and (max-width: 768px) {
    .col-sm-4 {
      text-align: center;
      margin: 25px 0;
    }
    .btn-lg {
      width: 100%;
      margin-bottom: 35px;
    }
  }
  @media screen and (max-width: 480px) {
    .logo {
      font-size: 150px;
    }
  }
  </style>
</head>
<body id="myPage" data-spy="scroll" data-target=".navbar" data-offset="60">

<nav class="navbar navbar-default navbar-fixed-top">
  <div class="container">
    <div class="navbar-header">
      <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#myNavbar">
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
      </button>
      <a class="navbar-brand" href="#myPage">Snap Problems</a>
    </div>
      <ul class="nav navbar-nav navbar-right">
      <li><a href="#"><span class="glyphicon glyphicon-user"></span> Sign Up</a></li>
      <li><a href="#"><span class="glyphicon glyphicon-log-in"></span> Login</a></li>
      </ul>


  </div>
</nav>

<div class="jumbotron text-center">
  <h1>Snap Problems</h1>
  <p>Choose a task you want!</p>
  <!-- <h1> <?php     echo $test;?> </h1> -->

</div>



<!-- Container (Pricing Section) -->
<div id="pricing" class="container-fluid">

  <!-- <div class="row slideanim"> -->
    <div class="col-sm-4 col-xs-12">
      <div class="panel panel-default text-center">
        <div class="panel-heading">
          <h2>Drawing</h2>
        </div>
        <div class="panel-body">
        <div class="list-group">
        <?php if ($test == 1): ?>
            <a href="task1-1.php" class="list-group-item list-group-item-action list-group-item-success"> Task 1</a>
        <?php else :?>
            <a href="task1.php" class="list-group-item list-group-item-action"> Task 1</a>
        <?php endif; ?>
            <a href="#" class="list-group-item list-group-item-action">Task 2</a>
            <a href="#" class="list-group-item list-group-item-action">Task 3</a>

        </div>
        </div>

      </div>
    </div>
    <div class="col-sm-4 col-xs-12">
      <div class="panel panel-default text-center">
        <div class="panel-heading">
          <h2>Loop</h2>
        </div>
        <div class="panel-body">
        <div class="list-group">
            <a href="#" class="list-group-item list-group-item-action"> Task 1</a>
            <a href="#" class="list-group-item list-group-item-action">Task 2</a>
            <a href="#" class="list-group-item list-group-item-action">Task 3</a>

        </div>
        </div>

      </div>
    </div>
    <div class="col-sm-4 col-xs-12">
      <div class="panel panel-default text-center">
        <div class="panel-heading">
          <h2>Variable</h2>
        </div>
        <div class="panel-body">
        <div class="list-group">
            <a href="#" class="list-group-item list-group-item-action"> Task 1</a>
            <a href="#" class="list-group-item list-group-item-action">Task 2</a>
            <a href="#" class="list-group-item list-group-item-action">Task 3</a>

        </div>
        </div>

      </div>
    </div>
  <!-- </div> -->
</div>


<script>
$(document).ready(function(){
  // Add smooth scrolling to all links in navbar + footer link
  $(".navbar a, footer a[href='#myPage']").on('click', function(event) {
    // Make sure this.hash has a value before overriding default behavior
    if (this.hash !== "") {
      // Prevent default anchor click behavior
      event.preventDefault();

      // Store hash
      var hash = this.hash;

      // Using jQuery's animate() method to add smooth page scroll
      // The optional number (900) specifies the number of milliseconds it takes to scroll to the specified area
      $('html, body').animate({
        scrollTop: $(hash).offset().top
      }, 900, function(){

        // Add hash (#) to URL when done scrolling (default click behavior)
        window.location.hash = hash;
      });
    } // End if
  });

  $(window).scroll(function() {
    $(".slideanim").each(function(){
      var pos = $(this).offset().top;

      var winTop = $(window).scrollTop();
        if (pos < winTop + 600) {
          $(this).addClass("slide");
        }
    });
  });
})
</script>

</body>
</html>
