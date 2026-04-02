import { PrismaClient } from '@prisma/client';
import { config } from 'dotenv';

config();

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Young Sages course...');

  // Find or create instructor
  let instructor = await prisma.user.findFirst({
    where: { role: 'INSTRUCTOR' }
  });

  if (!instructor) {
    instructor = await prisma.user.findFirst({
      where: { role: 'ADMIN' }
    });
  }

  if (!instructor) {
    throw new Error('No instructor or admin found. Please seed users first.');
  }

  // Check if course already exists
  let course = await prisma.course.findFirst({
    where: { title: 'Young Sages: Stories, Systems & Introduction to AI Thinking' },
  });

  if (!course) {
    course = await prisma.course.create({
      data: {
        title: 'Young Sages: Stories, Systems & Introduction to AI Thinking',
        description: 'An 8-week journey where young learners (ages 8-14) explore the foundations of artificial intelligence through African folklore, storytelling, and hands-on visual programming. Guided by Leuk the Hare, students learn to think like systems designers before writing a single line of code.',
        imageUrl: '/courses/young-sages-hero.jpg',
        level: 'BEGINNER',
        duration: '8 weeks',
        price: 0,
        isPublished: true,
        instructorId: instructor.id,
      }
    });
    console.log(`✅ Created new course: ${course.title}`);
  } else {
    console.log(`ℹ️ Course already exists: ${course.title}`);
    // Delete existing modules to recreate
    await prisma.module.deleteMany({ where: { courseId: course.id } });
    console.log('   Cleared existing modules for fresh seed');
  }

  console.log(`✅ Created course: ${course.title}`);

  // Week 1: Story → System Awareness
  const week1 = await createModule(course.id, 1, {
    title: 'Week 1: Story → System Awareness',
    description: 'Meet Leuk the Hare and learn how careful observation leads to understanding. Just like Leuk, we watch before we act.',
    lessons: [
      {
        title: 'Welcome to Young Sages',
        slug: 'ys-welcome',
        description: 'Meet your guides, understand the journey ahead, and learn what it means to think like a "Young Sage."',
        content: `<h2>Welcome, Young Sage! 🌟</h2>
<p>You're about to begin an incredible journey. Over the next 8 weeks, you'll learn to think like the smartest minds in technology—but we won't start with computers.</p>
<p>We'll start with <strong>stories</strong>.</p>
<h3>Who is Leuk?</h3>
<p>Leuk is a clever hare from West African folklore. He's small, but he solves big problems by <em>watching carefully</em> and <em>thinking deeply</em> before acting.</p>
<h3>What You'll Learn</h3>
<ul>
<li>How to observe the world like Leuk</li>
<li>How systems work all around us</li>
<li>What "artificial intelligence" really means</li>
<li>How to build your own simple AI programs!</li>
</ul>
<p>Remember: The best problem-solvers are patient observers first.</p>`,
        videoUrl: '',
        duration: 12,
        order: 1
      },
      {
        title: 'The Story of Leuk the Hare',
        slug: 'ys-leuk-story',
        description: 'Listen to the tale of how Leuk outsmarted the lion by watching and waiting.',
        content: `<h2>Leuk and the Lion 🦁🐰</h2>
<p>Long ago, in the savanna, all the animals feared the lion. He was strong and fast. But Leuk was <em>clever</em>.</p>
<p>One day, the lion demanded that each animal bring him food. The animals were scared. But Leuk said, "Let me observe first."</p>
<h3>What Leuk Did</h3>
<p>For three days, Leuk watched the lion:</p>
<ul>
<li>When did the lion sleep? (After eating, in the shade)</li>
<li>What made the lion angry? (Loud noises)</li>
<li>What did the lion fear? (His own reflection)</li>
</ul>
<p>Leuk used what he learned to trick the lion into chasing his own reflection into a deep well!</p>
<h3>The Lesson</h3>
<p><strong>Observation comes before action.</strong> Leuk won not because he was stronger, but because he <em>understood the system</em>.</p>
<p>This is exactly how AI works—it observes patterns before making decisions.</p>`,
        videoUrl: '',
        duration: 15,
        order: 2
      },
      {
        title: 'What is a System?',
        slug: 'ys-what-is-system',
        description: 'Learn to see the invisible "systems" that make everything work—from your breakfast to your school day.',
        content: `<h2>Systems Are Everywhere! 🔄</h2>
<p>A <strong>system</strong> is a set of parts that work together to do something.</p>
<h3>Examples of Systems</h3>
<p><strong>Your Morning System:</strong></p>
<ol>
<li>Alarm rings → You wake up</li>
<li>You're hungry → You eat breakfast</li>
<li>Time passes → You go to school</li>
</ol>
<p><strong>A Traffic Light System:</strong></p>
<ol>
<li>Timer counts down</li>
<li>Light changes color</li>
<li>Cars stop or go</li>
</ol>
<h3>🎯 Your Task</h3>
<p>Look around your home. Can you find 3 systems? Write them down:</p>
<ul>
<li>What starts the system? (INPUT)</li>
<li>What happens in the middle? (PROCESS)</li>
<li>What's the result? (OUTPUT)</li>
</ul>
<p>Like Leuk, we observe before we build!</p>`,
        videoUrl: '',
        duration: 10,
        order: 3
      },
      {
        title: 'Saturday Session: Becoming an Observer',
        slug: 'ys-week1-saturday',
        description: 'Live session agenda for Week 1 - practicing observation skills together.',
        content: `<h2>🗓️ Saturday Live Session - Week 1</h2>
<h3>Session Agenda (90 minutes)</h3>
<p><strong>Part 1: Welcome Circle (15 min)</strong></p>
<ul>
<li>Introductions: Name + Favorite animal</li>
<li>Quick review: What do you remember about Leuk?</li>
</ul>
<p><strong>Part 2: Observation Game (25 min)</strong></p>
<ul>
<li>"I Spy Systems" - Find systems in pictures</li>
<li>Small group discussions</li>
</ul>
<p><strong>Part 3: Share Your Systems (20 min)</strong></p>
<ul>
<li>Each student shares 1 system they found at home</li>
<li>Draw the Input → Process → Output</li>
</ul>
<p><strong>Part 4: Story Theater (20 min)</strong></p>
<ul>
<li>Act out the Leuk and Lion story together</li>
<li>Discuss: What did Leuk observe?</li>
</ul>
<p><strong>Part 5: Week Preview (10 min)</strong></p>
<ul>
<li>Next week: How stories change!</li>
<li>Assignment reminder</li>
</ul>
<h3>📝 Weekly Assignment</h3>
<p>Draw a "Day in My Life" system showing 5 things that happen in order. Bring it next Saturday!</p>`,
        videoUrl: '',
        duration: 90,
        order: 4
      }
    ]
  });

  // Week 2: AI as a Changing Story
  const week2 = await createModule(course.id, 2, {
    title: 'Week 2: AI as a Changing Story',
    description: 'Stories change when we get new information. Learn how feedback and adaptation make systems smarter.',
    lessons: [
      {
        title: 'Stories That Change',
        slug: 'ys-changing-stories',
        description: 'What happens when Leuk learns something new? The story changes! This is how AI learns too.',
        content: `<h2>When Stories Change 📖✨</h2>
<p>Imagine if Leuk went to trick the lion again, but this time the lion was waiting for him!</p>
<p>What would Leuk do? He'd <strong>adapt</strong>—change his plan based on new information.</p>
<h3>This is Called FEEDBACK</h3>
<p>Feedback is when you learn from what happened and change what you do next.</p>
<p><strong>Examples:</strong></p>
<ul>
<li>You touch something hot → You learn not to touch it again</li>
<li>You tell a joke and people laugh → You remember that joke works</li>
<li>Leuk's trick fails → He tries a different trick</li>
</ul>
<h3>How AI Uses Feedback</h3>
<p>AI programs make guesses. When they're wrong, they remember and try something different. Just like you!</p>
<p>This is called <strong>learning from feedback</strong>.</p>`,
        videoUrl: '',
        duration: 12,
        order: 1
      },
      {
        title: 'Memory Makes Us Smarter',
        slug: 'ys-memory',
        description: 'Why remembering the past helps us make better decisions in the future.',
        content: `<h2>The Power of Memory 🧠</h2>
<p>Leuk remembers everything he observes. That's his superpower!</p>
<h3>Types of Memory</h3>
<p><strong>Short-term memory:</strong> What you had for breakfast today</p>
<p><strong>Long-term memory:</strong> How to ride a bike</p>
<p><strong>Pattern memory:</strong> Knowing that dark clouds mean rain</p>
<h3>AI Has Memory Too!</h3>
<p>When AI sees 1000 pictures of cats, it <em>remembers</em> what cats look like. Then when it sees a new picture, it can say "that's probably a cat!"</p>
<h3>🎯 Memory Challenge</h3>
<p>Look at these patterns. What comes next?</p>
<ul>
<li>🔴 🔵 🔴 🔵 🔴 ___</li>
<li>🌙 🌙 ⭐ 🌙 🌙 ⭐ 🌙 🌙 ___</li>
<li>1, 2, 4, 7, 11, ___</li>
</ul>
<p>You used memory and patterns to predict! That's AI thinking.</p>`,
        videoUrl: '',
        duration: 10,
        order: 2
      },
      {
        title: 'The Feedback Loop',
        slug: 'ys-feedback-loop',
        description: 'Understanding the cycle of try, learn, improve—the heart of how AI gets smarter.',
        content: `<h2>Try → Learn → Improve 🔄</h2>
<p>This is the most important idea in AI:</p>
<div style="text-align: center; font-size: 1.2em; padding: 20px; background: #f0f0f0; border-radius: 10px;">
<strong>Try something</strong> → <strong>See what happens</strong> → <strong>Change your approach</strong> → <strong>Try again</strong>
</div>
<h3>Leuk's Feedback Loop</h3>
<ol>
<li><strong>Try:</strong> Leuk tries to steal honey from bees</li>
<li><strong>Result:</strong> He gets stung!</li>
<li><strong>Learn:</strong> "Bees protect their honey"</li>
<li><strong>Improve:</strong> Next time, he waits until the bees leave</li>
</ol>
<h3>Your Feedback Loops</h3>
<p>Think about learning to ride a bike:</p>
<ol>
<li>You try to balance → You fall</li>
<li>You try again with training wheels → Better!</li>
<li>You try without training wheels → Wobbly but working</li>
<li>You practice more → Success!</li>
</ol>
<p>Every "failure" taught you something.</p>`,
        videoUrl: '',
        duration: 12,
        order: 3
      },
      {
        title: 'Saturday Session: Feedback Games',
        slug: 'ys-week2-saturday',
        description: 'Live session exploring adaptation and feedback through interactive games.',
        content: `<h2>🗓️ Saturday Live Session - Week 2</h2>
<h3>Session Agenda (90 minutes)</h3>
<p><strong>Part 1: Warm Up (10 min)</strong></p>
<ul>
<li>Share your "Day in My Life" drawings</li>
<li>Quick patterns quiz</li>
</ul>
<p><strong>Part 2: Hot/Cold Game (20 min)</strong></p>
<ul>
<li>One student hides an object</li>
<li>Others search using only "warmer" and "colder" feedback</li>
<li>Discussion: How did feedback help you find it?</li>
</ul>
<p><strong>Part 3: Story Adaptation (25 min)</strong></p>
<ul>
<li>Tell a Leuk story as a group</li>
<li>At each choice point, vote on what Leuk should do</li>
<li>See how the story changes based on decisions</li>
</ul>
<p><strong>Part 4: Robot Game (25 min)</strong></p>
<ul>
<li>One student is the "robot," others give commands</li>
<li>Robot can only do exactly what's said</li>
<li>Learn why <em>clear instructions</em> matter</li>
</ul>
<p><strong>Part 5: Reflection (10 min)</strong></p>
<ul>
<li>What did we learn about feedback?</li>
<li>Preview: Next week we make RULES!</li>
</ul>
<h3>📝 Weekly Assignment</h3>
<p>Write about a time you tried something, failed, learned, and succeeded. Use the feedback loop!</p>`,
        videoUrl: '',
        duration: 90,
        order: 4
      }
    ]
  });

  // Week 3: From Story to Rules
  const week3 = await createModule(course.id, 3, {
    title: 'Week 3: From Story to Rules',
    description: 'Every story follows rules. Learn IF-THEN thinking—the language computers understand.',
    lessons: [
      {
        title: 'If This, Then That',
        slug: 'ys-if-then',
        description: 'The most powerful idea in computing: IF something happens, THEN do something else.',
        content: `<h2>The Magic of IF-THEN 🪄</h2>
<p>Leuk thinks in IF-THEN rules:</p>
<ul>
<li><strong>IF</strong> I see a lion, <strong>THEN</strong> I hide</li>
<li><strong>IF</strong> I'm hungry, <strong>THEN</strong> I look for food</li>
<li><strong>IF</strong> it's raining, <strong>THEN</strong> I find shelter</li>
</ul>
<h3>Rules Are Everywhere!</h3>
<p>Your life is full of IF-THEN rules:</p>
<ul>
<li><strong>IF</strong> the light is red, <strong>THEN</strong> stop</li>
<li><strong>IF</strong> you're tired, <strong>THEN</strong> sleep</li>
<li><strong>IF</strong> someone says hello, <strong>THEN</strong> say hello back</li>
</ul>
<h3>Why This Matters</h3>
<p>Computers can ONLY understand IF-THEN rules. When you teach a computer, you're really writing lots of IF-THEN statements!</p>
<h3>🎯 Your Turn</h3>
<p>Write 3 IF-THEN rules for:</p>
<ol>
<li>What you do when you wake up</li>
<li>How you play your favorite game</li>
<li>What Leuk might do in the forest</li>
</ol>`,
        videoUrl: '',
        duration: 12,
        order: 1
      },
      {
        title: 'Leuk\'s Rule Book',
        slug: 'ys-leuk-rules',
        description: 'Help Leuk create a complete rule book for surviving in the savanna.',
        content: `<h2>Creating Leuk's Survival Guide 📚</h2>
<p>Leuk needs a rule book to teach other young hares how to survive. Let's help him!</p>
<h3>Rules About Predators</h3>
<ul>
<li>IF you see a lion's mane, THEN run zigzag</li>
<li>IF you hear an eagle's cry, THEN hide under bushes</li>
<li>IF you smell a snake, THEN freeze and look around</li>
</ul>
<h3>Rules About Food</h3>
<ul>
<li>IF berries are red, THEN check if birds eat them first</li>
<li>IF the grass is green, THEN it's safe to eat</li>
<li>IF water is still, THEN look for crocodiles</li>
</ul>
<h3>Rules About Friends</h3>
<ul>
<li>IF another hare thumps twice, THEN danger is coming</li>
<li>IF the elephant trumpets, THEN water is nearby</li>
</ul>
<h3>🎯 Add Your Rules</h3>
<p>What other rules should Leuk include? Think about:</p>
<ul>
<li>Weather rules</li>
<li>Nighttime rules</li>
<li>Rules for making decisions</li>
</ul>`,
        videoUrl: '',
        duration: 10,
        order: 2
      },
      {
        title: 'Combining Rules',
        slug: 'ys-combining-rules',
        description: 'What happens when we use AND and OR to make smarter rules?',
        content: `<h2>Smarter Rules with AND & OR 🧩</h2>
<p>Sometimes one rule isn't enough. We need to combine them!</p>
<h3>Using AND</h3>
<p><strong>IF</strong> it's raining <strong>AND</strong> I have an umbrella, <strong>THEN</strong> I can go outside</p>
<p>Both things must be true!</p>
<h3>Using OR</h3>
<p><strong>IF</strong> I'm hungry <strong>OR</strong> I'm thirsty, <strong>THEN</strong> I go to the kitchen</p>
<p>Only one needs to be true!</p>
<h3>Leuk's Smart Rules</h3>
<ul>
<li>IF (lion is sleeping) AND (wind blows away from lion), THEN safe to pass</li>
<li>IF (I'm hungry) OR (the sun is setting), THEN find food now</li>
<li>IF (it's dark) AND (I hear noise) AND (I can't see), THEN stay very still</li>
</ul>
<h3>🎯 Challenge</h3>
<p>Create a rule using AND or OR for each situation:</p>
<ol>
<li>When you can play video games</li>
<li>When Leuk should ask for help</li>
<li>When it's a good day to play outside</li>
</ol>`,
        videoUrl: '',
        duration: 12,
        order: 3
      },
      {
        title: 'Saturday Session: Rule Makers',
        slug: 'ys-week3-saturday',
        description: 'Live session building and testing IF-THEN rules together.',
        content: `<h2>🗓️ Saturday Live Session - Week 3</h2>
<h3>Session Agenda (90 minutes)</h3>
<p><strong>Part 1: Rule Review (15 min)</strong></p>
<ul>
<li>Share your IF-THEN rules from the week</li>
<li>Vote on the most creative rule</li>
</ul>
<p><strong>Part 2: Simon Says... With Rules! (20 min)</strong></p>
<ul>
<li>Play Simon Says using IF-THEN language</li>
<li>"IF Simon says jump, THEN jump"</li>
<li>Add AND/OR for complexity</li>
</ul>
<p><strong>Part 3: Build a Rule Machine (25 min)</strong></p>
<ul>
<li>In pairs, create a "rule machine" on paper</li>
<li>Input → Rules → Output</li>
<li>Trade and test each other's machines</li>
</ul>
<p><strong>Part 4: Leuk's Adventure Game (20 min)</strong></p>
<ul>
<li>Text adventure as a group</li>
<li>"Leuk sees a river. IF swim, go to page 3. IF look for bridge, go to page 5."</li>
<li>Students write the next chapter</li>
</ul>
<p><strong>Part 5: Preview Blocks Lab! (10 min)</strong></p>
<ul>
<li>Show a quick demo of SAGED Blocks Lab</li>
<li>"Next week, we make Leuk move with code!"</li>
</ul>
<h3>📝 Weekly Assignment</h3>
<p>Create a "Rule Machine" for something in your life (morning routine, game, pet care). Draw the flow!</p>`,
        videoUrl: '',
        duration: 90,
        order: 4
      }
    ]
  });

  // Week 4: Building Leuk's Mind
  const week4 = await createModule(course.id, 4, {
    title: 'Week 4: Building Leuk\'s Mind',
    description: 'Time to meet SAGED Blocks Lab! Create your first program and make Leuk come alive on screen.',
    lessons: [
      {
        title: 'Welcome to Blocks Lab',
        slug: 'ys-blocks-intro',
        description: 'Your first look at SAGED Blocks Lab—where you\'ll bring your ideas to life!',
        content: `<h2>Welcome to SAGED Blocks Lab! 🧱</h2>
<p>You've learned to think like Leuk. Now it's time to BUILD like Leuk!</p>
<h3>What is Blocks Lab?</h3>
<p>Blocks Lab is where you create programs by snapping colorful blocks together—like digital LEGO!</p>
<h3>No Typing Required</h3>
<p>Instead of typing confusing code, you:</p>
<ol>
<li><strong>Drag</strong> blocks from the toolbox</li>
<li><strong>Snap</strong> them together</li>
<li><strong>Click Run</strong> to see them work!</li>
</ol>
<h3>The Blocks Are Your Words</h3>
<p>Remember IF-THEN rules? Blocks Lab has blocks for that!</p>
<ul>
<li>🟢 <strong>Event blocks</strong> (green) = When something happens</li>
<li>🔵 <strong>Motion blocks</strong> (blue) = Move the character</li>
<li>🟣 <strong>Looks blocks</strong> (purple) = Change appearance</li>
<li>🟡 <strong>Control blocks</strong> (yellow) = IF-THEN and loops</li>
</ul>
<h3>🎯 Get Ready!</h3>
<p>In the next lesson, you'll open Blocks Lab and make your first program!</p>`,
        videoUrl: '',
        duration: 10,
        order: 1
      },
      {
        title: 'Your First Block Program',
        slug: 'ys-first-program',
        description: 'Open Blocks Lab and make the sprite say hello—your first real code!',
        content: `<h2>Let's Make Something! 🚀</h2>
<p>It's time to create your very first program in SAGED Blocks Lab!</p>
<h3>Your First Activity: Hello World</h3>
<p>Go to the Blocks Lab lesson: <a href="/learn/leuk-says-hello">/learn/leuk-says-hello</a></p>
<h3>What You'll Do</h3>
<ol>
<li>Find the <strong>On Start</strong> block (green)</li>
<li>Drag a <strong>Say</strong> block (purple) inside it</li>
<li>Type "Hello! I am Leuk!"</li>
<li>Click <strong>Run</strong></li>
</ol>
<h3>What Happens?</h3>
<p>The sprite on the stage will show a speech bubble with your message!</p>
<h3>🎉 Congratulations!</h3>
<p>You just wrote your first program. You told the computer:</p>
<p><em>"WHEN the program starts, THEN say 'Hello! I am Leuk!'"</em></p>
<p>That's an IF-THEN rule in action!</p>
<h3>📝 Remember</h3>
<ul>
<li>Click <strong>Save</strong> to keep your work</li>
<li>Click <strong>Submit</strong> when you're finished</li>
</ul>`,
        videoUrl: '',
        duration: 15,
        order: 2
      },
      {
        title: 'Making Leuk Move',
        slug: 'ys-leuk-moves',
        description: 'Add motion blocks to make your character walk, jump, and explore the stage.',
        content: `<h2>Leuk Learns to Move! 🏃</h2>
<p>A character that just talks is boring. Let's make Leuk MOVE!</p>
<h3>Your Activity: Exploring the Stage</h3>
<p>Go to: <a href="/learn/leuk-explores">/learn/leuk-explores</a></p>
<h3>Motion Blocks to Try</h3>
<ul>
<li><strong>Move X by 10</strong> → Move right</li>
<li><strong>Move X by -10</strong> → Move left</li>
<li><strong>Move Y by 10</strong> → Move up</li>
<li><strong>Move Y by -10</strong> → Move down</li>
</ul>
<h3>Challenge: Square Dance</h3>
<p>Can you make Leuk move in a square?</p>
<ol>
<li>Move right</li>
<li>Move up</li>
<li>Move left</li>
<li>Move down</li>
<li>Back where you started!</li>
</ol>
<h3>The Coordinate System</h3>
<p>The stage is like a map:</p>
<ul>
<li><strong>X</strong> = left (-) and right (+)</li>
<li><strong>Y</strong> = down (-) and up (+)</li>
<li><strong>Center</strong> = (0, 0)</li>
</ul>`,
        videoUrl: '',
        duration: 15,
        order: 3
      },
      {
        title: 'Saturday Session: First Code Celebration',
        slug: 'ys-week4-saturday',
        description: 'Live session where everyone creates and shares their first Blocks Lab programs.',
        content: `<h2>🗓️ Saturday Live Session - Week 4</h2>
<h3>Session Agenda (90 minutes)</h3>
<p><strong>Part 1: Blocks Lab Tour (15 min)</strong></p>
<ul>
<li>Screen share: Navigate Blocks Lab together</li>
<li>Find blocks, run, save, reset</li>
</ul>
<p><strong>Part 2: Hello World Together (20 min)</strong></p>
<ul>
<li>Everyone completes /learn/leuk-says-hello</li>
<li>Customize your message</li>
<li>Share what Leuk says!</li>
</ul>
<p><strong>Part 3: Movement Challenge (25 min)</strong></p>
<ul>
<li>Complete /learn/leuk-explores</li>
<li>Challenge: Make Leuk visit all 4 corners</li>
<li>Who can do it with the fewest blocks?</li>
</ul>
<p><strong>Part 4: Free Create (20 min)</strong></p>
<ul>
<li>Combine Say + Move blocks</li>
<li>Make Leuk tell a short story while moving</li>
</ul>
<p><strong>Part 5: Show & Tell (10 min)</strong></p>
<ul>
<li>3-4 volunteers share their creations</li>
<li>Celebrate everyone's first code!</li>
</ul>
<h3>📝 Weekly Assignment</h3>
<p>Complete both Blocks Lab activities. Try to make Leuk say 3 different things while moving to 3 different places!</p>`,
        videoUrl: '',
        duration: 90,
        order: 4
      }
    ]
  });

  // Week 5: Constraints & Failure
  const week5 = await createModule(course.id, 5, {
    title: 'Week 5: Constraints & Failure',
    description: 'Why limits make us creative, and why failure is the best teacher. Learn about bias, randomness, and the edge of the stage.',
    lessons: [
      {
        title: 'The Gift of Limits',
        slug: 'ys-limits',
        description: 'Why having constraints actually makes you MORE creative, not less.',
        content: `<h2>Limits Make Us Creative 🎁</h2>
<p>Leuk can't fly. He can't breathe underwater. He's small and has no claws.</p>
<p>But these <strong>limits</strong> made him the cleverest animal!</p>
<h3>Why Limits Help</h3>
<ul>
<li><strong>They force you to think differently</strong></li>
<li><strong>They make you focus</strong></li>
<li><strong>They lead to surprising solutions</strong></li>
</ul>
<h3>Limits in Blocks Lab</h3>
<p>Your stage has edges. Leuk can only move so far before hitting the boundary.</p>
<p>What if we use that limit creatively?</p>
<ul>
<li>Make Leuk <strong>bounce</strong> off edges</li>
<li>Make Leuk <strong>wrap around</strong> to the other side</li>
<li>Make Leuk <strong>say something</strong> when hitting a wall</li>
</ul>
<h3>🎯 Reflection</h3>
<p>Think of a time when a rule or limit helped you be more creative. Maybe a word limit on a story? A time limit on a game?</p>`,
        videoUrl: '',
        duration: 12,
        order: 1
      },
      {
        title: 'Learning from Failure',
        slug: 'ys-failure',
        description: 'Every mistake is a lesson. Learn how AI systems get smarter by failing thousands of times.',
        content: `<h2>Failure is Your Teacher 📚</h2>
<p>Did you know that AI systems fail THOUSANDS of times before they work?</p>
<h3>How AI Learns</h3>
<ol>
<li>AI tries something → Wrong!</li>
<li>AI adjusts → Still wrong!</li>
<li>AI tries again → Getting closer...</li>
<li>After 10,000 tries → Finally works!</li>
</ol>
<h3>Leuk Failed Too</h3>
<p>Before Leuk tricked the lion successfully, he probably:</p>
<ul>
<li>Got chased and barely escaped</li>
<li>Tried a trick that didn't work</li>
<li>Made wrong guesses about the lion's behavior</li>
</ul>
<p>But each failure taught him something!</p>
<h3>In Blocks Lab</h3>
<p>When your program doesn't work:</p>
<ol>
<li><strong>Don't give up!</strong></li>
<li>Ask: What did I expect to happen?</li>
<li>Ask: What actually happened?</li>
<li>Find the difference → Fix it → Try again</li>
</ol>
<p>This is called <strong>debugging</strong>—and it's a superpower!</p>`,
        videoUrl: '',
        duration: 10,
        order: 2
      },
      {
        title: 'What is Bias?',
        slug: 'ys-bias',
        description: 'Understanding how our experiences shape what we believe—and why AI can have biases too.',
        content: `<h2>Everyone Has Bias 🤔</h2>
<p><strong>Bias</strong> is when you favor one thing over another based on past experience.</p>
<h3>Leuk's Bias</h3>
<p>If Leuk was chased by a brown dog once, he might think ALL brown dogs are dangerous.</p>
<p>Is that fair? Is that accurate?</p>
<h3>Human Bias Examples</h3>
<ul>
<li>You ate bad fish once → You think all fish tastes bad</li>
<li>Your best friend likes soccer → You assume everyone does</li>
<li>You've never seen snow → You might not believe it's cold</li>
</ul>
<h3>AI Has Bias Too!</h3>
<p>If an AI only sees pictures of cats that are orange, it might think all cats are orange.</p>
<p>AI learns from data that <em>humans</em> provide. If the data is limited or unfair, the AI will be too.</p>
<h3>🎯 Thinking Question</h3>
<p>What bias might an AI have if it was only trained with:</p>
<ul>
<li>Pictures from one country?</li>
<li>Stories written by adults only?</li>
<li>Music from only one style?</li>
</ul>`,
        videoUrl: '',
        duration: 12,
        order: 3
      },
      {
        title: 'Saturday Session: Embracing Limits',
        slug: 'ys-week5-saturday',
        description: 'Live session exploring constraints, failure, and bias through activities and Blocks Lab.',
        content: `<h2>🗓️ Saturday Live Session - Week 5</h2>
<h3>Session Agenda (90 minutes)</h3>
<p><strong>Part 1: Failure Stories (15 min)</strong></p>
<ul>
<li>Share a time you failed and learned</li>
<li>Celebrate the lessons, not just successes!</li>
</ul>
<p><strong>Part 2: Constraint Challenge (20 min)</strong></p>
<ul>
<li>Draw a cat using only 5 lines</li>
<li>Write a story using only 20 words</li>
<li>Discuss: How did limits help?</li>
</ul>
<p><strong>Part 3: Blocks Lab - Bounce! (25 min)</strong></p>
<ul>
<li>Go to /learn/leuk-bounces</li>
<li>Make Leuk bounce off the edges</li>
<li>What happens if he moves too fast?</li>
</ul>
<p><strong>Part 4: Bias Detective (20 min)</strong></p>
<ul>
<li>Look at AI-generated images together</li>
<li>What biases do you notice?</li>
<li>How might we fix them?</li>
</ul>
<p><strong>Part 5: Debugging Practice (10 min)</strong></p>
<ul>
<li>Teacher shares a "broken" program</li>
<li>Students find the bug together</li>
</ul>
<h3>📝 Weekly Assignment</h3>
<p>Create a Blocks Lab program with at least one "creative constraint" - maybe Leuk can only move in one direction, or can only speak certain words.</p>`,
        videoUrl: '',
        duration: 90,
        order: 4
      }
    ]
  });

  // Week 6: Real-World System: Litter Project
  const week6 = await createModule(course.id, 6, {
    title: 'Week 6: Real-World System - The Litter Project',
    description: 'Apply everything you\'ve learned to understand a real problem: litter in your community. Design a system to help!',
    lessons: [
      {
        title: 'Observing Your Community',
        slug: 'ys-community-observe',
        description: 'Like Leuk, we start by watching. What systems exist in your neighborhood?',
        content: `<h2>Becoming a Community Observer 👀</h2>
<p>Leuk learned by watching the savanna. Now YOU will watch your community!</p>
<h3>The Litter Problem</h3>
<p>Litter is trash in the wrong place. It's a problem everywhere.</p>
<p>But before we solve it, we must <strong>understand</strong> it.</p>
<h3>Your Observation Mission</h3>
<p>This week, observe litter in your area:</p>
<ul>
<li><strong>WHERE</strong> do you see litter? (park, street, school)</li>
<li><strong>WHAT</strong> kind of litter? (plastic, paper, food)</li>
<li><strong>WHEN</strong> does litter appear? (after lunch, after events)</li>
<li><strong>WHO</strong> might be littering? (not to blame, but to understand)</li>
</ul>
<h3>Think Like a System</h3>
<p>Litter is part of a system:</p>
<ul>
<li><strong>Input:</strong> People have trash</li>
<li><strong>Process:</strong> What do they do with it?</li>
<li><strong>Output:</strong> It goes in a bin... or on the ground</li>
</ul>
<p>Where does the system break down?</p>`,
        videoUrl: '',
        duration: 12,
        order: 1
      },
      {
        title: 'Designing a Solution',
        slug: 'ys-litter-solution',
        description: 'Use IF-THEN rules to design a system that could reduce litter.',
        content: `<h2>From Problem to Solution 🛠️</h2>
<p>Now that you've observed, let's DESIGN!</p>
<h3>What Makes People Litter?</h3>
<p>Usually it's because:</p>
<ul>
<li>No bin is nearby</li>
<li>The bin is full</li>
<li>They don't care (yet!)</li>
<li>They're in a hurry</li>
</ul>
<h3>IF-THEN Solutions</h3>
<p>Let's write rules to help:</p>
<ul>
<li><strong>IF</strong> bins are closer together, <strong>THEN</strong> people will use them more</li>
<li><strong>IF</strong> bins are colorful and fun, <strong>THEN</strong> kids might use them</li>
<li><strong>IF</strong> there's a reward for recycling, <strong>THEN</strong> people might participate</li>
</ul>
<h3>Design Your System</h3>
<p>Draw or describe a "Litter Solution System":</p>
<ol>
<li>What's the input? (trash, people)</li>
<li>What are the rules? (IF-THEN)</li>
<li>What's the desired output? (clean space)</li>
</ol>
<h3>Could AI Help?</h3>
<p>Brainstorm: How might AI detect litter? Alert cleaners? Reward recyclers?</p>`,
        videoUrl: '',
        duration: 12,
        order: 2
      },
      {
        title: 'Building a Litter Detector',
        slug: 'ys-litter-detector',
        description: 'Create a Blocks Lab program that simulates detecting litter on the ground.',
        content: `<h2>Code Your Litter Detector! 🔍</h2>
<p>Let's build a simple program in Blocks Lab that shows how a litter detection system might work.</p>
<h3>Your Activity</h3>
<p>Go to: <a href="/learn/leuk-litter-detector">/learn/leuk-litter-detector</a></p>
<h3>What You'll Build</h3>
<p>A program where:</p>
<ol>
<li>Leuk moves around the stage (patrolling)</li>
<li>When Leuk reaches certain spots, he "detects" litter</li>
<li>Leuk says "Litter found! Alerting cleanup crew!"</li>
</ol>
<h3>Blocks You'll Use</h3>
<ul>
<li><strong>Forever</strong> - Keep patrolling</li>
<li><strong>Move</strong> - Patrol the area</li>
<li><strong>If touching edge</strong> - Change direction</li>
<li><strong>Say</strong> - Report findings</li>
</ul>
<h3>Make It Your Own</h3>
<p>Add your own features:</p>
<ul>
<li>Count how many pieces of litter found</li>
<li>Change color when litter is detected</li>
<li>Make different messages for different areas</li>
</ul>`,
        videoUrl: '',
        duration: 15,
        order: 3
      },
      {
        title: 'Saturday Session: Litter Project Showcase',
        slug: 'ys-week6-saturday',
        description: 'Live session presenting litter observations and solutions.',
        content: `<h2>🗓️ Saturday Live Session - Week 6</h2>
<h3>Session Agenda (90 minutes)</h3>
<p><strong>Part 1: Observation Reports (20 min)</strong></p>
<ul>
<li>Each student shares their litter observations</li>
<li>Create a class "litter map" together</li>
<li>What patterns do we notice?</li>
</ul>
<p><strong>Part 2: Solution Gallery (20 min)</strong></p>
<ul>
<li>Share your IF-THEN litter solutions</li>
<li>Vote on most creative, most practical, most fun</li>
</ul>
<p><strong>Part 3: Code Together (25 min)</strong></p>
<ul>
<li>Complete /learn/leuk-litter-detector as a class</li>
<li>Each person adds one unique feature</li>
<li>Debug together when things go wrong</li>
</ul>
<p><strong>Part 4: Real AI Examples (15 min)</strong></p>
<ul>
<li>Show real litter-detection AI systems</li>
<li>How do they work?</li>
<li>What are their limits?</li>
</ul>
<p><strong>Part 5: Capstone Preview (10 min)</strong></p>
<ul>
<li>In 2 weeks, you'll design your OWN project!</li>
<li>Start thinking about problems in your community</li>
</ul>
<h3>📝 Weekly Assignment</h3>
<p>Write a 1-page "Litter Report" with your observations and proposed solution. Include at least 3 IF-THEN rules.</p>`,
        videoUrl: '',
        duration: 90,
        order: 4
      }
    ]
  });

  // Week 7: Governance & Protection
  const week7 = await createModule(course.id, 7, {
    title: 'Week 7: Governance & Protection',
    description: 'Not everything should be automated. Learn what to protect from AI and why human judgment matters.',
    lessons: [
      {
        title: 'What Should Stay Human?',
        slug: 'ys-stay-human',
        description: 'Some decisions should never be made by machines. Learn to identify them.',
        content: `<h2>The Human Touch 🤝</h2>
<p>AI is powerful, but some things should ALWAYS involve humans.</p>
<h3>Leuk's Wisdom</h3>
<p>Leuk is clever, but he doesn't make decisions for other animals. He helps them think, but they choose.</p>
<h3>Things AI Should NOT Decide Alone</h3>
<ul>
<li><strong>Who is guilty or innocent</strong> - Needs human judgment</li>
<li><strong>Who gets medical treatment first</strong> - Needs compassion</li>
<li><strong>What art is "good"</strong> - Needs human creativity</li>
<li><strong>Who you should be friends with</strong> - Needs personal choice</li>
</ul>
<h3>Why?</h3>
<p>AI doesn't understand:</p>
<ul>
<li>Feelings</li>
<li>Context that isn't in the data</li>
<li>What it means to be human</li>
<li>Fairness in complex situations</li>
</ul>
<h3>🎯 Your Turn</h3>
<p>List 5 decisions that should ALWAYS have a human involved, even if AI helps.</p>`,
        videoUrl: '',
        duration: 12,
        order: 1
      },
      {
        title: 'Privacy and Protection',
        slug: 'ys-privacy',
        description: 'Your data is precious. Learn how to protect yourself in a digital world.',
        content: `<h2>Protecting Yourself 🛡️</h2>
<p>Every time you use a computer or phone, you create <strong>data</strong>—information about yourself.</p>
<h3>What is Data?</h3>
<p>Data about you includes:</p>
<ul>
<li>Your name, age, location</li>
<li>What websites you visit</li>
<li>What you search for</li>
<li>Who your friends are</li>
<li>What you buy</li>
</ul>
<h3>Who Wants Your Data?</h3>
<ul>
<li><strong>Companies</strong> - To sell you things</li>
<li><strong>Governments</strong> - To keep track of citizens</li>
<li><strong>Criminals</strong> - To steal or trick you</li>
</ul>
<h3>Leuk's Privacy Rules</h3>
<ol>
<li>Don't share your home address online</li>
<li>Use strong passwords (not your pet's name!)</li>
<li>Ask a parent before downloading apps</li>
<li>If something feels wrong, tell an adult</li>
</ol>
<h3>🎯 Discussion</h3>
<p>What personal information should you NEVER share online? Make a list!</p>`,
        videoUrl: '',
        duration: 12,
        order: 2
      },
      {
        title: 'Building With Care',
        slug: 'ys-build-care',
        description: 'When you create programs, you have responsibility. Learn ethical coding.',
        content: `<h2>The Coder's Responsibility 🌟</h2>
<p>When you write code, you have POWER. With power comes responsibility!</p>
<h3>Questions to Ask Before Building</h3>
<ol>
<li><strong>Who will this help?</strong></li>
<li><strong>Could this hurt anyone?</strong></li>
<li><strong>Is this fair to everyone?</strong></li>
<li><strong>Would I want this used on me?</strong></li>
</ol>
<h3>Leuk's Building Rules</h3>
<ul>
<li>Build to HELP, not to trick</li>
<li>Test your creations before sharing</li>
<li>Listen to feedback and improve</li>
<li>Admit when something isn't working</li>
</ul>
<h3>Real Example</h3>
<p>Imagine you build a program that rates how "cool" people are. Seems fun, right?</p>
<p>But what if:</p>
<ul>
<li>Someone gets a low score and feels bad?</li>
<li>The rating is unfair to some groups?</li>
<li>People start bullying based on scores?</li>
</ul>
<p>Always think about consequences!</p>`,
        videoUrl: '',
        duration: 10,
        order: 3
      },
      {
        title: 'Saturday Session: Ethics in Action',
        slug: 'ys-week7-saturday',
        description: 'Live session exploring AI ethics through scenarios and discussions.',
        content: `<h2>🗓️ Saturday Live Session - Week 7</h2>
<h3>Session Agenda (90 minutes)</h3>
<p><strong>Part 1: Warm Up - Would You Automate? (15 min)</strong></p>
<ul>
<li>Quick polls: Should AI do this? Yes/No/Maybe</li>
<li>Drive cars? Grade homework? Choose your clothes?</li>
<li>Discuss disagreements</li>
</ul>
<p><strong>Part 2: Privacy Game (20 min)</strong></p>
<ul>
<li>"What Does This App Know?"</li>
<li>Look at permissions of common apps</li>
<li>Discuss: Is it worth it?</li>
</ul>
<p><strong>Part 3: Ethical Scenarios (25 min)</strong></p>
<ul>
<li>Break into groups</li>
<li>Each group gets a scenario</li>
<li>Present: What would you do? Why?</li>
</ul>
<p><strong>Part 4: Design an Ethical AI (20 min)</strong></p>
<ul>
<li>In pairs, design an AI that helps WITHOUT causing harm</li>
<li>What rules does it follow?</li>
<li>What can it NOT do?</li>
</ul>
<p><strong>Part 5: Capstone Prep (10 min)</strong></p>
<ul>
<li>Finalize your capstone problem choice</li>
<li>Share with the class for feedback</li>
</ul>
<h3>📝 Weekly Assignment</h3>
<p>Write your Capstone Project proposal: What community problem will you explore? What system will you design? How will you use Blocks Lab?</p>`,
        videoUrl: '',
        duration: 90,
        order: 4
      }
    ]
  });

  // Week 8: Community Capstone
  const week8 = await createModule(course.id, 8, {
    title: 'Week 8: Community Capstone',
    description: 'Your final project! Choose a local issue, design a system, build it in Blocks Lab, and present to the community.',
    lessons: [
      {
        title: 'Choosing Your Problem',
        slug: 'ys-choose-problem',
        description: 'Select a local issue that matters to you and begin your observation phase.',
        content: `<h2>Your Problem, Your Project 🎯</h2>
<p>For your capstone, YOU choose what to work on!</p>
<h3>Good Problems to Explore</h3>
<ul>
<li><strong>Environmental:</strong> Water waste, litter, plant care</li>
<li><strong>Community:</strong> Lost pets, helping elderly, neighborhood safety</li>
<li><strong>School:</strong> Lunch line waits, lost items, noise levels</li>
<li><strong>Home:</strong> Chore reminders, energy saving, pet feeding</li>
</ul>
<h3>Leuk's Approach</h3>
<ol>
<li><strong>Observe</strong> - Watch the problem carefully</li>
<li><strong>Ask</strong> - What causes this? Who's affected?</li>
<li><strong>Design</strong> - Create IF-THEN rules</li>
<li><strong>Build</strong> - Make it in Blocks Lab</li>
<li><strong>Reflect</strong> - What did you learn?</li>
</ol>
<h3>🎯 This Week</h3>
<p>Finalize your problem. Start your observation notebook. Document:</p>
<ul>
<li>What is the problem?</li>
<li>Who does it affect?</li>
<li>What have you observed?</li>
<li>What system might help?</li>
</ul>`,
        videoUrl: '',
        duration: 12,
        order: 1
      },
      {
        title: 'Building Your Solution',
        slug: 'ys-build-solution',
        description: 'Turn your design into a working Blocks Lab program.',
        content: `<h2>From Design to Code 🔧</h2>
<p>Time to build your capstone project in Blocks Lab!</p>
<h3>Your Activity</h3>
<p>Go to: <a href="/learn/capstone-project">/learn/capstone-project</a></p>
<h3>Project Requirements</h3>
<p>Your Blocks Lab project should include:</p>
<ul>
<li>✅ At least one <strong>Event</strong> block (On Start, On Key, or Forever)</li>
<li>✅ At least one <strong>IF-THEN</strong> style interaction</li>
<li>✅ <strong>Motion</strong> or <strong>Looks</strong> blocks to show feedback</li>
<li>✅ A <strong>reflection</strong> when you submit</li>
</ul>
<h3>Example Projects</h3>
<p><strong>Pet Feeding Reminder:</strong></p>
<ul>
<li>Leuk asks "Did you feed the pet?"</li>
<li>Press Y for yes, N for no</li>
<li>If no, Leuk says "Time to feed them!"</li>
</ul>
<p><strong>Water Saving Alert:</strong></p>
<ul>
<li>Leuk patrols the stage</li>
<li>At certain spots, he "detects" water waste</li>
<li>Says "Turn off the tap!"</li>
</ul>
<h3>Make It Yours!</h3>
<p>Be creative. This is YOUR solution to YOUR problem!</p>`,
        videoUrl: '',
        duration: 15,
        order: 2
      },
      {
        title: 'Preparing Your Presentation',
        slug: 'ys-presentation',
        description: 'Learn how to share your project with others clearly and confidently.',
        content: `<h2>Share Your Work! 🎤</h2>
<p>Saturday is your showcase! Here's how to prepare.</p>
<h3>Your Presentation Should Include</h3>
<ol>
<li><strong>The Problem</strong> (1 minute)
<ul>
<li>What problem did you choose?</li>
<li>Why does it matter to you?</li>
</ul>
</li>
<li><strong>Your Observations</strong> (1 minute)
<ul>
<li>What did you notice?</li>
<li>What patterns did you find?</li>
</ul>
</li>
<li><strong>Your Solution</strong> (2 minutes)
<ul>
<li>What IF-THEN rules did you create?</li>
<li>Show your Blocks Lab program</li>
<li>Explain how it works</li>
</ul>
</li>
<li><strong>What You Learned</strong> (1 minute)
<ul>
<li>What was hard?</li>
<li>What would you do differently?</li>
<li>What's next?</li>
</ul>
</li>
</ol>
<h3>Tips from Leuk</h3>
<ul>
<li>Practice out loud at least twice</li>
<li>Speak slowly and clearly</li>
<li>It's okay to use notes!</li>
<li>Everyone is cheering for you</li>
</ul>`,
        videoUrl: '',
        duration: 10,
        order: 3
      },
      {
        title: 'Saturday Session: Capstone Showcase',
        slug: 'ys-week8-saturday',
        description: 'The grand finale! Present your projects and celebrate your journey.',
        content: `<h2>🗓️ Saturday Live Session - Week 8</h2>
<h2>🎉 CAPSTONE SHOWCASE! 🎉</h2>
<h3>Session Agenda (90 minutes)</h3>
<p><strong>Part 1: Opening Ceremony (10 min)</strong></p>
<ul>
<li>Congratulations, Young Sages!</li>
<li>Reflect on our 8-week journey</li>
<li>From Leuk to AI thinking!</li>
</ul>
<p><strong>Part 2: Student Presentations (60 min)</strong></p>
<ul>
<li>Each student presents (5 minutes each)</li>
<li>Show your problem, observations, solution, and code</li>
<li>Q&A from classmates</li>
</ul>
<p><strong>Part 3: Awards & Recognition (10 min)</strong></p>
<ul>
<li>🏆 Most Creative Solution</li>
<li>🏆 Best Observer</li>
<li>🏆 Most Improved Coder</li>
<li>🏆 Best Presentation</li>
<li>🏆 Community Champion</li>
<li>Every student receives a certificate!</li>
</ul>
<p><strong>Part 4: Closing Circle (10 min)</strong></p>
<ul>
<li>One thing you learned</li>
<li>One thing you'll keep doing</li>
<li>Thank you messages</li>
</ul>
<h3>🎓 You Are Now a Young Sage!</h3>
<p>You've completed the journey from story to system to code. You think like Leuk, observe like a scientist, and build like a programmer.</p>
<p>The world needs Young Sages like you!</p>`,
        videoUrl: '',
        duration: 90,
        order: 4
      }
    ]
  });

  console.log('✅ All 8 weeks created!');
  console.log('🌱 Young Sages course seeding complete!');
}

async function createModule(courseId: string, orderIndex: number, data: {
  title: string;
  description: string;
  lessons: {
    title: string;
    slug: string;
    description: string;
    content: string;
    videoUrl: string;
    duration: number;
    order: number;
  }[];
}) {
  const module = await prisma.module.create({
    data: {
      title: data.title,
      description: data.description,
      orderIndex: orderIndex,
      courseId: courseId,
      lessons: {
        create: data.lessons.map((lesson, idx) => ({
          title: lesson.title,
          // Include description in content
          content: `<p class="lesson-description">${lesson.description}</p>\n${lesson.content}`,
          videoUrl: lesson.videoUrl || null,
          duration: lesson.duration,
          orderIndex: lesson.order,
        }))
      }
    },
    include: { lessons: true }
  });

  console.log(`  📦 Created module: ${data.title} (${data.lessons.length} lessons)`);
  return module;
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
