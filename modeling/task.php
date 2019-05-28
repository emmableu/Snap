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
				width: calc(100% - 810px);
				height: 100%;
				float: left;
			}
			#cleared {
				clear: both;
			}
		</style>

	</head>

	<body>
		<div id="wrapper">
			<button id="compact" style="position: absolute; right: 30px; top: 3px" onclick="toggleCompact()">
				&#8594
			</button>
			<script type="text/javascript">
				if (typeof(Storage) !== "undefined") {
					if (localStorage.compact === 'true') toggleCompact();
				}
			</script>
			<div id="sidebar">
				 <iframe id="snap" width="300%" height="100%" src="../snap.html?assignment=view"></iframe>
			</div>
			<div id="content">
				<div style="overflow-y: scroll; height: 100%;">

    </body>