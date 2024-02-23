import random
import re
import operator as op
from typing import Any, Iterator
from math import sqrt
from collections import Counter
from pathlib import Path


Vec = tuple[Counter, set[str], float]


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


def read_posts() -> Iterator[tuple[str, list[str]]]:
    for post in Path("./_posts/").glob("*.md"):
        with post.open() as post:
            content = post.read()

        words = re.findall(r"\w+", content.split("---", 3)[2])
        yield post.name, words


posts = list(read_posts())
d: dict[str, Vec] = {pname: words2vec(words) for pname, words in posts}

pname, pwords = random.choice(posts)
pvec = d[pname]

dscored = sorted(
    {pname_: cosdis(pvec, vec) for pname_, vec in d.items() if pname_ != pname}.items(),
    key=op.itemgetter(1),
    reverse=True,
)

print(f"Post: {pname}")
print("Top 3 similar posts")
for pname in dscored[0:3]:
    print(pname)
