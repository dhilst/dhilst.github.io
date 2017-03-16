---
---
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
];
