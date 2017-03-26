module.exports = function(grunt) {
    grunt.initConfig({
        tagindex: {target: {}},
    });

    grunt.loadTasks('_site');
    grunt.registerTask('default', ['tagindex']);
}
