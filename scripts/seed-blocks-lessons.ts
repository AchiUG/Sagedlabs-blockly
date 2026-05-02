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
        { kind: 'block', type: 'saged_if' },
        { kind: 'block', type: 'saged_if_else' },
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
        { kind: 'block', type: 'saged_touching_object', inputs: { ID: { shadow: { type: 'text', fields: { TEXT: 'object1' } } } } },
        { kind: 'block', type: 'saged_key_pressed' },
        { kind: 'block', type: 'saged_ask', inputs: { TEXT: { shadow: { type: 'text', fields: { TEXT: 'What is your name?' } } } } },
        { kind: 'block', type: 'saged_answer' },
      ],
    },
    {
      kind: 'category',
      name: '📦 Objects',
      colour: '#8A2BE2',
      contents: [
        {
          kind: 'block',
          type: 'saged_create_object',
          inputs: {
            X: { shadow: { type: 'math_number', fields: { NUM: 100 } } },
            Y: { shadow: { type: 'math_number', fields: { NUM: 0 } } },
            ID: { shadow: { type: 'text', fields: { TEXT: 'food1' } } },
          },
        },
        {
          kind: 'block',
          type: 'saged_remove_object',
          inputs: {
            ID: { shadow: { type: 'text', fields: { TEXT: 'food1' } } },
          },
        },
        {
          kind: 'block',
          type: 'saged_with_object',
          inputs: {
            ID: { shadow: { type: 'text', fields: { TEXT: 'food1' } } },
          },
        },
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
    {
      kind: 'category',
      name: '🔢 Variables',
      colour: '#FF8C1A',
      custom: 'VARIABLE',
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
        { kind: 'block', type: 'saged_if' },
        { kind: 'block', type: 'saged_if_else' },
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
        { kind: 'block', type: 'saged_touching_object', inputs: { ID: { shadow: { type: 'text', fields: { TEXT: 'object1' } } } } },
        { kind: 'block', type: 'saged_key_pressed' },
        { kind: 'block', type: 'saged_ask', inputs: { TEXT: { shadow: { type: 'text', fields: { TEXT: 'What is your name?' } } } } },
        { kind: 'block', type: 'saged_answer' },
      ],
    },
    {
      kind: 'category',
      name: '📦 Objects',
      colour: '#8A2BE2',
      contents: [
        {
          kind: 'block',
          type: 'saged_create_object',
          inputs: {
            X: { shadow: { type: 'math_number', fields: { NUM: 100 } } },
            Y: { shadow: { type: 'math_number', fields: { NUM: 0 } } },
            ID: { shadow: { type: 'text', fields: { TEXT: 'food1' } } },
          },
        },
        {
          kind: 'block',
          type: 'saged_remove_object',
          inputs: {
            ID: { shadow: { type: 'text', fields: { TEXT: 'food1' } } },
          },
        },
        {
          kind: 'block',
          type: 'saged_with_object',
          inputs: {
            ID: { shadow: { type: 'text', fields: { TEXT: 'food1' } } },
          },
        },
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
    {
      kind: 'category',
      name: '🔢 Variables',
      colour: '#FF8C1A',
      custom: 'VARIABLE',
    },
  ],
};

async function main() {
  console.log('🧱 Seeding Blocks Lab lessons...\n');

  // Lesson 1: Hello World
  const lesson1 = await prisma.blocksLesson.upsert({
    where: { slug: 'hello-world' },
    update: { 
      blockConfig: defaultToolbox,
      isPublished: true 
    },
    create: {
      slug: 'hello-world',
      title: 'Hello World - Your First Program',
      description: 'Make your character talk!',
      instructions: `👋 **Welcome to Blocks Lab!**

In this lesson, you'll learn how to make a character speak.

**Your Goal:**
Make the character say "Hello World!" when you press the Run button.

**Steps:**
1. Drag the **"When program starts"** block to the workspace.
2. Drag the **"Say"** block and attach it inside.
3. Type **"Hello World!"** in the text box.
4. Click the **"Run"** button to test it!`,
      stageConfig: { width: 480, height: 360, spriteColor: '#124734' },
      blockConfig: defaultToolbox,
      starterWorkspace: {
        blocks: {
          languageVersion: 0,
          blocks: [
            {
              type: 'saged_on_start',
              x: 20,
              y: 20,
            },
          ],
        },
      },
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
      description: 'Control your character with the keyboard!',
      instructions: `🎮 **Let's get moving!**

Now you'll learn how to control your character using the arrow keys.

**Your Goal:**
Make the character move in all four directions.

**Steps:**
1. Drag a **"When key pressed"** block.
2. Select **"up arrow"** and attach a **"Change Y by -10"** block. (In canvas, -Y is up!)
3. Do the same for **"down arrow"**, **"left arrow"**, and **"right arrow"**.
4. Test your controls by pressing the keys on your keyboard!`,
      stageConfig: { width: 480, height: 360, spriteColor: '#124734' },
      blockConfig: defaultToolbox,
      starterWorkspace: {
        blocks: {
          languageVersion: 0,
          blocks: [
            {
              type: 'saged_on_key',
              x: 20,
              y: 20,
              fields: { KEY: 'ArrowUp' },
            },
          ],
        },
      },
      isPublished: true,
    },
  });

  console.log(`✅ Created lesson: ${lesson2.title}`);

  // Lesson 3: Simple Animation
  const lesson3 = await prisma.blocksLesson.upsert({
    where: { slug: 'simple-animation' },
    update: { 
      blockConfig: defaultToolbox,
      isPublished: true 
    },
    create: {
      slug: 'simple-animation',
      title: 'Simple Animation - Forever Loops',
      description: 'Make things move on their own!',
      instructions: `🔁 **Automatic Motion!**

Loops let you repeat actions forever. Let's make the character bounce back and forth.

**Your Goal:**
Make the character move horizontally and bounce off the edges.

**Steps:**
1. Drag the **"Forever"** block.
2. Put a **"Change X by 10"** block inside.
3. Add a **"Bounce if on edge"** block below it.
4. Click **Run** and watch them go!`,
      stageConfig: { width: 480, height: 360, spriteColor: '#124734' },
      blockConfig: defaultToolbox,
      starterWorkspace: {
        blocks: {
          languageVersion: 0,
          blocks: [
            {
              type: 'saged_forever',
              x: 20,
              y: 20,
            },
          ],
        },
      },
      isPublished: true,
    },
  });

  console.log(`✅ Created lesson: ${lesson3.title}`);

  // Lesson 4: Interactive Story
  const lesson4 = await prisma.blocksLesson.upsert({
    where: { slug: 'interactive-story' },
    update: { 
      blockConfig: defaultToolbox,
      isPublished: true 
    },
    create: {
      slug: 'interactive-story',
      title: 'Interactive Story',
      description: 'Create a simple dialogue system!',
      instructions: `📖 **Tell a Story!**

Combine everything you've learned to create an interactive scene.

**Your Goal:**
Make the character introduce themselves and respond to different keys.

**Steps:**
1. On start, say "Hi! Press SPACE to hear my secret."
2. When SPACE is pressed, say "I love learning AI at SAGED!"
3. Add more keys to tell more of the story.`,
      stageConfig: { width: 480, height: 360, spriteColor: '#124734' },
      blockConfig: defaultToolbox,
      starterWorkspace: {
        blocks: {
          languageVersion: 0,
          blocks: [
            {
              type: 'saged_on_start',
              x: 20,
              y: 20,
            },
          ],
        },
      },
      isPublished: true,
    },
  });

  console.log(`✅ Created lesson: ${lesson4.title}`);

  console.log('\n🐰 Seeding Young Sages (Leuk) lessons...\n');

  // Young Sages Lesson 1: Leuk Says Hello
  const ysLesson1 = await prisma.blocksLesson.upsert({
    where: { slug: 'leuk-says-hello' },
    update: { 
      blockConfig: leukFullToolbox,
      isPublished: true 
    },
    create: {
      slug: 'leuk-says-hello',
      title: 'Leuk Says Hello',
      description: 'Introduce our clever hare!',
      instructions: `🐰 **Meet Leuk the Hare!**

Leuk is very clever and wants to meet you.

**Your Goal:**
Make Leuk say "Hello, I am Leuk the Hare!"

**Steps:**
1. Drag **"When program starts"**
2. Attach **"Say"**
3. Type his introduction!`,
      stageConfig: { width: 480, height: 360, spriteColor: '#124734' },
      blockConfig: leukFullToolbox,
      starterWorkspace: {
        blocks: {
          languageVersion: 0,
          blocks: [{ type: 'saged_on_start', x: 20, y: 20 }],
        },
      },
      isPublished: true,
    },
  });

  console.log(`✅ Created lesson: ${ysLesson1.title}`);

  // Young Sages Lesson 2: Leuk Explores
  const ysLesson2 = await prisma.blocksLesson.upsert({
    where: { slug: 'leuk-explores' },
    update: { 
      blockConfig: leukFullToolbox,
      isPublished: true 
    },
    create: {
      slug: 'leuk-explores',
      title: 'Leuk Explores the Savanna',
      description: 'Help Leuk navigate through the grass!',
      instructions: `🚶 **Exploration Time!**

Leuk needs to find the best spots in the savanna.

**Your Goal:**
Make Leuk move forward 4 times on start.

**Steps:**
1. Use **"When program starts"**
2. Connect 4 **"Change X by 50"** blocks in a row.
3. Watch him hop!`,
      stageConfig: { width: 480, height: 360, spriteColor: '#124734' },
      blockConfig: leukFullToolbox,
      starterWorkspace: {
        blocks: {
          languageVersion: 0,
          blocks: [{ type: 'saged_on_start', x: 20, y: 20 }],
        },
      },
      isPublished: true,
    },
  });

  console.log(`✅ Created lesson: ${ysLesson2.title}`);

  // Young Sages Lesson 3: Leuk Bounces
  const ysLesson3 = await prisma.blocksLesson.upsert({
    where: { slug: 'leuk-bounces' },
    update: { 
      blockConfig: leukFullToolbox,
      isPublished: true 
    },
    create: {
      slug: 'leuk-bounces',
      title: 'Leuk Bounces Around',
      description: 'Leuk is excited to learn!',
      instructions: `🏀 **Energy!**

Leuk can't sit still when he's learning something new.

**Your Goal:**
Make Leuk move back and forth forever.

**Steps:**
1. Use the **"Forever"** block.
2. Put **"Change X by 15"** inside.
3. Put **"Bounce if on edge"** inside.`,
      stageConfig: { width: 480, height: 360, spriteColor: '#124734' },
      blockConfig: leukFullToolbox,
      starterWorkspace: {
        blocks: {
          languageVersion: 0,
          blocks: [{ type: 'saged_forever', x: 20, y: 20 }],
        },
      },
      isPublished: true,
    },
  });

  console.log(`✅ Created lesson: ${ysLesson3.title}`);

  // Young Sages Lesson 4: Litter Detective
  const ysLesson4 = await prisma.blocksLesson.upsert({
    where: { slug: 'leuk-litter-detector' },
    update: { 
      blockConfig: leukFullToolbox,
      isPublished: true 
    },
    create: {
      slug: 'leuk-litter-detector',
      title: 'Leuk the Litter Detective',
      description: 'Use logic to keep the savanna clean!',
      instructions: `🕵️ **Thinking with IF!**

Leuk has a rule: IF he sees litter, THEN he says "Found some!"

**Your Goal:**
Make Leuk move, and IF his X position is greater than 100, say "I found litter!"

**Steps:**
1. Use **"Forever"** to keep moving.
2. Inside, put **"Change X by 5"**.
3. Add an **"If"** block.
4. Use a **"Math Compare"** (>) to check **"X Position"**.
5. Put a **"Say"** block inside the If.`,
      stageConfig: { width: 480, height: 360, spriteColor: '#124734' },
      blockConfig: leukFullToolbox,
      starterWorkspace: {
        blocks: {
          languageVersion: 0,
          blocks: [{ type: 'saged_forever', x: 20, y: 20 }],
        },
      },
      isPublished: true,
    },
  });

  console.log(`✅ Created lesson: ${ysLesson4.title}`);

  // Young Sages Lesson 5: Capstone Project
  const ysLesson5 = await prisma.blocksLesson.upsert({
    where: { slug: 'capstone-project' },
    update: { 
      blockConfig: leukFullToolbox,
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
          blocks: [{ type: 'saged_on_start', x: 20, y: 20 }],
        },
      },
      isPublished: true,
    },
  });

  console.log(`✅ Created lesson: ${ysLesson5.title}`);

  console.log('\n🎉 All Blocks Lab lessons seeded successfully!');
  console.log('\n📍 Original lessons:\n   /learn/hello-world\n   /learn/move-around\n   /learn/simple-animation\n   /learn/interactive-story');
  console.log('\n🐰 Young Sages lessons:\n   /learn/leuk-says-hello\n   /learn/leuk-explores\n   /learn/leuk-bounces\n   /learn/leuk-litter-detector\n   /learn/capstone-project');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
