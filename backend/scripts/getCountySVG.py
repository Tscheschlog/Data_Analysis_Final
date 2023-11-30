import requests
from bs4 import BeautifulSoup

def get_svg_content(county):
    url = f"https://www.redfin.com/city/6208/FL/{county}/housing-market"
    
    response = requests.get(url)
    html_content = response.text
    
    soup = BeautifulSoup(html_content, 'html.parser')
    svg_element = soup.find('svg')
    
    if svg_element:
        return str(svg_element)
    else:
        return None

if __name__ == "__main__":
    import sys

    if len(sys.argv) != 2:
        print("Usage: python script.py <county>")
        sys.exit(1)

    county = sys.argv[1]
    svg_content = get_svg_content(county)

    if svg_content:
        print(svg_content)
    else:
        print(f"SVG not found for the specified county: {county}")
        sys.exit(1)
