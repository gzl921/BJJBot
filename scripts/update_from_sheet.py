#!/usr/bin/env python3
import json
import re
from pathlib import Path

def generate_technique_description(technique_name: str, category: str) -> str:
    """Generate a detailed description for a BJJ technique"""
    
    # Base descriptions for each category
    category_descriptions = {
        "Submission": "A submission technique designed to force your opponent to tap out. This move targets specific joints or applies pressure to create a submission opportunity.",
        "Guard": "A defensive position that allows you to control your opponent while on your back. This technique helps maintain guard position and create offensive opportunities.",
        "Takedown": "A standing technique used to bring your opponent to the ground. This move is essential for initiating ground fighting and gaining positional advantage.",
        "Escape (Submission Escapes / Counters)": "A defensive technique to escape from submission attempts. This counter helps you avoid being submitted and regain a better position.",
        "Takedown Defenses / Escapes": "A defensive technique to prevent or escape from takedown attempts. This move helps you stay on your feet or recover from a takedown.",
        "Guard Escapes / Pass-Outs": "A technique to escape from guard position or pass your opponent's guard. This move helps you advance to a more dominant position."
    }
    
    # Generate specific descriptions based on technique names
    technique_keywords = {
        "choke": "This choke technique applies pressure to the neck area, cutting off blood flow or air supply to force a submission.",
        "armbar": "This joint lock targets the elbow joint, hyperextending it to create pain and force a tap.",
        "triangle": "This technique uses your legs to create a triangular figure-four around your opponent's head and arm.",
        "kimura": "This shoulder lock applies pressure to the shoulder joint by controlling the wrist and rotating the arm.",
        "guard": "This guard position uses your legs to control your opponent's posture and create offensive opportunities.",
        "takedown": "This takedown technique uses leverage and timing to bring your opponent to the ground safely.",
        "escape": "This escape technique helps you get out of a disadvantageous position and regain control.",
        "pass": "This guard pass technique helps you move from guard position to a more dominant position like side control or mount.",
        "sweep": "This sweep technique reverses the position, taking you from bottom to top position.",
        "lock": "This joint lock applies pressure to a specific joint to create pain and force a submission.",
        "hook": "This technique uses leg hooks to control your opponent's movement and create leverage.",
        "drag": "This technique uses grips and leverage to pull your opponent into a disadvantageous position."
    }
    
    # Find relevant keywords in the technique name
    name_lower = technique_name.lower()
    relevant_keywords = []
    
    for keyword, description in technique_keywords.items():
        if keyword in name_lower:
            relevant_keywords.append(description)
    
    # Combine descriptions
    base_desc = category_descriptions.get(category, "A fundamental BJJ technique that requires proper execution and timing.")
    
    if relevant_keywords:
        specific_desc = " ".join(relevant_keywords[:2])  # Use up to 2 most relevant descriptions
        return f"{base_desc} {specific_desc} This technique is commonly used in both gi and no-gi BJJ and requires proper setup and execution to be effective."
    else:
        return f"{base_desc} This technique is commonly used in both gi and no-gi BJJ and requires proper setup and execution to be effective."

