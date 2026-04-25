import { config } from 'dotenv';
import { PrismaClient } from '@prisma/client';

config();

const prisma = new PrismaClient();

const defaultToolbox = {
  kind: 'categoryToolbox',
  contents: [
    {
      kind: 'category',
      name: '🎬 Events',
      colour: '#FFAB19',
      contents: [
        { kind: 'block', type: 'saged_on_start' },
        { kind: 'block', type: 'saged_on_key' },
        { kind: 'block', type: 'saged_forever' },
      ],
    },
    {
      kind: 'category',
      name: '🚀 Motion',
      colour: '#4C97FF',
      contents: [
        { kind: 'block', type: 'saged_move_x', inputs: { VALUE: { shadow: { type: 'math_number', fields: { NUM: 10 } } } } },
        { kind: 'block', type: 'saged_move_y', inputs: { VALUE: { shadow: { type: 'math_number', fields: { NUM: 10 } } } } },
        { kind: 'block', type: 'saged_set_x', inputs: { VALUE: { shadow: { type: 'math_number', fields: { NUM: 0 } } } } },
        { kind: 'block', type: 'saged_set_y', inputs: { VALUE: { shadow: { type: 'math_number', fields: { NUM: 0 } } } } },
        {
          kind: 'block',
          type: 'saged_go_to',
          inputs: {
            X: { shadow: { type: 'math_number', fields: { NUM: 0 } } },
            Y: { shadow: { type: 'math_number', fields: { NUM: 0 } } },
          },
        },
        { kind: 'block', type: 'saged_bounce' },
      ],
    },
    {
      kind: 'category',
      name: '👀 Looks',
      colour: '#9966FF',
      contents: [
        { kind: 'block', type: 'saged_say', inputs: { TEXT: { shadow: { type: 'text', fields: { TEXT: 'Hello!' } } } } },
        { kind: 'block', type: 'saged_set_color' },
        { kind: 'block', type: 'saged_set_size', inputs: { SIZE: { shadow: { type: 'math_number', fields: { NUM: 100 } } } } },
        { kind: 'block', type: 'saged_show' },
        { kind: 'block', type: 'saged_hide' },
      ],
    },
    {
      kind: 'category',
      name: '🔄 Control',
      colour: '#FF8C1A',
      contents: [
        { kind: 'block', type: 'saged_wait', inputs: { SECONDS: { shadow: { type: 'math_number', fields: { NUM: 1 } } } } },
        { kind: 'block', type: 'saged_repeat', inputs: { TIMES: { shadow: { type: 'math_number', fields: { NUM: 10 } } } } },
        { kind: 'block', type: 'controls_if' },
      ],
    },
    {
      kind: 'category',
      name: '📐 Sensing',
      colour: '#5CB1D6',
      contents: [
        { kind: 'block', type: 'saged_x_position' },
        { kind: 'block', type: 'saged_y_position' },
        { kind: 'block', type: 'saged_touching_edge' },
      ],
    },
    {
      kind: 'category',
      name: '➕ Math',
      colour: '#59C059',
      contents: [
        { kind: 'block', type: 'math_number' },
        { kind: 'block', type: 'math_arithmetic', inputs: { A: { shadow: { type: 'math_number', fields: { NUM: 1 } } }, B: { shadow: { type: 'math_number', fields: { NUM: 1 } } } } },
      ],
    },
    {
      kind: 'category',
      name: '⚖️ Logic',
      colour: '#5C81A6',
      contents: [
        { kind: 'block', type: 'logic_compare', inputs: { A: { shadow: { type: 'math_number', fields: { NUM: 1 } } }, B: { shadow: { type: 'math_number', fields: { NUM: 1 } } } } },
        { kind: 'block', type: 'logic_operation' },
        { kind: 'block', type: 'logic_negate' },
        { kind: 'block', type: 'logic_boolean' },
      ],
    },
    {
      kind: 'category',
      name: '📝 Text',
      colour: '#CF63CF',
      contents: [
        { kind: 'block', type: 'text' },
      ],
    },
  ],
};

