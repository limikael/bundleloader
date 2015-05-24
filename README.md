bundleloader
============

Load a javascript file and run it.

It is intended for bundled games, for example.

Use like this:

	<html>
		<script src="bundleloader.min.js"></script>
		<script>
			var loader=new BundleLoader();

			loader.onload=function() {
				console.log("the script is loaded...");
			}

			loader.load("myscript.js");
		</script>
	</html>