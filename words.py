import yaml
import random
import re
import operator as op
from typing import Any, Iterator
from math import sqrt
from collections import Counter
from pathlib import Path
from dataclasses import dataclass


Vec = tuple[Counter, set[str], float]

@dataclass(frozen=True)
class Post:
    path: str
    title: str
    tags: set[str]
    vec: Vec
    body: str
    words: list[str]


# https://stackoverflow.com/questions/29484529/cosine-similarity-between-two-words-in-a-list
def words2vec(words: list[str]) -> Vec:
    # count the characters in word
    cw = Counter(words)
    # precomputes a set of the different characters
    sw = set(cw)
    # precomputes the "length" of the word vector
    lw = sqrt(sum(c * c for c in cw.values()))

    # return a tuple
    return cw, sw, lw


def cosdis(v1: Vec, v2: Vec) -> float:
    # which characters are common to the two words?
    common = v1[1].intersection(v2[1])
    # by definition of cosine distance we have
    return sum(v1[0][ch] * v2[0][ch] for ch in common) / v1[2] / v2[2]


def read_posts() -> Iterator[Post]:
    for post in Path("./_posts/").glob("*.md"):
        with post.open() as post:
            content = post.read()

        try:
            head, body = content.split("---", 2)[1:]
        except:
            print(len(x), post)
            raise RuntimeError
        words = re.findall(r"\w+", body)
        head = yaml.safe_load(head)
        assert type(head) is dict
        title = head.get("title", "No title")
        tags = set(head.get("tags", []))
        path = post.name
        vec = words2vec(words)
        post = Post(path, title, tags, vec, body, words)
        yield post


posts = list(read_posts())
d: dict[str, Vec] = {post.path: post.vec for post in posts}

post = random.choice(posts)
pname, pwords = post.path, post.words
pvec = d[pname]

dscored = sorted(
    {pname_: cosdis(pvec, vec) for pname_, vec in d.items() if pname_ != pname}.items(),
    key=op.itemgetter(1),
    reverse=True,
)

print("All tags")
tags = Counter(tag for p in posts for tag in p.tags)
print(tags)

print("Tags used once")
tonce = [t for t, count in tags.items() if count == 1]
print(f"{len(tonce) * 100/ len(tags):.02f}%")
print(tonce)


print("Posts wihtout tags")
print(list(p.path for p in posts if not p.tags))


print(f"Post: {pname}")
print("Top 3 similar posts")
for pname in dscored[0:3]:
    print(pname)

def jaccard_distance(a: set[Any], b: set[Any]) -> float:
    if not a or not b:
        return 0

    return len(a & b) / len(a | b)


dscored_bytag = sorted(
    ((p.path, jaccard_distance(p.tags, post.tags)) for p in posts if p.path != post.path),
    key=op.itemgetter(1),
    reverse=True
)

print("Top 3 similar posts by tag")
for pname, d in dscored_bytag[0:3]:
    print(pname, d)
