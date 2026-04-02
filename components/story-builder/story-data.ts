// Story data for the Leuk the Hare Story Animator
// Based on "La Belle Histoire de Leuk-le-Lièvre" by Senghor & Sadji

export interface StoryCharacter {
  id: string;
  name: string;
  emoji: string;
  color: string;
  description: string;
}

export interface StoryScene {
  id: string;
  name: string;
  background: string; // image path
  description: string;
}

export interface ChapterObjective {
  text: string;
  aiConcept: string;
  codingConcept: string;
  hint: string;
}

export interface StoryChapter {
  id: number;
  title: string;
  sceneId: string;
  narrative: string;
  objectives: ChapterObjective;
  starterBlocks?: string; // XML for pre-loaded blocks
  dialogueHints: string[];
}

export const CHARACTERS: StoryCharacter[] = [
  { id: 'leuk', name: 'Leuk the Hare', emoji: '🐰', color: '#C4A265', description: 'The clever hare - our hero!' },
  { id: 'lion', name: 'Gaïndé the Lion', emoji: '🦁', color: '#D4A017', description: 'The powerful but proud lion king' },
  { id: 'hyena', name: 'Bouki the Hyena', emoji: '🐺', color: '#8B7355', description: 'The greedy but foolish hyena' },
  { id: 'tortoise', name: "M'Bonate the Tortoise", emoji: '🐢', color: '#556B2F', description: 'The wise and patient tortoise' },
  { id: 'narrator', name: 'Narrator', emoji: '📖', color: '#6B4C9A', description: 'The storyteller' },
];

export const SCENES: StoryScene[] = [
  { id: 'village', name: 'The Village', background: '/images/story-builder/village.jpg', description: 'A peaceful African village with round huts and a great baobab tree' },
  { id: 'savanna', name: 'The Savanna', background: '/images/story-builder/savanna.jpg', description: 'The wide golden savanna under the setting sun' },
  { id: 'forest', name: 'The Forest Path', background: '/images/story-builder/forest.jpg', description: 'A winding path through the dense African forest' },
  { id: 'river', name: 'The River Crossing', background: '/images/story-builder/river.jpg', description: 'A river with a bridge - but is it safe to cross?' },
  { id: 'celebration', name: 'The Celebration', background: '/images/story-builder/celebration.jpg', description: 'The village celebrates under the stars!' },
];

export const EMOTIONS = [
  { id: 'happy', label: 'Happy 😊', emoji: '😊' },
  { id: 'scared', label: 'Scared 😨', emoji: '😨' },
  { id: 'thinking', label: 'Thinking 🤔', emoji: '🤔' },
  { id: 'angry', label: 'Angry 😠', emoji: '😠' },
  { id: 'surprised', label: 'Surprised 😲', emoji: '😲' },
  { id: 'proud', label: 'Proud 😤', emoji: '😤' },
  { id: 'sneaky', label: 'Sneaky 😏', emoji: '😏' },
];

export const POSITIONS = [
  { id: 'left', label: 'Left', x: 15, y: 70 },
  { id: 'center', label: 'Center', x: 50, y: 70 },
  { id: 'right', label: 'Right', x: 85, y: 70 },
  { id: 'far_left', label: 'Far Left', x: 5, y: 70 },
  { id: 'far_right', label: 'Far Right', x: 95, y: 70 },
];

export const EFFECTS = [
  { id: 'sparkle', label: '✨ Sparkle' },
  { id: 'shake', label: '💥 Shake' },
  { id: 'flash', label: '⚡ Flash' },
  { id: 'hearts', label: '❤️ Hearts' },
  { id: 'question', label: '❓ Question Marks' },
];