const simpleToolbox = {
  kind: 'categoryToolbox',
  contents: [
    {
      kind: 'category',
      name: '🎬 Events',
      colour: '#FFAB19',
      contents: [
        { kind: 'block', type: 'saged_on_start' },
        { kind: 'block', type: 'saged_on_key' },
      ],
    },
    {
      kind: 'category',
      name: '🚀 Motion',
      colour: '#4C97FF',
      contents: [
        { kind: 'block', type: 'saged_move_x', inputs: { VALUE: { shadow: { type: 'math_number', fields: { NUM: 10 } } } } },
        { kind: 'block', type: 'saged_move_y', inputs: { VALUE: { shadow: { type: 'math_number', fields: { NUM: 10 } } } } },
      ],
    },
    {
      kind: 'category',
      name: '👀 Looks',
      colour: '#9966FF',
      contents: [
        { kind: 'block', type: 'saged_say', inputs: { TEXT: { shadow: { type: 'text', fields: { TEXT: 'Hello!' } } } } },
        { kind: 'block', type: 'saged_set_color' },
      ],
    },
    {
      kind: 'category',
      name: '➕ Math',
      colour: '#59C059',
      contents: [
        { kind: 'block', type: 'math_number' },
        { kind: 'block', type: 'math_arithmetic', inputs: { A: { shadow: { type: 'math_number', fields: { NUM: 1 } } }, B: { shadow: { type: 'math_number', fields: { NUM: 1 } } } } },
      ],
    },
    {
      kind: 'category',
      name: '⚖️ Logic',
      colour: '#5C81A6',
      contents: [
        { kind: 'block', type: 'logic_compare', inputs: { A: { shadow: { type: 'math_number', fields: { NUM: 1 } } }, B: { shadow: { type: 'math_number', fields: { NUM: 1 } } } } },
        { kind: 'block', type: 'logic_operation' },
        { kind: 'block', type: 'logic_negate' },
        { kind: 'block', type: 'logic_boolean' },
      ],
    },
  ],
};

// Young Sages themed toolboxes
const leukBeginnerToolbox = {
  kind: 'categoryToolbox',
  contents: [
    {
      kind: 'category',
      name: '🟢 Events',
      colour: '#5ba55b',
      contents: [
        { kind: 'block', type: 'saged_on_start' },
      ],
    },
    {
      kind: 'category',
      name: '🟣 Looks',
      colour: '#9966FF',
      contents: [
        { kind: 'block', type: 'saged_say', inputs: { TEXT: { shadow: { type: 'text', fields: { TEXT: 'Hello!' } } } } },
      ],
    },
  ],
};

const leukMotionToolbox = {
  kind: 'categoryToolbox',
  contents: [
    {
      kind: 'category',
      name: '🟢 Events',
      colour: '#5ba55b',
      contents: [
        { kind: 'block', type: 'saged_on_start' },
        { kind: 'block', type: 'saged_on_key' },
      ],
    },
    {
      kind: 'category',
      name: '🔵 Motion',
      colour: '#4C97FF',
      contents: [
        { kind: 'block', type: 'saged_move_x', inputs: { VALUE: { shadow: { type: 'math_number', fields: { NUM: 10 } } } } },
        { kind: 'block', type: 'saged_move_y', inputs: { VALUE: { shadow: { type: 'math_number', fields: { NUM: 10 } } } } },
        { kind: 'block', type: 'saged_set_x', inputs: { VALUE: { shadow: { type: 'math_number', fields: { NUM: 0 } } } } },
        { kind: 'block', type: 'saged_set_y', inputs: { VALUE: { shadow: { type: 'math_number', fields: { NUM: 0 } } } } },
        {
          kind: 'block',
          type: 'saged_go_to',
          inputs: {
            X: { shadow: { type: 'math_number', fields: { NUM: 0 } } },
            Y: { shadow: { type: 'math_number', fields: { NUM: 0 } } },
          },
        },
      ],
    },
    {
      kind: 'category',
      name: '🟣 Looks',
      colour: '#9966FF',
      contents: [
        { kind: 'block', type: 'saged_say', inputs: { TEXT: { shadow: { type: 'text', fields: { TEXT: 'Hello!' } } } } },
      ],
    },
    {
      kind: 'category',
      name: '🟡 Control',
      colour: '#FF8C1A',
      contents: [
        { kind: 'block', type: 'saged_wait', inputs: { SECONDS: { shadow: { type: 'math_number', fields: { NUM: 1 } } } } },
      ],
    },
    {
      kind: 'category',
      name: '➕ Math',
      colour: '#59C059',
      contents: [
        { kind: 'block', type: 'math_number' },
        { kind: 'block', type: 'math_arithmetic', inputs: { A: { shadow: { type: 'math_number', fields: { NUM: 1 } } }, B: { shadow: { type: 'math_number', fields: { NUM: 1 } } } } },
      ],
    },
    {
      kind: 'category',
      name: '⚖️ Logic',
      colour: '#5C81A6',
      contents: [
        { kind: 'block', type: 'logic_compare', inputs: { A: { shadow: { type: 'math_number', fields: { NUM: 1 } } }, B: { shadow: { type: 'math_number', fields: { NUM: 1 } } } } },
        { kind: 'block', type: 'logic_operation' },
        { kind: 'block', type: 'logic_negate' },
        { kind: 'block', type: 'logic_boolean' },
      ],
    },
  ],
};

