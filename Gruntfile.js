module.exports = function(grunt) {
    grunt.initConfig({
        //tagindex: {target: {}},
        lunr_index_generator: {
            index: {
                src: ['_site/**/*.html'],
                dest: 'assets/js/posts-index.json'
            }
        }
    });

    //grunt.loadTasks('_site');
    //grunt.registerTask('default', ['tagindex']);
    grunt.loadNpmTasks('grunt-lunr-index-generator');
    grunt.registerTask('default', ['lunr_index_generator']);
}
