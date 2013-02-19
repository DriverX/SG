module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-text-replace');
	grunt.loadNpmTasks('grunt-closure-tools');

	grunt.initConfig({
		files : {
			name : "sg"
		},
		replace: {
			portal: {
        src: "build/portal/suggests.html",
        dest: "dist/portal/",
        replacements: [
          {
            from: "@@script_src",
            to: "./sg.js"
          }
        ]
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
				src: ["<%= concat.lib.dest %>", "build/portal/sg_config.js"],
				dest: "dist/portal/<%= files.name %>.js"
			}
		},
		closureCompiler: {
      options: {
        compilerFile: "./libexec/closure/build/compiler.jar"
      },
			lib: {
        options: {},
				src: "<%= concat.lib.dest %>",
				dest: "<%= files.name %>.min.js"
			},
			portal: {
				src: "<%= concat.portal.dest %>",
				dest: "dist/portal/<%= files.name %>.min.js"
			}
		}
	});

	grunt.registerTask("lib", ["concat:lib", "closureCompiler:lib"]);
	grunt.registerTask("portal", ["concat:lib", "concat:portal", "closureCompiler:portal", "replace:portal"]);
	grunt.registerTask("default", ["lib"]);
};
