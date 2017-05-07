'use strict';

$(() => {

	const $searchBar = $("#search-bar [type='text']") ; 
	const $searchResults = $('#search-results');

	$searchBar.focus();

	$.getJSON('/posts.json', (posts) => {
		const workingPosts = posts.filter((post) => !post.blogger);
		const store = {};
		workingPosts.forEach((post) => store[post.url] = post);
		const index = lunr(function() { 
			this.ref('url');
			this.field('title');
			workingPosts.forEach((post) => this.add(post));
		});
		$searchBar.keyup(() => {
			const searchText = $searchBar.val();
			if (searchText.length > 1) {
				var results = index.search(searchText);
				if (results.length > 0) {
                    console.log(results);
                    // Remove unmatched
                    $searchResults.find('li').filter(function(){
                        return results.map(r => r.ref)
                            .indexOf($(this).find('a').attr('href')) === -1;
                    }).remove();
                    // Remove dupplicates
                    const $anchors = $searchResults.find('li a');
                    if ($anchors.length > 0) {
                        results = results.filter(function(r) {
                            return $anchors.map(function(){
                                return $(this).attr('href');
                            }).toArray().indexOf(r.ref) === -1;
                        });
                        console.log('Filtred results: ' + results);
                    }
                    // Append result
                    results.forEach((r) => {
                        $searchResults.find('ul').append(
                            $(["<li>",
                               "  <span class='post-tags-mark'>&raquo;</span>",
                               "  <a href='"+r.ref+"' class='search-result'>",
                                    store[r.ref].title,
                               "  </a>",
                               "</li>"].join(''))
                        );
                    });
				}
			} else {
				$searchResults.find('ul').empty();
			}
		});
	});
});

