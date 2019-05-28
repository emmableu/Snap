<?php

include 'config.php';

?>

<!doctype html>

<html>


	<head>
		<meta charset="UTF-8">
		<title>View Tasks</title>
		<link rel="stylesheet" type="text/css" href="table.css">
		<style>
			html {
				height: 100%;
			}
			body {
				height: calc(100% - 20px);
			}
			/* Credit: http://stackoverflow.com/questions/5645986/two-column-div-layout-with-fluid-left-and-fixed-right-column */
			#wrapper {
				height: 100%;
			}
			.compact #content {
				width: 200px;
			}
            .jumbotron {
				background-color: #808080;
				color: #fff;
				padding: 5em inherit;
				font-family: Montserrat, sans-serif;
			}
			#content {
				float: right;
				width: 800px;
				display: block;
				height: 100%;
			}
			.compact #sidebar {
				width: calc(100% - 210px);
			}
			#sidebar {
				width: calc(80% - 810px);
				height: 100%;
				overflow-y: scroll;
				float: left;
                padding-left: 12px;
			}
			#right {
				width: calc(120% - 810px);
				height: 100%;
				/* overflow-y: scroll;s */
				float: left;
			}




			#cleared {
				clear: both;
			}
		</style>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.0/css/bootstrap.min.css">
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
        <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.0/js/bootstrap.min.js"></script>
	</head>


	<body>
    <div class="jumbotron text-center">
	<h2>Snap Problems</h2>

    <div id="buttons-top" class="btn-group">
    <a href="task1-1.php" class="btn-top btn btn-default had-btn-lg">#1</a>
    <a href="task1-2.php" class="btn-top btn btn-default had-btn-lg">#2</a>
    <a href="task1-4.php" class="btn-top btn btn-default had-btn-lg">#3</a>
    <a href="task1-3.php" class="btn-top btn btn-default had-btn-lg active">#4</a>
    <a href="task1-4.php" class="btn-top btn btn-default had-btn-lg ">#5</a>
	<a href="task1-4.php" class="btn-top btn btn-default had-btn-lg">#6</a>
	<a href="task1-4.php" class="btn-top btn btn-default had-btn-lg">#7</a>

    </div>
    </div>

	<div id="wrapper">
        <nav id="sidebar">

        <h3>Step 3: Blocks with Inputs</h3>
        <li>
                    Make 5 copies of the script and modify those copies so that they make pinwheel designs like these with 3, 4, 5, 6, and 12 branches.
                    <img src="https://bjc.edc.org/bjc-r/img/1-introduction/Blockswith-Inputs_img/3.png" height="120" alt="pinwheel with 3 branches" title="pinwheel with 3 branches">
                    <img src="https://bjc.edc.org/bjc-r/img/1-introduction/Blockswith-Inputs_img/4.png" height="120" alt="pinwheel with 4 branches" title="pinwheel with 4 branches">
                    <img src="https://bjc.edc.org/bjc-r/img/1-introduction/Blockswith-Inputs_img/5.png" height="120" alt="pinwheel with 5 branches" title="pinwheel with 5 branches">
                    <img src="https://bjc.edc.org/bjc-r/img/1-introduction/Blockswith-Inputs_img/6.png" height="120" alt="pinwheel with 6 branches" title="pinwheel with 6 branches">
                    <img src="https://bjc.edc.org/bjc-r/img/1-introduction/Blockswith-Inputs_img/12.png" height="120" alt="pinwheel with 12 branches" title="pinwheel with 12 branches">
                </li>
            <ol>
                        <li>
                            Change the inputs in script A to draw an asterisk with:
                            <ol style="list-style-type:lower-roman;">
                                <li>5 branches</li>
                                <li>8 branches</li>
                                <li>3 branches</li>
                            </ol>
                        </li>
                        <li>
                        	Make a  copy of the three-branch script you built (right-click or control-click the script, and choose "duplicate").
                            <ol style="list-style-type:lower-roman;">
                                <li>Then, remove the  <code>move</code> <var>-100</var> <code>steps</code>  block.</li>
                                <li>What does this new script do?</li>
                            </ol>
                        </li>
                        <li>
                            Make another copy of the three-branch script you built, and then:
                            <ol style="list-style-type:lower-roman;">
                                <li>Change it to a four-branch script.</li>
                                <li>Remove the <code>move</code> <var>-100</var> <code>steps</code>  block again.</li>
                                <li>What does this new script do?</li>
                            </ol>
                        </li>
            	</ol>
            	</li>
        </ol>
			<!-- </ol> -->
		<p>
        <!-- This is the first time you'll be using blocks that are shaped like <i>ovals</i>. This means these blocks are used to <i>return</i> values and not to do anything, and they are meant to be dragged into other oval inputs, which will <i class="chrome-extension-mutihighlight chrome-extension-mutihighlight-style-1">turn</i> white to indicate you can drop them in. -->
        </p>
        <p>
        <!-- Remember, to find out what a block does, right-click on it (control-click on a Mac) and choose "help..." -->
        </p>



        </nav>


			<button id="compact" style="position: absolute; right: 30px; top: 3px" onclick="toggleCompact()">
				&#8594
			</button>
			<script type="text/javascript">
				if (typeof(Storage) !== "undefined") {
					if (localStorage.compact === 'true') toggleCompact();
				}
			</script>
			<div id="right">
				 <iframe id="snap" width="100%" height="100%" src="../snap.html?assignment=none#open:http://localhost/isnap/modeling/starters/U1L3-Pinwheel.xml"></iframe>
			</div>
			<div id="content">
				<div style="overflow-y: scroll; height: 100%;">

    </body>