---
---
(function() {
    'use strict';
    var tags = {};

    [
        {% for post in site.posts %}{
            title: "{{ post.title | replace: '"','\\"'}}", 
            date: {{ post.date | date: '%s'}},
            url: "{{ post.url }}",
            id: "{{ post.id }}",
            tags: [{% for tag in post.tags %}"{{ tag }}", {% endfor %}],
            path: "{{ post.path }}",
        },
        {% endfor %}
    ].forEach(function(post) {
        post.tags.forEach(function(tag) {
            if (!(tag in tags)) {
                console.log('Adding post ' + post.tittle + ' to tag ' + tag);
                tags.tag = { posts: []}  
            };
            tags.tag.posts.push(post);
        });
    })
    console.log(tags);
})();

