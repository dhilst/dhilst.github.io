---
---
'use strict';
module.exports = function(grunt) {
    grunt.log.writeln('Registering tagindex');
    grunt.registerMultiTask('tagindex', '', function() {

        grunt.log.writeln('Compiling tag index');

        var posts = [
            {% for post in site.posts %}{
                title: "{{ post.title | replace: '"','\\"'}}", 
                    date: {{ post.date | date: '%s'}},
                    url: "{{ post.url }}",
                    id: "{{ post.id }}",
                    tags: [{% for tag in post.tags %}"{{ tag }}", {% endfor %}],
                    path: "{{ post.path }}",
            },
            {% endfor %}
        ];

        // add posts to tag object
        var tags = {};
        posts.forEach(function(post) {
            post.tags.forEach(function(tag) {
                if (!(tag in tags)) {
                    tags[tag] = [];
                };
                tags[tag].push({ url: post.url, title:post.title });
            });
        })

        // output to json
        var jsonfile = require('jsonfile');
        var file = 'assets/js/tagindex-compiled.js';
        jsonfile.writeFileSync(file, tags);
        grunt.log.ok(file + 'generated');
    });
}

