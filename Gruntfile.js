module.exports = function(grunt) {
	grunt.loadNpmTasks("grunt-contrib-uglify");
	grunt.loadNpmTasks('grunt-contrib-yuidoc');

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		uglify: {
			bundleloader: {
				options: {
					mangle: true,
					/*mangleProperties: true,*/
					compress: true,
					reserveDOMProperties: true,
				},
				files: [{
					src: "bundleloader.js",
					dest: "bundleloader.min.js"
				}]
			}
		},

		yuidoc: {
			compile: {
				name: '<%= pkg.name %>',
				description: '<%= pkg.description %>',
				version: '<%= pkg.version %>',
				url: '<%= pkg.homepage %>',
				options: {
					paths: '.',
					outdir: 'doc'
				}
			}
		}
	});

	grunt.registerTask("default", "uglify");
};