import urllib.request
import urllib.parse
import xml.etree.ElementTree as ET
from typing import List, Dict, Any

ATOM_NS = {'atom': 'http://www.w3.org/2005/Atom'}

def fetch_arxiv_papers(query: str, max_results: int = 3) -> List[Dict[str, Any]]:
    """
    Connects live to the arXiv REST API and retrieves recent papers matching the search query.
    
    Args:
        query: Search keywords (e.g. "LLM agent tool use")
        max_results: Number of papers to fetch (default 3)
        
    Returns:
        List of paper metadata dictionaries containing title, authors, summary, url, published date.
    """
    encoded_query = urllib.parse.quote(f'all:{query}')
    url = f'http://export.arxiv.org/api/query?search_query={encoded_query}&start=0&max_results={max_results}&sortBy=submittedDate&sortOrder=descending'
    
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'ResearchScoutAgent/1.0'})
        with urllib.request.urlopen(req, timeout=10) as response:
            xml_data = response.read()
            
        root = ET.fromstring(xml_data)
        papers = []
        
        for entry in root.findall('atom:entry', ATOM_NS):
            title = entry.find('atom:title', ATOM_NS)
            summary = entry.find('atom:summary', ATOM_NS)
            id_elem = entry.find('atom:id', ATOM_NS)
            published = entry.find('atom:published', ATOM_NS)
            
            authors = []
            for author in entry.findall('atom:author', ATOM_NS):
                name = author.find('atom:name', ATOM_NS)
                if name is not None and name.text:
                    authors.append(name.text.strip())
            
            title_text = title.text.replace('\n', ' ').strip() if title is not None and title.text else "Untitled"
            summary_text = summary.text.replace('\n', ' ').strip() if summary is not None and summary.text else "No abstract provided."
            paper_url = id_elem.text.strip() if id_elem is not None and id_elem.text else "https://arxiv.org"
            pub_date = published.text.strip()[:10] if published is not None and published.text else "Unknown"
            
            papers.append({
                "title": title_text,
                "authors": authors,
                "summary": summary_text[:300] + ("..." if len(summary_text) > 300 else ""),
                "full_abstract": summary_text,
                "url": paper_url,
                "published": pub_date
            })
            
        return papers

    except Exception as e:
        print(f"[ArXiv Tool Error] Failed to fetch live papers: {e}")
        return []

if __name__ == "__main__":
    results = fetch_arxiv_papers("LLM Agent Tool", 2)
    print(f"Fetched {len(results)} papers live from arXiv API:")
    for p in results:
        print(f"- {p['title']} ({p['published']}): {p['url']}")
