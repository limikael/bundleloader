/**
 * Load a javascript and run it, and shows a progress bar while doing so.
 *
 * For making the transition into the actualy application, there are some
 * other features, such as the ability to not make the progress bar go
 * to 100%.
 * @class BundleLoader
 */
function BundleLoader() {
	var s;

	this.element = document.createElement("div");
	this.element.className = "bundleloader";
	s = this.element.style;
	s.position = "fixed";
	s.top = "0";
	s.left = "0";
	s.width = "100%";
	s.height = "100%";
	s.background = "#000000";
	s.display = "none";
	s.zIndex = 1;
	s.overflow = "hidden";

	this.titleElement = document.createElement("div");
	this.titleElement.innerHTML = "LOADING";
	s = this.titleElement.style;
	s.position = "absolute";
	s.top = "50%";
	s.width = "100%";
	s.left = "0";
	s.height = "100px";
	s.color = "#ffffff";
	s.textAlign = "center";
	s.fontFamily = "arial";
	//	s.fontWeight = "bold";
	s.fontSize = "17px";
	s.marginTop = "-32px";
	this.element.appendChild(this.titleElement);

	this.borderElement = document.createElement("div");
	s = this.borderElement.style;
	s.width = "33%";
	s.height = "10px";
	s.border = "2px solid white";
	s.borderRadius = "5px";
	s.marginLeft = "auto";
	s.marginRight = "auto";
	s.top = "50%";
	s.position = "relative";
	s.padding = "2px";
	this.element.appendChild(this.borderElement);

	this.progressElement = document.createElement("div");
	s = this.progressElement.style;
	s.background = "#ffffff";
	s.height = "10px";
	s.width = "0%";
	s.left = "0"
	s.borderRadius = "2px";
	s.position = "relative";
	this.borderElement.appendChild(this.progressElement);

	this.animateInterval = null;
	this.loadRequest = null;
	this.completeProgress = null;

	this._visible = true;
}

var proto = BundleLoader.prototype;

/**
 * Wait for the body to exist so we can attach ourselves.
 * @method waitForBodyAndAttach
 * @private
 */
proto.waitForBodyAndAttach = function() {
	var el;

	if (this._parentElement) {
		el = document.getElementById(this._parentElement);
		//console.log("p: " + this._parentElement + " ... el: " + el);
	} else {
		el = document.body;
	}

	if (!el) {
		if (this.loadRequest)
			setTimeout(this.waitForBodyAndAttach.bind(this), 10);

		return;
	}

	if (this._visible && !el.contains(this.element))
		el.appendChild(this.element);
}

/**
 * Show the loader, with message and optional percent.
 *
 * The percent parameter is optional. If this is omitted the
 * progress bar will show as in an indefinite state.
 * @method show
 * @param {String} title The message to show.
 * @param {Number} [percent] The percentage of the completion to show.
 */
proto.showProgress = function(title, percent) {
	this.title = title;

	if (this.animateInterval)
		clearInterval(this.animateInterval);

	this.animateInterval = null;

	this.element.style.display = "block";
	this.titleElement.innerHTML = title;

	this.borderElement.style.display = "block";

	if (percent != null && percent != undefined) {
		percent = Math.min(100, parseFloat(percent));
		this.progressElement.style.left = "0";
		this.progressElement.style.width = percent + "%";
	} else {
		this.animateInterval = setInterval(this.onAnimateInterval.bind(this), 30);
		this.progressElement.style.width = "33%";
		this.progressElement.style.left = "0%";
	}
}

/**
 * Show only a message without the progress bar.
 * @method showMessage
 * @param {String} title
 */
proto.showMessage = function(title) {
	this.title = title;

	if (this.animateInterval)
		clearInterval(this.animateInterval);

	this.animateInterval = null;

	this.element.style.display = "block";
	this.titleElement.innerHTML = title;

	this.borderElement.style.display = "none";
}

/**
 * Animate the loader if the size of the load job is not known.
 * @method onAnimateInterval
 * @private
 */
proto.onAnimateInterval = function() {
	var current = parseFloat(this.progressElement.style.left);

	current += 3;
	if (current > 67)
		current = 0;

	this.progressElement.style.left = current + "%";
}

/**
 * Hide the loader.
 * @method hide
 */
proto.hide = function() {
	if (this.animateInterval)
		clearInterval(this.animateInterval);

	this.animateInterval = null;

	this.element.style.display = "none";
}

