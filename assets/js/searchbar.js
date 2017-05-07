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
			this.field('content');
			workingPosts.forEach((post) => this.add(post));
		});
		$searchBar.keyup(() => {
			const searchText = $searchBar.val();
			if (searchText.length > 1) {
				const results = index.search($searchBar.val());
				if (results.length > 0) {
					const list = results.map((r) => '<li><span class="post-tags-mark">&raquo;</span><a class="search-result" href="'+r.ref+'">' + store[r.ref].title + '</a></li>').join('');
					$searchResults.empty().append('<ul class="search-result-list">' + list + '</ul>');
				}
			} else {
				$searchResults.empty();
			}
		});
	});
});

