BundleLoader
============

It is a common pattern to use tools like browserify to bundle several javascript
from an application into one large file. This creates a challenge if we want to 
show a progress bar when the application is loading, since the progress bar 
can't be bundled with the application itself. This is a kind of chicken or egg
problem, the progress bar to load the application can't be bundled with application,
because then the application would need to be laoded before the progress bar could
be shown.

BundleLoader provides an easy way to load a javascript file and run it, and
to show a progress bar while the script is being loaded. It is under 4k in size.

There is room for improvement. There is currently no way to theme the loading bar,
it would be nice to have, using CSS for example.

* Download [bundleloader.min.js](http://rawgit.com/limikael/bundleloader/master/bundleloader.min.js), 3.7kb
* Check the [Class Docs](http://rawgit.com/limikael/bundleloader/master/doc/classes/BundleLoader.html)

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
