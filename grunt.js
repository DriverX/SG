module.exports = function( grunt ) {
  grunt.initConfig({
    files: {
      name: "sg"
    },
    concat: {
      dist: {
        src: ["lib/yass.mod.js", "lib/sg.js"],
        dest: "<%= files.name %>.js",
        separator: ";"
      }
    },
    min: {
      dist: {
        src: ["<config:concat.dist.dest>"],
        dest: "<%= files.name %>.min.js"
      }
    },
    lint: {
      files: ["grunt.js"]
    }
  });
  
  grunt.registerTask("default", "lint concat min");
};
