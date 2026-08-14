import sys
import argparse
import datetime
from pathlib import Path

# Ensure agent directory is in Python path for tool imports
sys.path.insert(0, str(Path(__file__).resolve().parent))

from tools.arxiv_tool import fetch_arxiv_papers
from tools.notes_tool import NotesTool
from tools.flashcards_tool import FlashcardsTool

BANNER = """
================================================================================
  RESEARCH SCOUT AGENT - Personal AI Research & Study Coach (v1.0 MVP)
================================================================================
"""

class ResearchScoutAgent:
    def __init__(self, base_dir: str = "sample_data", auto_approve: bool = False):
        self.notes_tool = NotesTool(base_dir=base_dir)
        self.flashcards_tool = FlashcardsTool(output_file=f"{base_dir}/flashcards.json")
        self.auto_approve = auto_approve
        self.output_dir = Path(base_dir) / "briefings"
        self.output_dir.mkdir(parents=True, exist_ok=True)

    def run_pipeline(self, topic: str = "LLM Agent Tool Use") -> dict:
        print(BANNER)
        print(f"[AGENT TRAJECTORY] Step 1: Reading user learning goals...")
        goals = self.notes_tool.read_learning_goals()
        print(f" -> Active Goals Loaded ({len(goals.splitlines())} lines)")

        print(f"\n[AGENT TRAJECTORY] Step 2: Querying live arXiv REST API for topic: '{topic}'...")
        papers = fetch_arxiv_papers(query=topic, max_results=3)
        if not papers:
            print(" [WARNING] No papers fetched from arXiv. Aborting pipeline.")
            return {"status": "failed", "reason": "arXiv fetch empty"}

        print(f" -> Successfully retrieved {len(papers)} live papers from arXiv API:")
        for idx, paper in enumerate(papers, 1):
            print(f"    {idx}. [{paper['published']}] {paper['title']}")
            print(f"       URL: {paper['url']}")
            print(f"       Authors: {', '.join(paper['authors'][:2])} et al.")

        print(f"\n[AGENT TRAJECTORY] Step 3: Inspecting existing study vault notes...")
        existing_notes = self.notes_tool.read_note("ai_agents.md")
        print(f" -> Grounded context retrieved from 'ai_agents.md' ({len(existing_notes)} characters)")

        print(f"\n[AGENT TRAJECTORY] Step 4: Synthesizing Research Briefing & Flashcards...")
        
        briefing_content = self._generate_briefing(topic, papers)
        flashcard_items = self._generate_flashcards(papers)
        note_addition = self._generate_note_addition(topic, papers)

        print("\n" + "="*80)
        print(" [PROPOSAL FOR HUMAN-IN-THE-LOOP (HITL) APPROVAL]")
        print(" High-Risk Tier Action: Modifying Markdown study notes & saving briefing to disk.")
        print("="*80)
        print(f"\nProposed Note Addition for 'ai_agents.md':\n{note_addition}")
        print(f"\nProposed Flashcards ({len(flashcard_items)} cards generated):\n")
        for card in flashcard_items:
            print(f" Q: {card['front']}\n A: {card['back']}\n")

        # HITL Gate
        if not self.auto_approve:
            user_choice = input("[HITL GATE] Authorize agent to modify study notes and write files? (y/n): ").strip().lower()
            if user_choice not in ['y', 'yes']:
                print("\n[GUARDRAIL HALT] Action rejected by user. Operations aborted without disk modification.")
                return {"status": "rejected_by_user"}

        print("\n[AGENT TRAJECTORY] Step 5: Executing authorized tool actions...")
        
        # Save Briefing
        today_str = datetime.date.today().isoformat()
        briefing_path = self.output_dir / f"daily_briefing_{today_str}.md"
        briefing_path.write_text(briefing_content, encoding="utf-8")
        print(f" -> Written Research Briefing to: {briefing_path}")

        # Update Notes
        self.notes_tool.append_to_note("ai_agents.md", note_addition)
        print(f" -> Appended synthesized concepts to note: sample_data/notes/ai_agents.md")

        # Export Flashcards
        fc_result = self.flashcards_tool.validate_and_export(flashcard_items)
        print(f" -> Exported {fc_result['exported_count']} schema-valid flashcards to: {fc_result['output_path']}")

        print("\n" + "="*80)
        print(" [COMPLETED SUCCESSFULLY] ResearchScout MVP run complete end-to-end!")
        print("="*80)

        return {
            "status": "success",
            "papers_count": len(papers),
            "briefing_path": str(briefing_path),
            "flashcards_count": len(flashcard_items)
        }

    def _generate_briefing(self, topic: str, papers: list) -> str:
        date_str = datetime.date.today().isoformat()
        content = f"# Daily AI Research Briefing ({date_str})\n\n"
        content += f"**Focus Topic:** {topic}\n\n"
        content += "## Top arXiv Research Papers Ingested\n\n"
        for p in papers:
            content += f"### [{p['title']}]({p['url']})\n"
            content += f"- **Authors:** {', '.join(p['authors'])}\n"
            content += f"- **Published Date:** {p['published']}\n"
            content += f"- **Summary:** {p['summary']}\n\n"
        return content

    def _generate_flashcards(self, papers: list) -> list:
        cards = []
        for p in papers:
            title_short = p['title'][:40]
            cards.append({
                "front": f"What is the core contribution of paper '{title_short}'?",
                "back": f"{p['summary'][:180]}... Source: {p['url']}",
                "tags": ["ai-research", "arxiv", "paper-summary"],
                "source": p['url']
            })
        return cards

    def _generate_note_addition(self, topic: str, papers: list) -> str:
        date_str = datetime.date.today().isoformat()
        addition = f"### Research Update: {topic} ({date_str})\n"
        for p in papers:
            first_author = p['authors'][0] if p['authors'] else 'Unknown'
            addition += f"- [{first_author} et al., {p['published'][:4]}] ({p['url']}): Key findings on {p['title'][:60]}.\n"
        return addition

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="ResearchScout Personal AI Agent MVP")
    parser.add_argument("--topic", type=str, default="LLM Agent Tool Use", help="Research topic to query")
    parser.add_argument("--auto-approve", action="store_true", help="Bypass interactive HITL prompt for automated test runs")
    args = parser.parse_args()

    agent = ResearchScoutAgent(auto_approve=args.auto_approve)
    agent.run_pipeline(topic=args.topic)
