<!DOCTYPE html>
<html>
<head>
	<title>Login</title>
	<link href="//netdna.bootstrapcdn.com/bootstrap/3.0.0/css/bootstrap.min.css" rel="stylesheet" id="bootstrap-css">
	<link href="mycss.css" rel="stylesheet">
	<script src="//netdna.bootstrapcdn.com/bootstrap/3.0.0/js/bootstrap.min.js"></script>
	<script src="//code.jquery.com/jquery-1.11.1.min.js"></script>
	<script src="https://apis.google.com/js/platform.js" async defer></script>
	<meta name="google-signin-client_id" content="521385511834-er43prbn9pafd13jkl31i4k1dsft4ptm.apps.googleusercontent.com" >
</head>
<body>


<div class="container">
    <div class="row">
        <div class="col-md-4 col-md-offset-4">
            <div class="account-box">
                <div class="or-box">

                    <div class="row">
                        <div class="col-md-12">
                        	<center><div class="g-signin2" data-onsuccess="onSignIn"></div></center>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </div>
</div>


<script type="text/javascript">
	function onSignIn(googleUser) {
	  var profile = googleUser.getBasicProfile();


      if(profile){
          $.ajax({
                type: 'POST',
                url: 'login_pro.php',
                data: {id:profile.getId(), name:profile.getName(), email:profile.getEmail()}
                // alert('posting suceeded');
            }).done(function(data){
                console.log(data);
                alert(data);
                alert('posting succeeded');
                window.location.href = 'home.php';
            }).fail(function() {
                alert( "Posting failed." );
            });
      }


    }
</script>


</body>
</html>