/**
 * Load javascript.
 *
 * This function loads the javascript from the specified url, and
 * then runs it.
 *
 * By default, the loading screen will be hidden when the script
 * is run. If there are extra resources to be loaded as part of the
 * application startup, specify a number for the completeProgress
 * parameter, and the loading screen will not hide itself, but instead
 * stop at the specified percentage.
 *
 * It is then up to the loaded bundle to actually hide the loader when
 * all resources are loaded.
 * @method load
 * @param {String} urls Url or array of urls to the javascript main bundle file.
 * @param {String} [message] The message to show while loading.
 * @param {Number} [completeProgress] The progress to stop at.
 */
proto.load = function(urls, message, completeProgress) {
	if (!message)
		message = "LOADING";

	if (typeof urls == "string")
		urls = [urls];

	this.completeProgress = completeProgress;

	if (!this.completeProgress)
		this.completeProgress = 100;

	if (this.loadRequest)
		throw new Error("Already loading");

	this.urls = urls;
	this.currentUrlIndex = 0;

	this.loadNext();
	this.showProgress(message);

	this.waitForBodyAndAttach();
}

/**
 * Load next url.
 * @method loadNext
 */
proto.loadNext = function() {
	if (this.loadRequest)
		throw new Error("Already loading");

	if (this.currentUrlIndex >= this.urls.length) {
		if (this.completeProgress && this.completeProgress < 100)
			this.showProgress(this.title, this.completeProgress);

		else
			this.hide();

		if (this.onload)
			this.onload();

		return;
	}

	//console.log("loading url: " + this.urls[this.currentUrlIndex]);

	this.loadRequest = new XMLHttpRequest();
	this.loadRequest.open("GET", this.urls[this.currentUrlIndex], true);
	this.loadRequest.responseType = 'arraybuffer';

	this.loadRequest.onprogress = this.onLoadRequestProgress.bind(this);
	this.loadRequest.onload = this.onLoadRequestLoad.bind(this);
	this.loadRequest.onerror = this.onLoadRequestError.bind(this);

	this.loadRequest.send();
}

/**
 * Load request progress.
 * @method onLoadRequestProgress
 * @private
 */
proto.onLoadRequestProgress = function(e) {
	if (e.total) {
		var baseProgress = this.currentUrlIndex * this.completeProgress / this.urls.length;
		var targetProgress = (this.currentUrlIndex + 1) * this.completeProgress / this.urls.length;

		this.showProgress(
			this.title,
			baseProgress + (targetProgress - baseProgress) * e.loaded / e.total
		);
	}
}

/**
 * Load request complete.
 * @method onLoadRequestLoad
 * @private
 */
proto.onLoadRequestLoad = function() {
	if (this.loadRequest.status != 200 || !this.loadRequest.response.byteLength) {
		this.loadRequest = null;
		this.showMessage("LOAD ERROR");
		return;
	}

	var blob = new Blob([this.loadRequest.response], {
		type: "text/javascript"
	});

	var req = this.loadRequest;
	this.loadRequest = null;

	var script = document.createElement("script");
	script.src = window.URL.createObjectURL(blob);
	script.onload = function() {
		setTimeout(function() {
			//console.log("rs: "+req.readyState);

			this.currentUrlIndex++;
			this.showProgress(this.title, this.completeProgress * this.currentUrlIndex / this.urls.length);
			this.loadNext();
		}.bind(this), 100);
	}.bind(this);

	document.getElementsByTagName('head')[0].appendChild(script);
}

/**
 * On error.
 * @method onLoadRequestError
 * @private
 */
proto.onLoadRequestError = function() {
	this.loadRequest = null;
	this.showMessage("LOAD ERROR");
}

/**
 * Should the loader be visible?
 * @property visible
 */
Object.defineProperty(proto, 'visible', {
	get: function() {
		return this._visible;
	},
	set: function(value) {
		this._visible = value;

		if (this._visible && document.body && !document.body.contains(this.element))
			document.body.appendChild(this.element);

		if (!this._visible && document.body && document.body.contains(this.element))
			document.body.removeChild(this.element);
	}
});

/**
 * Set parent element.
 */
Object.defineProperty(proto, 'parentElement', {
	get: function() {
		return this._parentElement
	},
	set: function(parentElement) {
		this._parentElement = parentElement;

		if (this._parentElement)
			this.element.style.position = "absolute";

		else
			this.element.style.position = "fixed";

		if (this.element.parentElement)
			this.element.parentElement.removeChild(this.element);
	}
});

if (typeof module !== 'undefined')
	module.exports = BundleLoader;