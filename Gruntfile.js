module.exports=function(grunt){
    require('load-grunt-tasks')(grunt);
    grunt.initConfig({
        watch: {
            dist: {
                files: ['js/*.js'],
                tasks: ['default'],
                options: {
                    spawn: true,
                },
            },
        },
        jshint: {
            all: ['js/*.js']
        },
        uglify: {
            my_target: {
                files: {
                    'js/min/game-min.js': ['js/Play.js','js/game.js']
                }
        }
    }
});
grunt.registerTask('default',['uglify']);
}
