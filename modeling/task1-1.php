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
				float: left;
				padding-left: 12px;

			}
			.jumbotron {
				background-color: #808080;
				color: #fff;
				padding: 5em inherit;
				font-family: Montserrat, sans-serif;
			}
			a.button {
				-webkit-appearance: button;
				-moz-appearance: button;
				appearance: button;

				text-decoration: none;
				color: initial;
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
    <a href="task1-1.php" class="btn-top btn btn-default had-btn-lg active">#1</a>
    <a href="task1-2.php" class="btn-top btn btn-default had-btn-lg">#2</a>
    <a href="task1-3.php" class="btn-top btn btn-default had-btn-lg">#3</a>
    <a href="task1-4.php" class="btn-top btn btn-default had-btn-lg">#4</a>
	<a href="task1-4.php" class="btn-top btn btn-default had-btn-lg">#5</a>
	<a href="task1-4.php" class="btn-top btn btn-default had-btn-lg">#6</a>
	<a href="task1-4.php" class="btn-top btn btn-default had-btn-lg">#7</a>

    </div>
    </div>

	<div id="wrapper">
        <nav id="sidebar">

        <h3>Step 1: Exploring Motion</h3>
		<li>
		Log in to Snap and you can see a few scripts. Before running the sprite, imagine what this algorithm will make the sprite do.<br>
        </li>
		<li>Run the script:<br>
                    <div class="sidenote"></div>
                	<ol>
                    	<li>Click it, and watch what the sprite does. </li>
                        <li>Click <img src="https://bjc.edc.org/bjc-r/img/1-introduction/pen-down.png" height="36" alt="pen down" title="pen down">, and then click your script to run it again.</li>
                	</ol>
                </li>
				<li> Analyze <em>why</em> that script does what it does.</li>

				<!-- <ol start="5"> -->
				<li>
                	Now experiment.<br>
					<ol>
                        <li>Change 100 to 50 as shown <img class="inline" src="https://bjc.edc.org/bjc-r/img/1-introduction/move-50.png" height="36" alt="move (50) steps" title="move (50) steps"> in the <code>move</code> block <em>of your script</em>, and click the script again to run it with the new input value.</li>
                        <li>Click the <img class="inline" src="https://bjc.edc.org/bjc-r/img/blocks/clear.png" height="36" alt="clear" title="clear"> block in the green Pen palette.</li>
                        <div class="endnote">You can click <img class="inline" src="https://bjc.edc.org/bjc-r/img/blocks/clear.png" height="36" alt="clear" title="clear"> (or any block) in the palette or in the scripting area to run it. If you click a block inside a script, the whole script runs.</div>
                        <li>Change the number in the <img class="inline" src="https://bjc.edc.org/bjc-r/img/1-introduction/turn-right-90.png" height="36" alt="turn clockwise (90) degrees" title="turn clockwise (90) degrees"> block and run the script again... and again... and again.</li>
                        <li>Change the number in the <img class="inline" src="https://bjc.edc.org/bjc-r/img/1-introduction/repeat-4.png" alt="repeat (4){}" title="repeat (4){}"> block.</li>
                        <li>Experiment with the input numbers in the turn and <code>repeat</code> blocks. Try to draw a  triangle.</li>
                        <li> Use <span class="center"><img class="inline" src="https://bjc.edc.org/bjc-r/img/blocks/set-pen-size-to-blank.png" height="36" alt="set pen size to ()" title="set pen size to ()"></span> to set the pen size to something like 4 or 10 or 50. Then draw something. </li>
                        <div class="endnote">To change the pen size you must <em>click</em> the <code>set pen size</code> block to run it after you've entered the number you want.</div>
					</ol>
				</li>
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
			<div id="sidebar">
				 <iframe id="snap" width="250%" height="100%" src="../snap.html?assignment=none#open:http://localhost/isnap/modeling/starters/U1L3-task1-1.xml"></iframe>
			</div>
			<div id="content">
				<div style="overflow-y: scroll; height: 100%;">

    </body>