const leukBounceToolbox = {
  kind: 'categoryToolbox',
  contents: [
    {
      kind: 'category',
      name: '🟢 Events',
      colour: '#5ba55b',
      contents: [
        { kind: 'block', type: 'saged_on_start' },
        { kind: 'block', type: 'saged_forever' },
      ],
    },
    {
      kind: 'category',
      name: '🔵 Motion',
      colour: '#4C97FF',
      contents: [
        { kind: 'block', type: 'saged_move_x', inputs: { VALUE: { shadow: { type: 'math_number', fields: { NUM: 10 } } } } },
        { kind: 'block', type: 'saged_move_y', inputs: { VALUE: { shadow: { type: 'math_number', fields: { NUM: 10 } } } } },
        { kind: 'block', type: 'saged_bounce' },
      ],
    },
    {
      kind: 'category',
      name: '🟣 Looks',
      colour: '#9966FF',
      contents: [
        { kind: 'block', type: 'saged_say', inputs: { TEXT: { shadow: { type: 'text', fields: { TEXT: 'Oops!' } } } } },
        { kind: 'block', type: 'saged_set_color' },
      ],
    },
    {
      kind: 'category',
      name: '🔷 Sensing',
      colour: '#5CB1D6',
      contents: [
        { kind: 'block', type: 'saged_touching_edge' },
      ],
    },
    {
      kind: 'category',
      name: '➕ Math',
      colour: '#59C059',
      contents: [
        { kind: 'block', type: 'math_number' },
        { kind: 'block', type: 'math_arithmetic', inputs: { A: { shadow: { type: 'math_number', fields: { NUM: 1 } } }, B: { shadow: { type: 'math_number', fields: { NUM: 1 } } } } },
      ],
    },
    {
      kind: 'category',
      name: '⚖️ Logic',
      colour: '#5C81A6',
      contents: [
        { kind: 'block', type: 'logic_compare', inputs: { A: { shadow: { type: 'math_number', fields: { NUM: 1 } } }, B: { shadow: { type: 'math_number', fields: { NUM: 1 } } } } },
        { kind: 'block', type: 'logic_operation' },
        { kind: 'block', type: 'logic_negate' },
        { kind: 'block', type: 'logic_boolean' },
      ],
    },
  ],
};

