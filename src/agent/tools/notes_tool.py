from pathlib import Path
from typing import List, Dict, Optional

class NotesTool:
    """
    Manages local file system access for learning goals and note vault files.
    """
    def __init__(self, base_dir: str = "sample_data"):
        self.base_path = Path(base_dir)
        self.goals_file = self.base_path / "learning_goals.md"
        self.notes_dir = self.base_path / "notes"
        self.notes_dir.mkdir(parents=True, exist_ok=True)

    def read_learning_goals(self) -> str:
        """Reads the user's active learning goals file."""
        if not self.goals_file.exists():
            return "No active learning goals file found."
        return self.goals_file.read_text(encoding="utf-8")

    def list_notes(self) -> List[str]:
        """Lists available markdown notes in the vault."""
        return [f.name for f in self.notes_dir.glob("*.md")]

    def read_note(self, filename: str) -> str:
        """Reads content from a specific markdown note file."""
        target_path = self.notes_dir / filename
        if not target_path.exists():
            return f"Note file '{filename}' does not exist."
        return target_path.read_text(encoding="utf-8")

    def append_to_note(self, filename: str, content: str) -> bool:
        """Appends new synthesized note section to an existing markdown file."""
        target_path = self.notes_dir / filename
        try:
            existing = target_path.read_text(encoding="utf-8") if target_path.exists() else f"# {filename.replace('.md', '').title()}\n\n"
            updated = existing.strip() + "\n\n" + content.strip() + "\n"
            target_path.write_text(updated, encoding="utf-8")
            return True
        except Exception as e:
            print(f"[Notes Tool Error] Failed to write note: {e}")
            return False
