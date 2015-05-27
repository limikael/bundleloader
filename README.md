BundleLoader
============



BundleLoader provides an easy way to load a javascript file and run it, and
to show a progress bar while the script is being loaded. The progress bar is 
not particularly themable at the moment. It is intended for bundled games, 
for example. 

Basic Usage
-----------

The basic usage is like this, to just load a file and do something when it
has been loaded and run:

````html
<html>
	<script src="bundleloader.min.js"></script>
	<script>
		var loader = new BundleLoader();

		loader.onload = function() {
			console.log("the script is loaded...");
		}

		loader.load("myscript.js");
	</script>
</html>
````

More resources
--------------

In the case where there are more resources needed by the loaded bundle, we
can still use the loading screen provided by BundleLoader for the sake of
consistency. In the following example, we assume that the loaded bundle
provides a class called `TheApp`, which is the main application class, and 
that this class can dispatch events to signal its completion.

````html
<html>
	<script src="bundleloader.min.js"></script>
	<script>
		var loader = new BundleLoader();

		loader.onload = function() {

			// Create the application.
			var theApp = new TheApp();

			// Updatethe loading bar when the application signals progress.
			theApp.on("loadProgress", function(ev) {
				loader.showProgress("LOADING RESOURCES", 50+ev.percent/2);
			});

			// Hide the loader on completion.
			theApp.on("loadComplete", function() {
				loader.hide();
			});
		}

		// Let the loading of the bundle represent 50% of the loading bar.
		loader.load("myscript.js", "LOADING", 50);
	</script>
</html>
````
