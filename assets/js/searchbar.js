Object.defineProperty(Object.prototype, 'inspect', {
    value: function(prefix){ console.log(prefix, this); return this; },
    enumerable: false
});


$(() => {
'use strict';

	const $searchBar = $("#search-bar [type='text']"); 
	const $searchResults = $('#search-results');

	$searchBar.focus();

    $searchResults.notIn = function(results){
        return this.find('li').filter((_, li) =>
            results.indexOf($(li).find('a').attr('href') === -1));
    };

    $searchResults.hrefs = function(){
        return this.find('li a').map(a => $(a).attr('href')).toArray();
    };

    $searchResults.appendNew = function(results, store){
       return results.filter(x => this.hrefs().indexOf(x) === -1).forEach(url =>
           this.find('ul').append(
               $(["<li>",
                   "  <span class='post-tags-mark'>&raquo;</span>",
                   "  <a href='"+url+"' class='search-result'>",
                        store.title(url),
                   "  </a>",
                   "</li>"].join(''))));
    };


	$.getJSON('/posts.json', (posts) => {
        posts.pop(); // Remove __SENTINEL__

        const store = (function(posts){ 
            var s = {};
            posts.forEach(p => s[p.url] = p);
            return {
                title: function(url){ return s[url].title; },
            };
        })(posts)

		const index = lunr(function() { 
			this.ref('url');
			this.field('title');
            posts.forEach(post => this.add(post));
		});

		$searchBar.keyup(() => {
            if ($searchBar.val().length > 0) {
                const results = index.search($searchBar.val()).map(r => r.ref);
                $searchResults.notIn(results).remove();
                $searchResults.appendNew(results, store);
            } else {
                $searchResults.find('ul li').remove();
            }
		});
	});
});