export const CHAPTERS: StoryChapter[] = [
  {
    id: 1,
    title: 'Chapter 1: The Clever Hare',
    sceneId: 'village',
    narrative: `In a village beneath the great Baobab tree, there lived a hare named Leuk. He was known far and wide as the cleverest animal in all the land. One morning, Leuk stood before the other animals and declared: "Intelligence is more powerful than strength!"`,
    objectives: {
      text: 'Set the scene and make characters appear and speak in order',
      aiConcept: 'Sequence: AI systems process instructions step by step, in order',
      codingConcept: 'Sequence — blocks run from top to bottom',
      hint: 'Use "Set Scene" then "Show Character" then "Say" blocks in the right order',
    },
    dialogueHints: [
      'Leuk: "Good morning, everyone! I have something important to say."',
      'Leuk: "Intelligence is more powerful than strength!"',
      'Tortoise: "Wise words, young hare. But can you prove it?"',
    ],
  },
  {
    id: 2,
    title: "Chapter 2: The Lion's Challenge",
    sceneId: 'savanna',
    narrative: `Gaïndé the Lion heard Leuk's bold claim and was not pleased. He roared across the savanna: "If you are truly so clever, then bring me golden honey from the Tall Tree beyond the forest. You have until sunset!" Leuk's ears twitched. He needed to think...`,
    objectives: {
      text: 'Make the Lion roar his challenge. Use REPEAT to make Leuk pace back and forth while thinking',
      aiConcept: 'Loops: AI systems repeat actions — like checking sensors over and over',
      codingConcept: 'Loops (Repeat) — do the same action multiple times',
      hint: 'Use "Repeat 3 times" with "Move Character" inside to make Leuk pace',
    },
    dialogueHints: [
      'Lion: "ROOAAR! You think you are clever?"',
      'Lion: "Bring me golden honey from the Tall Tree! Before sunset!"',
      'Leuk: "Hmm... I need to think about this..."',
    ],
  },
  {
    id: 3,
    title: 'Chapter 3: The Forest Journey',
    sceneId: 'forest',
    narrative: `Leuk entered the deep forest. The path was dark and winding. He observed everything carefully — the tracks on the ground, the sounds in the trees, the direction of the wind. "A good thinker observes before acting," he whispered. Suddenly, Bouki the Hyena appeared!`,
    objectives: {
      text: 'Show Leuk observing the forest. When he spots the Hyena, make him react!',
      aiConcept: 'Observation → Decision: AI gathers data (observes) before deciding',
      codingConcept: 'Events — things happen in response to triggers',
      hint: 'Show Leuk thinking, then show Hyena, then make Leuk react with an emotion change',
    },
    dialogueHints: [
      'Narrator: "Leuk entered the forest carefully..."',
      'Leuk: "I must observe everything. Tracks... sounds... smells..."',
      'Hyena: "Well well well... a little hare, all alone!"',
      'Leuk: "Bouki! I should have expected you here."',
    ],
  },
  {
    id: 4,
    title: "Chapter 4: The Clever Trick",
    sceneId: 'river',
    narrative: `At the river, Bouki blocked Leuk's path. "Give me your food or I won't let you cross!" But Leuk had a plan. He observed that the old bridge was weak on one side. "Bouki, IF you are truly strong, THEN you should cross first to prove it!" The greedy hyena fell for the trick...`,
    objectives: {
      text: 'Use IF-THEN logic! IF Hyena is greedy, THEN trick him. Make Leuk outsmart Bouki!',
      aiConcept: 'Conditionals: AI uses IF-THEN rules to make decisions based on what it observes',
      codingConcept: 'Conditionals (IF-THEN) — different actions based on conditions',
      hint: 'Use the "If Signal" block — if Hyena is greedy, Leuk says his trick',
    },
    dialogueHints: [
      'Hyena: "Give me your food! Or you cannot cross!"',
      'Leuk: "IF you are truly strong, THEN cross first!"',
      'Hyena: "Of course I am strong! Watch me!"',
      'Narrator: "The bridge wobbled... Bouki fell in the water!"',
      'Leuk: "Intelligence beats strength, every time."',
    ],
  },
  {
    id: 5,
    title: 'Chapter 5: The Celebration',
    sceneId: 'celebration',
    narrative: `Leuk returned with the golden honey! All the animals gathered to celebrate. Even Gaïndé the Lion nodded with respect. "You have proven that a good mind is the greatest tool," said M'Bonate the Tortoise. Leuk smiled. "Every intelligent system needs: Eyes to OBSERVE, a Brain to THINK, and Feet to ACT."`,
    objectives: {
      text: 'Bring all characters together. Use everything you learned to create the grand finale!',
      aiConcept: 'Complete System: Observe → Think → Act — the full AI loop',
      codingConcept: 'Putting it all together — sequence, loops, conditionals, events',
      hint: 'Show all characters, use dialogue, add effects, make it a celebration!',
    },
    dialogueHints: [
      'Narrator: "Leuk returned victorious!"',
      'Lion: "I... I admit it. You are truly clever."',
      'Tortoise: "A good mind is the greatest tool."',
      'Leuk: "Observe → Think → Act. That is the secret!"',
      'All: "Hooray for Leuk!"',
    ],
  },
];