const leukFullToolbox = {
  kind: 'categoryToolbox',
  contents: [
    {
      kind: 'category',
      name: '🟢 Events',
      colour: '#5ba55b',
      contents: [
        { kind: 'block', type: 'saged_on_start' },
        { kind: 'block', type: 'saged_on_key' },
        { kind: 'block', type: 'saged_forever' },
      ],
    },
    {
      kind: 'category',
      name: '🔵 Motion',
      colour: '#4C97FF',
      contents: [
        { kind: 'block', type: 'saged_move_x', inputs: { VALUE: { shadow: { type: 'math_number', fields: { NUM: 10 } } } } },
        { kind: 'block', type: 'saged_move_y', inputs: { VALUE: { shadow: { type: 'math_number', fields: { NUM: 10 } } } } },
        { kind: 'block', type: 'saged_set_x', inputs: { VALUE: { shadow: { type: 'math_number', fields: { NUM: 0 } } } } },
        { kind: 'block', type: 'saged_set_y', inputs: { VALUE: { shadow: { type: 'math_number', fields: { NUM: 0 } } } } },
        {
          kind: 'block',
          type: 'saged_go_to',
          inputs: {
            X: { shadow: { type: 'math_number', fields: { NUM: 0 } } },
            Y: { shadow: { type: 'math_number', fields: { NUM: 0 } } },
          },
        },
        { kind: 'block', type: 'saged_bounce' },
      ],
    },
    {
      kind: 'category',
      name: '🟣 Looks',
      colour: '#9966FF',
      contents: [
        { kind: 'block', type: 'saged_say', inputs: { TEXT: { shadow: { type: 'text', fields: { TEXT: 'Hello!' } } } } },
        { kind: 'block', type: 'saged_set_color' },
        { kind: 'block', type: 'saged_set_size', inputs: { SIZE: { shadow: { type: 'math_number', fields: { NUM: 100 } } } } },
        { kind: 'block', type: 'saged_show' },
        { kind: 'block', type: 'saged_hide' },
      ],
    },
    {
      kind: 'category',
      name: '🟡 Control',
      colour: '#FF8C1A',
      contents: [
        { kind: 'block', type: 'saged_wait', inputs: { SECONDS: { shadow: { type: 'math_number', fields: { NUM: 1 } } } } },
        { kind: 'block', type: 'saged_repeat', inputs: { TIMES: { shadow: { type: 'math_number', fields: { NUM: 10 } } } } },
        { kind: 'block', type: 'controls_if' },
      ],
    },
    {
      kind: 'category',
      name: '🔷 Sensing',
      colour: '#5CB1D6',
      contents: [
        { kind: 'block', type: 'saged_x_position' },
        { kind: 'block', type: 'saged_y_position' },
        { kind: 'block', type: 'saged_touching_edge' },
      ],
    },
    {
      kind: 'category',
      name: '➕ Math',
      colour: '#59C059',
      contents: [
        { kind: 'block', type: 'math_number' },
        { kind: 'block', type: 'math_arithmetic', inputs: { A: { shadow: { type: 'math_number', fields: { NUM: 1 } } }, B: { shadow: { type: 'math_number', fields: { NUM: 1 } } } } },
      ],
    },
    {
      kind: 'category',
      name: '⚖️ Logic',
      colour: '#5C81A6',
      contents: [
        { kind: 'block', type: 'logic_compare', inputs: { A: { shadow: { type: 'math_number', fields: { NUM: 1 } } }, B: { shadow: { type: 'math_number', fields: { NUM: 1 } } } } },
        { kind: 'block', type: 'logic_operation' },
        { kind: 'block', type: 'logic_negate' },
        { kind: 'block', type: 'logic_boolean' },
      ],
    },
    {
      kind: 'category',
      name: '📝 Text',
      colour: '#CF63CF',
      contents: [
        { kind: 'block', type: 'text' },
      ],
    },
  ],
};

