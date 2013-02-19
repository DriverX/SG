module.exports = function(grunt) {
	grunt.loadNpmTasks('grunt-replace');
	grunt.loadNpmTasks('grunt-closure-tools');

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
          "lib/sg.when.js",
          "lib/sg.event.js",
          "lib/sg.ajax2.js",
          "lib/sg.ajax_manager.js",
          "lib/sg.tmpl.js"
        ],
				dest: "<%= files.name %>.js"
			},
			portal: {
				src: ["<config:concat.lib.dest>", "build/portal/sg_config.js"],
				dest: "dist/portal/<%= files.name %>.js"
			}
		},
		closureCompiler: {
      options: {
        compilerFile: "/Users/ilyushenkov/workspace/SG/libexec/closure/build"
        // "./libexec/closure/build/compiler.jar"
      },
			lib: {
        options: {},
				src: "<config:concat.lib.dest>",
				dest: "<%= files.name %>.min.js"
			},
			portal: {
				src: "<config:concat.portal.dest>",
				dest: "dist/portal/<%= files.name %>.min.js"
			}
		}
	});

	grunt.registerTask("lib", "concat:lib closureCompiler:lib");
	grunt.registerTask("portal", "concat:lib concat:portal closureCompiler:portal replace:portal");
	grunt.registerTask("default", "lib");
};