def create_techniques_data():
    """Create techniques data based on the Google Sheet structure"""

    # Define the 6 categories from the Google Sheet
    categories = [
        "Submission",
        "Guard", 
        "Takedown",
        "Escape (Submission Escapes / Counters)",
        "Takedown Defenses / Escapes",
        "Guard Escapes / Pass-Outs"
    ]

    # Sample techniques for each category (you can expand this)
    techniques_data = {
        "Submission": [
            "Rear Naked Choke (RNC/Mata-Leão)",
            "Straight Armbar (Juji-Gatame)",
            "Guillotine Choke (all variations)",
            "Triangle Choke (guard)",
            "Kimura (double-wristlock)",
            "Arm-Triangle Choke (Kata-Gatame)",
            "Americana (paint-brush/key-lock)",
            "Bow-and-Arrow Choke",
            "D'Arce Choke",
            "Straight Ankle Lock (Ashi Garami)",
            "Heel Hook – Inside",
            "Heel Hook – Outside",
            "Ezekiel Choke",
            "Cross-Collar Choke (guard)",
            "Cross-Collar Choke (mount)",
            "Loop Choke",
            "Toe Hold",
            "Kneebar",
            "Brabo / Lapel Choke",
            "North-South Choke",
            "Omoplata (shoulder lock)",
            "Mounted Triangle Choke",
            "Reverse / Back Triangle Choke",
            "Paper-Cutter Choke"
        ],
        "Guard": [
            "Closed Guard",
            "Half Guard (basic knee-shield)",
            "Open Guard (feet-on-hips / generic hooks)",
            "Butterfly Guard",
            "De La Riva Guard",
            "Reverse De La Riva",
            "Shin-to-Shin Guard",
            "Knee-Shield \"93\" Guard",
            "Single-Leg X (Ashi Garami)",
            "X-Guard",
            "Collar-and-Sleeve Guard",
            "Spider Guard",
            "Lasso Guard (inside)",
            "Deep Half Guard",
            "50/50 Guard",
            "Half-Butterfly Guard",
            "K Guard",
            "Reverse X-Guard",
            "Sit-Up / Gorilla Guard",
            "Seated (\"Combat Base\") Guard",
            "Omni-Hook / Overhook Guard"
        ],
        "Takedown": [
            "Double-Leg Takedown",
            "Single-Leg Takedown",
            "Ankle Pick",
            "Knee Tap / Knee Pick",
            "Snap-Down → Go-Behind",
            "Collar Drag",
            "Arm Drag → Back Take",
            "Inside Trip (Ouchi Gari)",
            "Outside Trip (Kosoto Gari)",
            "Foot Sweep (Deashi Barai)",
            "Osoto Gari (Major Outer Reap)",
            "Hip Toss (O-Goshi)",
            "Seoi Nage (Standing/Dropping)",
            "Tai Otoshi",
            "Uchi Mata",
            "Harai Goshi (Sweeping Hip)",
            "Kouchi Gari (Minor Inner Reap)",
            "Sasae Tsurikomi Ashi (Foot Block)",
            "Body-Lock Outside Trip",
            "Greco Roman Inside Trip",
            "High-Crotch Single → Cut Across",
            "Fireman's Carry (Kata Guruma)"
        ],
        "Escape (Submission Escapes / Counters)": [
            "Hitchhiker Armbar Escape",
            "Stack-Pass Armbar Escape",
            "Leg-Over Armbar Escape",
            "Hitchhiker Belly-Down Armbar Roll",
            "Posture-Pull Triangle Escape",
            "Knee-In Hip Triangle Pop",
            "Shoulder-Roll Triangle Escape",
            "Von Flue Guillotine Counter",
            "High-Elbow Guillotine Peel",
            "Arm-Inside Guillotine Pass",
            "Sit-Through Guillotine Escape",
            "Answer-the-Phone RNC Defense",
            "Turn-In Two-on-One RNC Peel",
            "Hand-Fight RNC Under-Hook Escape",
            "Shoulder-Shrug Bow-and-Arrow Slip",
            "Lapels-Across Bow-and-Arrow Defense",
            "Bridge-and-Roll Ezekiel Escape",
            "Frame-Across Ezekiel Slip",
            "Leg-Catch D'Arce Roll-Over",
            "Gator Roll D'Arce Escape",
            "Head-Walk Arm-Triangle Escape",
            "Leg-Hook Arm-Triangle Roll",
            "Hip-Heist Americana Escape"
        ],
        "Takedown Defenses / Escapes": [
            "Sprawl Double-Leg Defense",
            "Cross-Face Whizzer Double-Leg",
            "Hip-Switch Single-Leg Slip",
            "Shin-Whizzer Single-Leg Counter",
            "Tripod Ankle-Pick Defense",
            "Kick-Back Knee-Tap Escape",
            "Snap-Down Sprawl Go-Behind",
            "Collar-Drag Prevention Frame",
            "Inside-Trip Hip-Block Stuff",
            "Outside-Trip Leg-Circle Escape",
            "Foot-Sweep Lift-Leg Defense",
            "Osoto-Gari Leg-Hook Counter",
            "Ouchi-Gari Hip-Turnout",
            "Uchi-Mata Back-Step Escape",
            "Seoi-Nage Sit-Through Roll",
            "Tai-Otoshi Elbow-Whizzer Stop",
            "Harai-Goshi Back-Arch Counter",
            "Koshi-Guruma Head-Pop-Out",
            "Tani-Otoshi Hip-Shift Escape",
            "Tomoe-Nage Cartwheel-Over",
            "Sumi-Gaeshi Knee-Turn-Out",
            "Yoko-Tomoe Belt-Pull Block"
        ],
        "Guard Escapes / Pass-Outs": [
            "Closed-Guard Stand-Up Break",
            "Closed-Guard Knee-Slice Break",
            "Over-Under Closed-Guard Split",
            "Hip-Switch Butterfly Pass",
            "Float-Pass Butterfly Smash",
            "Back-Step Half-Guard Escape",
            "Knee-Slide Half-Guard Pass",
            "Deep-Half Back-Step Spin",
            "Twisting Knee-Cut 93-Guard Pass",
            "Shin-Pin Reverse DLR Pass",
            "Leg-Pummel Shin-to-Shin Clear",
            "X-Pass Open-Guard",
            "Toreando Open-Guard",
            "Leg-Drag Open-Guard",
            "Step-Back De La Riva Pass",
            "Long-Step Reverse DLR Pass",
            "Knee-Slice Single-Leg-X Clear",
            "Back-Step X-Guard Escape",
            "Force-Half Collar-Sleeve Pass",
            "Sliding-Collar Spider Pass",
            "Tripod Spider-Lasso Pass",
            "Lapel-Pull Worm Guard Split"
        ]
    }

    # Create the full techniques array
    techniques = []

    for category, technique_names in techniques_data.items():
        for technique_name in technique_names:
            # Generate ID using Python regex
            technique_id = re.sub(r'[^a-z0-9]', '-', technique_name.lower())
            technique = {
                "id": technique_id,
                "name": technique_name,
                "category": category,
                "description": generate_technique_description(technique_name, category),
                "bestResponse": f"The best defense against this {category.lower()} is to prevent it before it's fully applied. Focus on proper positioning, grip fighting, and maintaining good posture to avoid being caught in this technique."
            }
            techniques.append(technique)

    return techniques

def update_techniques_file():
    """Update the techniques.ts file with the new data"""
    print("🔄 Creating techniques data based on Google Sheet structure...")

    techniques = create_techniques_data()

    # Create the TypeScript file content
    file_content = f"""export interface Technique {{
  id: string;
  name: string;
  category: string;
  description: string;
  bestResponse: string;
}}

export const techniques: Technique[] = {json.dumps(techniques, indent=2)};
"""

    # Write to the techniques.ts file
    techniques_file = Path(__file__).parent.parent / "src" / "data" / "techniques.ts"
    techniques_file.write_text(file_content)

    print(f"✅ Updated {len(techniques)} techniques from Google Sheet structure")
    print(f"📁 File updated: {techniques_file}")

    # Print categories for verification
    categories = set(tech['category'] for tech in techniques)
    print(f"📊 Categories found: {', '.join(sorted(categories))}")

if __name__ == "__main__":
    update_techniques_file() 