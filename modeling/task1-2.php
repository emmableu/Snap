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
    <a href="task1-1.php" class="btn-top btn btn-default had-btn-lg ">#1</a>
    <a href="task1-2.php" class="btn-top btn btn-default had-btn-lg active">#2</a>
    <a href="task1-3.php" class="btn-top btn btn-default had-btn-lg">#3</a>
    <a href="task1-4.php" class="btn-top btn btn-default had-btn-lg">#4</a>
	<a href="task1-4.php" class="btn-top btn btn-default had-btn-lg">#5</a>
	<a href="task1-4.php" class="btn-top btn btn-default had-btn-lg">#6</a>
	<a href="task1-4.php" class="btn-top btn btn-default had-btn-lg">#7</a>
    </div>
    </div>

	<div id="wrapper">
        <nav id="sidebar">

        <h3>Step 2.1: Angles and Turning-1</h3>
        <ol>
                <li>
                Perform the four experiments described on the right.</li>
                <li>
                    Then, experiment with the last script (shown right):<br>
                    <img class="imageRight" src="https://bjc.edc.org/bjc-r/img/1-introduction/angles-and-turning.png" alt="repeat (2): {move (100) steps, wait (.5) secs, move (-100) steps, wait (.5) secs, turn (180) degrees, wait (.5) secs}" title="repeat (2): {move (100) steps, wait (.5) secs, move (-100) steps, wait (.5) secs, turn (180) degrees, wait (.5) secs}">
                    <ol>
                        <li>
                            Experiment with a <em>quarter</em> turn (90 degrees):
                            <!--<div class="sidenote">Use the <img class="inline" src="https://bjc.edc.org/bjc-r/img/blocks/point-in-direction-blank.png" alt="point in direction" title="point in direction" /> block to reset the direction, if needed.</div>-->
                            <ol style="list-style-type:lower-roman;">
                                <li>Change the <code>turn</code> block <em>input</em> by clicking on the 180 and typing 90.</li>
                                <li>
                                	Adjust the number of repetitions (the number you give to <code>repeat</code>) until you get the sprite to finish facing the same way it started.<br>

                                </li>
                            </ol>
                        </li>
                        <li>
                            Experiment with a <em>tenth</em> of a turn (36 degrees).
                            <ul>
                                <li>What input must you give to <code>repeat</code> to get the sprite to finish facing the same way it started? </li>
                            </ul>
                        </li>
                        <li>Try different input values for the <code>move</code> <var>-100</var> <code>steps</code> block (like -50, -10, or -90), and do some of the turning experiments (above) again. Does this change the values needed for the <code>repeat</code> block?</li>
                        <li>Try completely removing the second <code>move</code> block (right-click or control-click and then choose "delete"). Try some of the turning experiments again.</li>
                    </ol>
                </li>
				<li>
                	<img class="inline" src="https://bjc.edc.org/bjc-r/img/icons/talk-with-your-partner.png" alt="Talk with Your Partner" title="Talk with Your Partner"> Describe what you've learned about turning angles.
      <!--              <div class="endnote"><strong>Be precise:</strong>  One way to make sure you understand is to explain what's going on to your partner, detail by detail.  </div> -->
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
				 <iframe id="snap" width="100%" height="100%" src="../snap.html?assignment=none#open:http://localhost/isnap/modeling/starters/U1L3-AngleExperiments1.xml"></iframe>
			</div>
			<div id="content">
				<div style="overflow-y: scroll; height: 100%;">

    </body>