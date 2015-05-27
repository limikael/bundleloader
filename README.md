bundleloader
============

Load a javascript file and run it.

Show a progress bar while loading.

The progress bar is not particularly themable at the moment. 

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