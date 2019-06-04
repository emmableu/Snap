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
		<script type="text/javascript">
			function loadSnap() {
				var assignment = "none";
				var xhr = new XMLHttpRequest();
				xhr.onreadystatechange = function() {
					if (xhr.readyState==4 && xhr.status==200) {
						var contentWindow = document.getElementById('snap').contentWindow;
						contentWindow.Assignment.setID(assignment);
						emptyProject = '<project name="Untitled" app="iSnap 2.1, http://go.ncsu.edu/isnap" version="1" assignment="none"><data>{}</data><notes></notes><thumbnail></thumbnail><stage name="Stage" width="480" height="360" costume="0" tempo="60" threadsafe="false" lines="round" ternary="true" codify="false" inheritance="true" sublistIDs="false" scheduled="false" id="1"><pentrails></pentrails><costumes><list id="2"></list></costumes><sounds><list id="3"></list></sounds><variables></variables><blocks></blocks><scripts></scripts><sprites><sprite name="Sprite" idx="1" x="0" y="0" heading="90" scale="1" rotation="1" draggable="true" costume="0" color="80,80,80" pen="tip" id="8"><costumes><list id="9"></list></costumes><sounds><list id="10"></list></sounds><blocks></blocks><variables></variables><scripts></scripts></sprite></sprites></stage><hidden></hidden><headers></headers><code></code><blocks></blocks><variables></variables><editing></editing></project>';
						contentWindow.ide.droppedText(emptyProject);
					}
				};
				id = 1;
				project = "none";
				xhr.open("GET", "code.php?id=" + id + "&project=" + project, true);
				xhr.send();
				window.location.hash = id;
				window.index = rowIDs.indexOf(parseInt(id));
			}
			function copy(inp) {
				// is element selectable?
				if (inp) {
					if (window.getSelection) {
						window.getSelection().removeAllRanges();
					}
					if (document.createRange) {
						var rangeObj = document.createRange();
						rangeObj.selectNodeContents(inp);
						window.getSelection().addRange(rangeObj);
					}
					try {
						// copy text
						document.execCommand('copy');
					}
					catch (err) {
						alert('please press Ctrl/Cmd+C to copy');
					}
				}
			}
			// Credit: http://stackoverflow.com/a/29428076/816458
			function viewJSON(jsonObject) {
				var winURL='json-viewer.php';
				var params = { 'json' : JSON.stringify(jsonObject) };
				var form = document.createElement("form");
				form.setAttribute("method", "post");
				form.setAttribute("action", winURL);
				form.setAttribute("target", "_blank");
				for (var i in params) {
					if (params.hasOwnProperty(i)) {
						var input = document.createElement('input');
						input.type = 'hidden';
						input.name = i;
						input.value = params[i];
						form.appendChild(input);
					}
				}
				document.body.appendChild(form);
				form.submit();
				document.body.removeChild(form);
			}

			var compact = false;
			function toggleCompact() {
				var button = document.getElementById("compact");
				var wrapper = document.getElementById("wrapper");
				compact = !compact;
				button.innerHTML = compact ? "&#8592" : "&#8594";
				if (compact) wrapper.classList.add("compact");
				else wrapper.classList.remove("compact");

				if (typeof(Storage) !== "undefined") {
					localStorage.compact = compact;
				}
			}
		</script>
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
				<!-- <?php
function tryGetParam($key, $mysqli) {
	return array_key_exists($key, $_GET) ? $mysqli->real_escape_string($_GET[$key]) : NULL;
}



$mysqli = new mysqli($host, $user, $password, $db);
if ($mysqli->connect_errno) {
    die ("Failed to connect to MySQL: (" . $mysqli->connect_errno . ") " . $mysqli->connect_error);
}

// $id = $mysqli->real_escape_string($_GET['id']);
// $id = tryGetParam('description', $mysqli);

// $description = tryGetParam('description', $mysqli);
// $start = tryGetParam('start', $mysqli);
// $end = tryGetParam('end', $mysqli);
// $snapshots = tryGetParam('snapshots', $mysqli);
// $userID = tryGetParam('userID', $mysqli);

// echo "<h3>Project: $id</h3>";
// echo "<p>This lists all logs for this project. Click on a date to see the code at that time, or click here and then use the A and D keys to scroll through snapshots. Loads quickest on Chrome.</p>";

// $where = "WHERE projectID='$id'";
// if ($description) {
// 	$where .= " AND description = '$decription'";
// }

// // TODO: If IDs are out of order, this can omit rows that should be included
// // If we use the start and end as bookend, we also have to require them to
// // be real IDs in the result set, which isn't ideal either...

$query = "SELECT id, name, description, KCs, difficulty FROM $table ORDER BY id";
$result = $mysqli->query($query);
if (!$result) {
    die ("Failed to retrieve data: (" . $mysqli->errno . ") " . $mysqli->error);
}

echo "<table cellspacing='0'>";
echo "<thead><th>ID</th><th>Name</th><th>Description</th><th>KCs</th><th>Difficulty</th></thead>";
while($row = mysqli_fetch_array($result)) {

    $rid = $row['id'];
    $name = $row['name'];
    $description = $row['description'];
    $KCs = $row['KCs'];
    $difficulty = $row['difficulty'];
    $link = "display.php";

    // $first = $time;
    // $class = "";
    echo "<a title=\"test\" href='#json-$rid' onclick='loadSnap()'>test</a>";
    echo "<tr><td>$rid</td><td>$name</td><td>$description</td><td>$KCs</td><td>$difficulty</td></tr>";
    // echo "<tr><td>$rid</td><td>$rid</td><td>$message</td><td>$link</td></tr>";
}
echo "</table>";

				?> -->
				</div>
			</div>
			<div id="cleared"></div>
			<script type="text/javascript">
				var rowIDs = [].slice.call(document.getElementsByClassName("rid"))
					.map(function(td) { return parseInt(td.innerHTML); })
				var index = 0;
				var projectID = "none";
				document.addEventListener('keypress', function(event) {
					var code = event.which || event.keyCode;
					if (code === 100 && index < rowIDs.length - 1) {
						loadSnap(rowIDs[++index], projectID);
					} else if (code === 97 && index > 0) {
						loadSnap(rowIDs[--index], projectID);
					} else if (code === 99) {
						var td = document.getElementById("" + rowIDs[index]);
						console.log(td);
						copy(td);
						event.preventDefault();
						return false;
					}
				});
				var hash = parseInt(window.location.hash.replace("#", ""));
				if (!isNaN(hash)) {
					index = binarySearch(rowIDs, hash);
					if (index >= rowIDs.length) {
						index = rowIDs.length - 1;
					}
				}
				var snap = document.getElementById("snap");
				snap.onload = function() {
					snap.contentWindow.ide.toggleStageSize();
					if (index >= 0 && rowIDs.length > 0) {
						loadSnap(rowIDs[index], projectID);
					}
				}

				function binarySearch(array, key) {
					var low = 0;
					var high = array.length - 1;
					while (low <= high) {
						var mid = (low + high) >> 1;
						if (array[mid] === key) {
							return mid;
						}
						if (array[mid] < key) {
							low = mid + 1;
						} else {
							high = mid - 1;
						}
					}
					return high + 1;
				}
			</script>
		</div>
	</body>
</html>