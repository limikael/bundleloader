/**
 * Loads a javascript and runs it, and shows a progress bar while doing so.
 * Can also show only the progress bar.
 * @class BundleLoader
 */
function BundleLoader() {
	var s;

	this.element = document.createElement("div");
	s = this.element.style;
	s.position = "fixed";
	s.top = "0";
	s.left = "0";
	s.width = "100%";
	s.height = "100%";
	s.background = "#000000";
	s.display = "none";

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

	this.waitForBody();
}

var proto=BundleLoader.prototype;

/**
 * Wait for the body to exist so we can attach ourselves.
 * @method waitForBody
 * @private
 */
proto.waitForBody = function() {
	if (!document.body) {
		setTimeout(this.waitForBody.bind(this), 0);
		return;
	}

	document.body.appendChild(this.element);
}

/**
 * Show the loader, with message and optional percent.
 * @method show
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
 * Show only a message.
 * @method showMessage
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
 * @method load
 * @private
 */
proto.load = function(url, message, completeProgress) {
	if (!message)
		message = "LOADING";

	this.completeProgress = completeProgress;

	if (!this.completeProgress)
		this.completeProgress = 100;

	if (this.loadRequest)
		throw new Error("Already loading");

	this.loadRequest = new XMLHttpRequest();
	this.loadRequest.open("GET", url, true);
	this.loadRequest.responseType = 'arraybuffer';

	this.loadRequest.onprogress = this.onLoadRequestProgress.bind(this);
	this.loadRequest.onload = this.onLoadRequestLoad.bind(this);
	this.loadRequest.onerror = this.onLoadRequestError.bind(this);

	this.loadRequest.send();

	this.showProgress(message);
}

/**
 * Load request progress.
 * @method onLoadRequestProgress
 * @private
 */
proto.onLoadRequestProgress = function(e) {
	if (e.total) {
		this.showProgress(this.title, this.completeProgress * e.loaded / e.total);
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

	this.loadRequest = null;

	var script = document.createElement("script");
	script.src = window.URL.createObjectURL(blob);
	script.onload = function() {
		if (this.completeProgress && this.completeProgress < 100)
			this.showProgress(this.title, this.completeProgress);

		else
			this.hide();

		if (this.onload)
			this.onload();
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