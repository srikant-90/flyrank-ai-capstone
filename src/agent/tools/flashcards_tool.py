import json
from pathlib import Path
from typing import List, Dict, Any

class FlashcardsTool:
    """
    Exports active-recall flashcards using a strict schema for Anki or Obsidian ingestion.
    """
    def __init__(self, output_file: str = "sample_data/flashcards.json"):
        self.output_path = Path(output_file)

    def validate_and_export(self, cards: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Validates flashcards against schema and appends them to JSON file.
        
        Schema:
        {
          "cards": [
            {
              "front": str,
              "back": str,
              "tags": List[str],
              "source": str
            }
          ]
        }
        """
        valid_cards = []
        for i, card in enumerate(cards):
            if not isinstance(card, dict):
                continue
            front = card.get("front", "").strip()
            back = card.get("back", "").strip()
            tags = card.get("tags", ["ai-research"])
            source = card.get("source", "arXiv Scout")
            
            if front and back:
                valid_cards.append({
                    "id": f"card_{i+1}",
                    "front": front,
                    "back": back,
                    "tags": tags if isinstance(tags, list) else [str(tags)],
                    "source": source
                })

        existing_data = {"cards": []}
        if self.output_path.exists():
            try:
                existing_data = json.loads(self.output_path.read_text(encoding="utf-8"))
            except Exception:
                existing_data = {"cards": []}

        existing_data["cards"].extend(valid_cards)
        self.output_path.write_text(json.dumps(existing_data, indent=2), encoding="utf-8")
        
        return {
            "success": True,
            "exported_count": len(valid_cards),
            "output_path": str(self.output_path)
        }
