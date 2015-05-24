module.exports = function(grunt) {
	grunt.loadNpmTasks("grunt-contrib-uglify");

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		uglify: {
			bundleloader: {
				options: {
					mangle: true,
					compress: true,
					mangleProperties: true,
					reserveDOMProperties: true
				},
				files: [{
					src: "bundleloader.js",
					dest: "bundleloader.min.js"
				}]
			}
		}
	});

	grunt.registerTask("default", "uglify");
};