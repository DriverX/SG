module.exports = function( grunt ) {
  grunt.initConfig({
    files: {
      name: "sg"
    },
    concat: {
      dist: {
        src: ["lib/yass.mod.js", "lib/sg.js"],
        dest: "<%= files.name %>.js"
      }
    },
    min: {
      dist: {
        src: ["<config:concat.dist.dest>"],
        dest: "<%= files.name %>.min.js"
      }
    }
  });
  
  grunt.registerTask("default", "concat min");
};
