module.exports = function(grunt) {
	grunt.loadNpmTasks('grunt-replace');
	
	grunt.initConfig({
		files : {
			name : "sg"
		},
		replace: {
			portal: {
				options: {
					variables: {
						script_src: "./sg.js"
					}
				},
				files: {
					"dist/portal/": "build/portal/suggests.html"
				}
			}
		},
		concat : {
			lib: {
				src: [
          "lib/sg.core.js",
          "lib/sg.yass.js",
          "lib/sg.tmpl.js",
          "lib/sg.event.js",
          "lib/sg.ajax.js"
        ],
				dest: "<%= files.name %>.js"
			},
			portal: {
				src: ["<config:concat.lib.dest>", "build/portal/sg_config.js"],
				dest: "dist/portal/<%= files.name %>.js"
			}
		},
		min : {
			lib: {
				src : ["<config:concat.lib.dest>"],
				dest : "<%= files.name %>.min.js"
			},
			portal: {
				src : ["<config:concat.portal.dest>"],
				dest : "dist/portal/<%= files.name %>.min.js"
			}
		},
		lint : {
			files : ["grunt.js"]
		}
	});

	grunt.registerTask("lib", "concat:lib min:lib");
	grunt.registerTask("portal", "concat:lib concat:portal min:portal replace:portal");
	grunt.registerTask("default", "lint lib");
};
