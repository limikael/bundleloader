BundleLoader
============

BundleLoader provides an easy way to load a javascript file and run it, and to show a progress bar while the script is being loaded. The progress bar is not particularly themable at the moment. It is intended for bundled games, for example. 

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