async function main() {
  console.log('🧱 Seeding Blocks Lab lessons...\n');

  // ===== ORIGINAL LESSONS =====
  
  // Lesson 1: Hello World
  const lesson1 = await prisma.blocksLesson.upsert({
    where: { slug: 'hello-world' },
    update: { 
      blockConfig: simpleToolbox,
      isPublished: true 
    },
    create: {
      slug: 'hello-world',
      title: 'Hello World - Your First Program',
      description: 'Learn the basics of block programming by making a character say hello!',
      instructions: `🌟 **Welcome to Blocks Lab!**

In this lesson, you'll create your first program.

**Your Task:**
1. Find the "When program starts" block in Events
2. Connect a "Say" block from Looks
3. Type your message in the text box
4. Click Run to see your character speak!

**Bonus Challenge:**
- Try changing the character's color
- Make it say different things`,
      stageConfig: { width: 480, height: 360, spriteColor: '#124734' },
      blockConfig: simpleToolbox,
      starterWorkspace: {
        blocks: {
          languageVersion: 0,
          blocks: [
            {
              type: 'saged_on_start',
              x: 50,
              y: 50,
            },
          ],
        },
      },
      orderIndex: 1,
      isPublished: true,
    },
  });

  console.log(`✅ Created lesson: ${lesson1.title}`);

  // Lesson 2: Move Around
  const lesson2 = await prisma.blocksLesson.upsert({
    where: { slug: 'move-around' },
    update: { 
      blockConfig: defaultToolbox,
      isPublished: true 
    },
    create: {
      slug: 'move-around',
      title: 'Move Around - Keyboard Controls',
      description: 'Make your character move using arrow keys!',
      instructions: `🎮 **Let's Add Movement!**

In this lesson, you'll make your character move with the keyboard.

**Your Task:**
1. Use "When key pressed" blocks from Events
2. Connect movement blocks to each key event
3. Right arrow should move right (positive X)
4. Left arrow should move left (negative X)
5. Up arrow should move up (positive Y)
6. Down arrow should move down (negative Y)

**Tips:**
- Positive X moves right
- Negative X moves left
- Positive Y moves up
- Negative Y moves down

**Bonus Challenge:**
- Add diagonal movement with W, A, S, D keys`,
      stageConfig: { width: 480, height: 360, spriteColor: '#124734' },
      blockConfig: defaultToolbox,
      starterWorkspace: {
        blocks: {
          languageVersion: 0,
          blocks: [
            {
              type: 'saged_on_start',
              x: 50,
              y: 50,
            },
          ],
        },
      },
      orderIndex: 2,
      isPublished: true,
    },
  });

  console.log(`✅ Created lesson: ${lesson2.title}`);

  // Lesson 3: Animation
  const lesson3 = await prisma.blocksLesson.upsert({
    where: { slug: 'simple-animation' },
    update: { 
      blockConfig: defaultToolbox,
      isPublished: true 
    },
    create: {
      slug: 'simple-animation',
      title: 'Simple Animation - Forever Loops',
      description: 'Create animations using forever loops!',
      instructions: `🎥 **Make Things Move Automatically!**

Learn how to create continuous animations.

**Your Task:**
1. Use a "Forever" block from Events
2. Add movement inside the forever loop
3. Add "Bounce if on edge" to keep the character on screen

**Expected Result:**
Your character should move across the screen and bounce when it hits the edge.

**Bonus Challenge:**
- Change the character's color when it bounces
- Make it move in both X and Y directions`,
      stageConfig: { width: 480, height: 360, spriteColor: '#4C97FF' },
      blockConfig: defaultToolbox,
      starterWorkspace: {
        blocks: {
          languageVersion: 0,
          blocks: [
            {
              type: 'saged_on_start',
              x: 50,
              y: 50,
            },
          ],
        },
      },
      orderIndex: 3,
      isPublished: true,
    },
  });

  console.log(`✅ Created lesson: ${lesson3.title}`);

  // Lesson 4: Interactive Story
  const lesson4 = await prisma.blocksLesson.upsert({
    where: { slug: 'interactive-story' },
    update: {
      blockConfig: defaultToolbox,
      isPublished: true,
    },
    create: {
      slug: 'interactive-story',
      title: 'Interactive Story',
      description: 'Create an interactive story with multiple events and messages.',
      instructions: `📚 **Tell a Story with Code!**

Create an interactive experience where your character responds to different keys.

**Your Task:**
1. When the program starts, have the character introduce themselves
2. When space is pressed, have them tell a joke or fun fact
3. When arrow keys are pressed, have them move and say something

**Requirements:**
- Use at least 3 different "When key pressed" events
- Have at least 5 different messages
- Move the character to at least 3 different positions

**Bonus Challenge:**
- Create a mini adventure game
- Add color changes to show different moods`,
      stageConfig: { width: 480, height: 360, spriteColor: '#9966FF' },
      blockConfig: defaultToolbox,
      starterWorkspace: {
        blocks: {
          languageVersion: 0,
          blocks: [
            {
              type: 'saged_on_start',
              x: 50,
              y: 50,
            },
          ],
        },
      },
      orderIndex: 4,
      isPublished: true,
    },
  });

  console.log(`✅ Created lesson: ${lesson4.title}`);

  // ===== YOUNG SAGES LESSONS =====
  console.log('\n🐰 Seeding Young Sages (Leuk) lessons...\n');

  // Young Sages Lesson 1: Leuk Says Hello
  const ysLesson1 = await prisma.blocksLesson.upsert({
    where: { slug: 'leuk-says-hello' },
    update: { 
      blockConfig: leukBeginnerToolbox,
      isPublished: true 
    },
    create: {
      slug: 'leuk-says-hello',
      title: 'Leuk Says Hello',
      description: 'Your first program! Make Leuk the Hare introduce himself.',
      instructions: `🐰 **Welcome, Young Sage!**

Meet Leuk! He's a clever hare who wants to say hello.

**Your Task:**
1. Find the green **"On Start"** block in Events
2. Drag a purple **"Say"** block and connect it underneath
3. Type "Hello! I am Leuk!" in the text box
4. Click the green **Run** button

**What Should Happen:**
A speech bubble appears with Leuk's message!

**You Just Wrote Code!**
You told the computer: "WHEN the program starts, THEN say hello!"
That's an IF-THEN rule in action!

**When You're Done:**
1. Click **Save** to keep your work
2. Click **Submit** when you're proud of it

**Bonus:** Change the message to make Leuk say something funny!`,
      stageConfig: { width: 480, height: 360, spriteColor: '#8B4513' },
      blockConfig: leukBeginnerToolbox,
      starterWorkspace: {
        blocks: {
          languageVersion: 0,
          blocks: [
            {
              type: 'saged_on_start',
              x: 50,
              y: 50,
            },
          ],
        },
      },
      orderIndex: 10,
      isPublished: true,
    },
  });

  console.log(`✅ Created lesson: ${ysLesson1.title}`);

  // Young Sages Lesson 2: Leuk Explores
  const ysLesson2 = await prisma.blocksLesson.upsert({
    where: { slug: 'leuk-explores' },
    update: {
      blockConfig: leukMotionToolbox,
      isPublished: true,
    },
    create: {
      slug: 'leuk-explores',
      title: 'Leuk Explores the Savanna',
      description: 'Make Leuk move around the stage and explore!',
      instructions: `🌍 **Time to Explore!**

Leuk is curious. Help him explore the stage!

**Understanding the Stage:**
- The stage is like a map with X and Y coordinates
- X goes left (negative) and right (positive)
- Y goes up (positive) and down (negative)
- The center is (0, 0)

**Your Task:**
1. Use **"On Start"** to make Leuk say "Let's explore!"
2. Add **"Wait"** blocks between movements (so you can see each step)
3. Use **"Move X"** and **"Move Y"** blocks to move Leuk

**Challenge - Make a Square:**
Can you make Leuk walk in a square?
1. Move right (+50 on X)
2. Move up (+50 on Y)
3. Move left (-50 on X)
4. Move down (-50 on Y)

**Extra Challenge:**
Press arrow keys to move Leuk yourself! Use **"On Key Pressed"** blocks.

**Remember:** Click **Save** often!`,
      stageConfig: { width: 480, height: 360, spriteColor: '#8B4513' },
      blockConfig: leukMotionToolbox,
      starterWorkspace: {
        blocks: {
          languageVersion: 0,
          blocks: [
            {
              type: 'saged_on_start',
              x: 50,
              y: 50,
            },
          ],
        },
      },
      orderIndex: 11,
      isPublished: true,
    },
  });

  console.log(`✅ Created lesson: ${ysLesson2.title}`);

  // Young Sages Lesson 3: Leuk Bounces
  const ysLesson3 = await prisma.blocksLesson.upsert({
    where: { slug: 'leuk-bounces' },
    update: { 
      blockConfig: leukBounceToolbox,
      isPublished: true 
    },
    create: {
      slug: 'leuk-bounces',
      title: 'Leuk Bounces Around',
      description: 'Learn about limits and constraints by making Leuk bounce off the edges!',
      instructions: `🎾 **Bouncing Leuk!**

The stage has limits - edges that Leuk can't pass. But we can turn limits into fun!

**Your Task:**
1. Start with a **"Forever"** block (this runs continuously)
2. Inside it, add **"Move X by 5"** to move Leuk right
3. Add **"Bounce if on edge"** so Leuk bounces back

**What Happens:**
Leuk will move right, hit the edge, bounce, move left, hit the other edge, and keep going!

**The Lesson:**
Limits (like the edge) aren't bad - they make interesting patterns!

**Make It Better:**
- Try moving in X AND Y (diagonal movement)
- Change Leuk's color when he touches the edge
- Make Leuk say "Ouch!" when bouncing

**Experiment:**
What happens if you make Leuk move by 20 instead of 5? (He moves faster!)`,
      stageConfig: { width: 480, height: 360, spriteColor: '#8B4513' },
      blockConfig: leukBounceToolbox,
      starterWorkspace: {
        blocks: {
          languageVersion: 0,
          blocks: [
            {
              type: 'saged_on_start',
              x: 50,
              y: 50,
            },
          ],
        },
      },
      orderIndex: 12,
      isPublished: true,
    },
  });

  console.log(`✅ Created lesson: ${ysLesson3.title}`);

  // Young Sages Lesson 4: Leuk Litter Detector
  const ysLesson4 = await prisma.blocksLesson.upsert({
    where: { slug: 'leuk-litter-detector' },
    update: {
      blockConfig: leukFullToolbox,
      isPublished: true,
    },
    create: {
      slug: 'leuk-litter-detector',
      title: 'Leuk the Litter Detective',
      description: 'Build a program where Leuk patrols the savanna looking for litter!',
      instructions: `🔍 **Leuk Patrols for Litter!**

Help Leuk clean up the savanna! He needs to patrol and detect litter.

**The System:**
- INPUT: Leuk moving around
- PROCESS: Check different areas
- OUTPUT: Alert when "litter" is found

**Your Task:**
1. Make Leuk start at position (0, 0) using **"Go to X Y"**
2. Use **"Forever"** to make Leuk patrol
3. Make Leuk move and bounce off edges
4. When Leuk reaches certain positions, have him say "Litter found!"

**Ideas to Try:**
- When X > 100, say "Checking the east area..."
- When X < -100, say "Checking the west area..."
- When Y > 80, say "Litter found! Alerting cleanup crew!"

**Remember:**
AI systems do exactly this - patrol, detect, and alert!

**Make It Your Own:**
- Add different messages for different areas
- Change Leuk's color when he finds something
- Make him count how many pieces of "litter" he finds`,
      stageConfig: { width: 480, height: 360, spriteColor: '#228B22' },
      blockConfig: leukFullToolbox,
      starterWorkspace: {
        blocks: {
          languageVersion: 0,
          blocks: [
            {
              type: 'saged_on_start',
              x: 50,
              y: 50,
            },
          ],
        },
      },
      orderIndex: 13,
      isPublished: true,
    },
  });

  console.log(`✅ Created lesson: ${ysLesson4.title}`);

  // Young Sages Lesson 5: Capstone Project
  const ysLesson5 = await prisma.blocksLesson.upsert({
    where: { slug: 'capstone-project' },
    update: { 
      blockConfig: defaultToolbox,
      isPublished: true 
    },
    create: {
      slug: 'capstone-project',
      title: 'Your Community Solution',
      description: 'Build your own solution to a community problem using everything you learned!',
      instructions: `🎓 **Your Capstone Project!**

This is YOUR project. Use everything you've learned to build something meaningful!

**Project Requirements:**
✅ At least one **Event** block (On Start, On Key, or Forever)
✅ At least one **IF-THEN** style interaction (based on position or input)
✅ Use **Motion** or **Looks** blocks to show feedback
✅ Write a **reflection** when you submit

**Project Ideas:**

**Pet Feeding Reminder:**
- Leuk asks "Did you feed the pet?"
- Press Y for yes, N for no
- If no, Leuk says "Time to feed them!"

**Water Saving Alert:**
- Leuk patrols the stage
- At certain spots, he "detects" water waste
- Says "Turn off the tap!"

**Homework Helper:**
- Leuk moves to different subjects
- Press keys to hear study tips
- Says encouraging messages

**Lost Item Finder:**
- Leuk searches different areas
- Announces what he finds in each spot

**Remember:**
1. Choose a PROBLEM you care about
2. OBSERVE what causes it
3. Create IF-THEN RULES
4. BUILD it in Blocks Lab
5. REFLECT on what you learned

**You are a Young Sage!**
You think like Leuk, observe like a scientist, and build like a programmer!`,
      stageConfig: { width: 480, height: 360, spriteColor: '#124734' },
      blockConfig: leukFullToolbox,
      starterWorkspace: {
        blocks: {
          languageVersion: 0,
          blocks: [
            {
              type: 'saged_on_start',
              x: 50,
              y: 50,
            },
          ],
        },
      },
      orderIndex: 14,
      isPublished: true,
    },
  });

  console.log(`✅ Created lesson: ${ysLesson5.title}`);

  console.log('\n🎉 All Blocks Lab lessons seeded successfully!');
  console.log('\n📍 Original lessons:');
  console.log('   /learn/hello-world');
  console.log('   /learn/move-around');
  console.log('   /learn/simple-animation');
  console.log('   /learn/interactive-story');
  console.log('\n🐰 Young Sages lessons:');
  console.log('   /learn/leuk-says-hello');
  console.log('   /learn/leuk-explores');
  console.log('   /learn/leuk-bounces');
  console.log('   /learn/leuk-litter-detector');
  console.log('   /learn/capstone-project');
}

main()
  .catch((e) => {
    console.error('Error seeding blocks lessons:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
