"""Check static SEO contracts using the standard HTML and XML parsers."""

import json
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urljoin, urlsplit
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
ORIGIN = "https://schulte-grid.luopeike.com"


class Page(HTMLParser):
    def __init__(self, html):
        super().__init__(convert_charrefs=True)
        self.links = []
        self.references = []
        self.robots = ""
        self.structured = []
        self.in_json = False
        self.json_text = ""
        self.feed(html)

    def handle_starttag(self, tag, attributes):
        attrs = dict(attributes)
        if tag == "link":
            self.links.append(attrs)
        if tag == "meta" and attrs.get("name") == "robots":
            self.robots = attrs.get("content", "")
        for name in ("href", "src"):
            if attrs.get(name):
                self.references.append(attrs[name])
        if tag == "script" and attrs.get("type") == "application/ld+json":
            self.in_json = True
            self.json_text = ""

    def handle_data(self, data):
        if self.in_json:
            self.json_text += data

    def handle_endtag(self, tag):
        if tag == "script" and self.in_json:
            self.structured.append(json.loads(self.json_text))
            self.in_json = False


def file_for_url(url):
    path = unquote(urlsplit(url).path)
    relative = path.lstrip("/")
    if path.endswith("/"):
        relative += "index.html"
    elif not Path(relative).suffix:
        relative += ".html"
    target = (ROOT / relative).resolve()
    assert target.is_relative_to(ROOT), f"Path escapes website: {url}"
    return target


def check():
    namespace = {"s": "http://www.sitemaps.org/schemas/sitemap/0.9"}
    tree = ET.parse(ROOT / "sitemap.xml")
    urls = [node.text for node in tree.findall("s:url/s:loc", namespace)]
    assert len(urls) == len(set(urls)), "Duplicate sitemap URLs"
    pages = {}
    for url in urls:
        assert url.startswith(ORIGIN + "/"), f"Unexpected sitemap origin: {url}"
        assert not urlsplit(url).query and not urlsplit(url).fragment, url
        assert not urlsplit(url).path.endswith(".html"), f"Redirect URL in sitemap: {url}"
        page = Page(file_for_url(url).read_text())
        canonical = [link.get("href") for link in page.links if link.get("rel") == "canonical"]
        assert canonical == [url], f"Canonical mismatch: {url}: {canonical}"
        assert "noindex" not in page.robots, f"Noindex sitemap page: {url}"
        for reference in page.references:
            target = urljoin(url, reference)
            if urlsplit(target).netloc == urlsplit(ORIGIN).netloc:
                assert file_for_url(target).is_file(), f"Broken reference: {url} -> {reference}"
        pages[url] = page
    for url, page in pages.items():
        alternates = {link.get("hreflang"): link.get("href") for link in page.links
                      if link.get("rel") == "alternate" and link.get("hreflang")}
        for language, alternate in alternates.items():
            assert alternate in pages, f"Hreflang target absent from sitemap: {url} -> {alternate}"
            reciprocal = {link.get("hreflang"): link.get("href") for link in pages[alternate].links
                          if link.get("rel") == "alternate" and link.get("hreflang")}
            assert reciprocal == alternates, f"Nonreciprocal hreflang: {url}: {language}"
    not_found = Page((ROOT / "404.html").read_text())
    assert "noindex" in not_found.robots, "404 page must not be indexed"
    assert ORIGIN + "/404" not in pages, "404 page must not be in sitemap"
    for reference in not_found.references:
        assert file_for_url(urljoin(ORIGIN + "/missing/nested/path", reference)).is_file(), reference
    assert f"Sitemap: {ORIGIN}/sitemap.xml" in (ROOT / "robots.txt").read_text()
    assert "X-Robots-Tag: noindex" in (ROOT / "_headers").read_text()
    print(f"SEO checks passed: {len(pages)} canonical pages, reciprocal hreflang, assets, JSON-LD, and 404.")


if __name__ == "__main__":
    check()
