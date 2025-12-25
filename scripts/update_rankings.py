import json
import csv
import requests
from bs4 import BeautifulSoup

URL = "https://www.fifa.com/fifa-world-ranking/men"
OUT_JSON = "data/rankings.json"
OUT_CSV = "data/rankings.csv"

resp = requests.get(URL, timeout=20)
resp.raise_for_status()

soup = BeautifulSoup(resp.text, "html.parser")

rows = soup.select("table tbody tr")

rankings = []

for row in rows:
    cols = row.find_all("td")
    if len(cols) < 3:
        continue

    rankings.append({
        "rank": cols[0].get_text(strip=True),
        "team": cols[1].get_text(strip=True),
        "points": cols[2].get_text(strip=True)
    })

with open(OUT_JSON, "w", encoding="utf-8") as f:
    json.dump(rankings, f, indent=2)

with open(OUT_CSV, "w", newline="", encoding="utf-8") as f:
    writer = csv.DictWriter(f, fieldnames=["rank", "team", "points"])
    writer.writeheader()
    writer.writerows(rankings)