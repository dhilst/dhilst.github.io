'use strict';

const execSync = require('child_process').execSync;
const fs = require('fs');
const lunr = require('lunr');
const gulp = require('gulp');

function jekyllBuild() {
    execSync('jekyll build --incremental');
}

function postsJSONRetrieve(path) {
    return JSON.parse(fs.readFileSync(path, 'utf8'));
}

function storeBuild(posts) {
    var store = {};
    posts.forEach((post) => {
        store[post['url']] = { 
            title: post['title'],
            tags: post['tags'],
        };
    });
    return store;
}

function indexBuild(posts) {
    var index = lunr(function() {
        this.field('title', {boost: 10});
        this.field('content');
        this.ref('url');
    });

    posts.forEach((post) => {
       index.add(post);
    });
    return index;
}

function indexSave(index, store, path) {
    fs.writeFileSync(path, "---\n---\n{% raw %}\n");
    fs.appendFileSync(path, JSON.stringify({index: index, store: store}));
    fs.appendFileSync(path, "\n{% endraw %}\n");
}

gulp.task('default', () => {
    jekyllBuild();
    var posts = postsJSONRetrieve('_site/posts.json');
    var store = storeBuild(posts);
    var index = indexBuild(posts);
    indexSave(index, store, 'index.json');
    jekyllBuild();
});
