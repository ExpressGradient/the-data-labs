<html>

	<head>

	<title>Event!!!</title>

	<script type="text/javascript">

	function trigger()

	{

	document.getElementById("hover").addEventListener("mouseover", popup);

	function popup()

	{

	alert("Welcome to my WebPage!!!");

	}

	}

	</script>

	<style>

	p

	{

	     font-size:50px;

	     position: fixed;

	     left: 550px;

	     top: 300px;

	}

	</style>

	</head>

	<body  onload="trigger();">

	<p id="hover">Welcome!!!</p>

	</body>

	</html>