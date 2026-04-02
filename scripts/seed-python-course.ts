import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const prisma = new PrismaClient();

async function seedPythonCourse() {
  console.log('🚀 Seeding Python for AI Course...\n');

  try {
    // Get admin user
    const admin = await prisma.user.findFirst({
      where: { role: 'ADMIN' }
    });

    if (!admin) {
      throw new Error('Admin user not found. Please create an admin user first.');
    }

    // Check if course already exists
    const existingCourse = await prisma.course.findFirst({
      where: { title: 'Python for AI: Data Types, Functions, NumPy, Pandas' }
    });

    if (existingCourse) {
      console.log('⚠️  Course already exists! Deleting old version...');
      await prisma.course.delete({ where: { id: existingCourse.id } });
    }

    // Create course
    const course = await prisma.course.create({
      data: {
        title: 'Python for AI: Data Types, Functions, NumPy, Pandas',
        description: `Master Python fundamentals for AI and data science with a focus on real-world applications in forest conservation and supply chain traceability. This course bridges local African challenges with global technology solutions, helping you understand how code represents reality.

**SDLC Phase:** Planning & Analysis  
**CREATE Stage:** C + R (Contextualize + Remix)

Through hands-on projects mapping cocoa & timber supply chains, you'll learn to translate local problems into data-driven solutions. Perfect for learners transitioning from Seeker to Apprentice level.`,
        shortDescription: 'Learn Python fundamentals for AI through real-world forest conservation and supply chain projects',
        imageUrl: '/images/courses/python-ai-course.jpg',
        level: 'BEGINNER',
        learningStage: 2,
        duration: '8 weeks',
        prerequisites: 'Basic computer literacy, curiosity about technology and local challenges',
        learningObjectives: [
          'Understand how data represents real-world systems and stories',
          'Write Python scripts to analyze local supply chain data',
          'Master data types, variables, functions, and control flow',
          'Use NumPy and Pandas for data manipulation',
          'Build symbolic models that connect folklore to data structures',
          'Apply AI principles to solve local forest conservation challenges'
        ],
        price: 0,
        isPublished: true,
        instructorId: admin.id
      }
    });

    console.log(`✅ Course created: ${course.title}`);

    // Create Week 1 Module
    const week1 = await prisma.module.create({
      data: {
        title: 'Week 1: Understanding the Problem & Python Fundamentals',
        description: `**Motive:** Learn how local problems translate into data problems.  
**Project:** Map the cocoa & timber supply chain using symbols, stories, and datasets.  
**Skills:** Python syntax • Data types • Variables • Input/output • Control flow`,
        orderIndex: 1,
        courseId: course.id
      }
    });

    console.log(`✅ Module created: ${week1.title}`);

    // Create lessons - Full content included
    await createLesson1(week1.id);
    await createLesson2(week1.id);
    await createLesson3(week1.id);
    
    // Create assignment
    await createAssignment1(week1.id);

    console.log('\n🎉 Python for AI course created successfully!');
    console.log(`✅ Course ID: ${course.id}`);
    console.log(`✅ Module ID: ${week1.id}`);
    console.log('✅ All lessons and assignments created!');

  } catch (error) {
    console.error('❌ Error seeding course:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

async function createLesson1(moduleId: string) {
  const content = `# Understanding Local Forest Challenges Through Data

## 🌳 Introduction

Welcome to the beginning of your journey in using technology to address real-world challenges! In this lesson, we'll explore how the forests in our communities are facing challenges, and how we can use data and technology to understand and solve these problems.

## 📊 The Challenge: Forest Traceability

### What is Traceability?

Traceability is the ability to track something through all stages of production, processing, and distribution. For forests, this means:

- **Where did the timber come from?** (Which forest, which tree?)
- **Who harvested it?** (Which community, which workers?)
- **Where is it going?** (Which market, which buyer?)
- **Is it legal and sustainable?** (Proper permits, replanting plans?)

### Why Does It Matter?

1. **Illegal Logging**: Without proper tracking, illegal logging goes undetected
2. **Community Rights**: Local communities lose income when their resources are stolen
3. **Environmental Impact**: Unsustainable harvesting destroys ecosystems
4. **Economic Loss**: Countries lose billions in revenue from illegal timber trade

## 🗺️ Story Mapping Exercise

### The Journey of a Tree

Let's map the story of a single tree from forest to market:

**Story Elements:**
1. **Origin**: A mahogany tree in the Ashanti Forest Reserve
2. **Characters**: 
   - The Forest Guardian (community elder who watches over sacred groves)
   - The Logger (licensed harvester)
   - The Middleman (timber trader)
   - The Export Company (international buyer)
3. **Journey**:
   - Tree identified for harvesting
   - Permit obtained (or not?)
   - Tree cut and transported to sawmill
   - Processed into planks
   - Sold to middleman
   - Exported to international markets

### Converting Story to Data

Each story element can become a **data point**:

| Story Element | Data Field | Example Value |
|--------------|------------|---------------|
| Tree location | GPS coordinates | (6.7°N, 1.6°W) |
| Tree species | Species name | Mahogany |
| Tree age | Years | 120 years |
| Harvest date | Date | 2024-10-15 |
| Permit number | ID | GHA-2024-00234 |
| Logger name | Text | Kofi Mensah |
| Community | Text | Ejisu Village |

## 🌍 Case Study: Cocoa Supply Chain

### The Problem

Ghana and Côte d'Ivoire produce 60% of the world's cocoa. But:
- Farmers receive only 6% of the final chocolate bar price
- Child labor is still widespread
- Deforestation for new cocoa farms threatens biodiversity

### The Data Solution

By creating a transparent supply chain system, we can:
- Track cocoa from farm to factory
- Ensure fair payment to farmers
- Verify no child labor was used
- Monitor forest boundaries

## 🎯 Your Task: Create Your Own Story Map

### Part 1: Choose a Local Resource

Pick something from your community:
- Timber/wood products
- Cocoa or coffee
- Palm oil
- Shea butter
- Artisanal crafts

### Part 2: Map the Journey

Draw or describe:
1. Where does it start?
2. Who are the key people involved?
3. What are the stages from origin to market?
4. Where are the vulnerable points (where problems could occur)?

### Part 3: Identify Data Points

For each stage, list:
- What information would help track this stage?
- How could we collect this information?
- What would this look like as data?

## 🤔 Reflection Questions

1. What surprised you about the journey of products from your community?
2. Where in the supply chain could technology make the biggest difference?
3. What traditional knowledge exists that could inform our data collection?
4. How can we ensure technology empowers communities rather than exploits them?

## 🔍 AI Companion Integration

Your AI companion can help you:
- **Research**: Find data about supply chains in your region
- **Map**: Create visual diagrams of resource flows
- **Analyze**: Identify patterns and vulnerabilities
- **Synthesize**: Connect traditional stories with modern data concepts

## ✅ Completion Criteria

To complete this lesson, submit:
1. Your story map (hand-drawn or digital)
2. A list of at least 10 data points you identified
3. A 200-word reflection on how data could help your community

---

**Next Lesson**: We'll start writing actual Python code to represent these data points!
`;

  await prisma.lesson.create({
    data: {
      title: 'Context Workshop: Forest Challenges & Story Mapping',
      content,
      duration: 90,
      orderIndex: 1,
      moduleId
    }
  });

  console.log('  ✅ Lesson 1 created');
}

async function createLesson2(moduleId: string) {
  const content = `# Writing Your First Python Scripts

## 🎯 Learning Objectives

By the end of this lesson, you will:
- Install and set up Python on your computer
- Write basic Python scripts to count and classify data
- Understand variables, data types, and basic operations
- Apply Python to analyze forest and supply chain data

## 🛠️ Setup: Installing Python

### Windows
1. Go to [python.org](https://www.python.org/downloads/)
2. Download Python 3.11 or later
3. Run the installer
4. **Important**: Check "Add Python to PATH"
5. Click "Install Now"

### macOS
\`\`\`bash
brew install python3
\`\`\`

### Linux (Ubuntu/Debian)
\`\`\`bash
sudo apt update
sudo apt install python3 python3-pip
\`\`\`

## 📝 Your First Python Script

Create a file called \`hello_forest.py\`:

\`\`\`python
# My first Python script
print("Hello, Forest!")
print("I'm learning to use code to protect our trees 🌳")
\`\`\`

Run it:
\`\`\`bash
python3 hello_forest.py
\`\`\`

## 🔢 Variables: Storing Information

\`\`\`python
# Storing tree data
tree_species = "Mahogany"
tree_age = 120
tree_height = 35.5
is_protected = True

print(f"Species: {tree_species}")
print(f"Age: {tree_age} years")
print(f"Height: {tree_height} meters")
print(f"Protected: {is_protected}")
\`\`\`

## 📊 Counting Trees: Basic Operations

\`\`\`python
# Tree inventory for a forest section
trees_counted_monday = 45
trees_counted_tuesday = 38
trees_counted_wednesday = 52

total_trees = trees_counted_monday + trees_counted_tuesday + trees_counted_wednesday
average_per_day = total_trees / 3

print(f"Total trees counted: {total_trees}")
print(f"Average per day: {average_per_day:.1f}")
\`\`\`

## 📋 Lists: Working with Collections

\`\`\`python
# List of tree species in a forest plot
species = ["Mahogany", "Teak", "Iroko", "Wawa", "Odum"]

first_species = species[0]
last_species = species[-1]

print(f"First species: {first_species}")
print(f"Last species: {last_species}")
print(f"Total species: {len(species)}")

species.append("Ceiba")
print(f"Updated list: {species}")
\`\`\`

## 🔄 Loops: Processing Multiple Items

\`\`\`python
logged_trees = [15, 22, 18, 30, 12]

total = 0
for count in logged_trees:
    total = total + count
    print(f"Added {count}, running total: {total}")

print(f"\\nTotal trees logged this week: {total}")
\`\`\`

## 🎯 Real Project: Cocoa Farm Data

\`\`\`python
# Cocoa harvest data (in kg)
farm_harvests = {
    "Kofi's Farm": 245,
    "Ama's Farm": 312,
    "Kwame's Farm": 198,
    "Abena's Farm": 267,
    "Yaw's Farm": 289
}

total_harvest = sum(farm_harvests.values())
average_harvest = total_harvest / len(farm_harvests)
max_harvest = max(farm_harvests.values())
min_harvest = min(farm_harvests.values())

print("=== COCOA HARVEST ANALYSIS ===")
print(f"Total harvest: {total_harvest} kg")
print(f"Average per farm: {average_harvest:.1f} kg")
print(f"Highest yield: {max_harvest} kg")
print(f"Lowest yield: {min_harvest} kg")

for farm, harvest in farm_harvests.items():
    if harvest == max_harvest:
        print(f"\\n🏆 Top producer: {farm}")
\`\`\`

## 💻 Your Turn: Timber Analysis

Create a script that:
1. Stores data about 5 timber shipments
2. Calculates total volume
3. Identifies shipments over 100 cubic meters
4. Prints a summary report

## ✅ Practice Exercises

### Exercise 1: Basic Stats
Calculate total and average trees logged: \`[23, 45, 12, 67, 34]\`

### Exercise 2: Species Counter
Count occurrences: \`["Oak", "Pine", "Oak", "Teak", "Oak", "Pine", "Mahogany"]\`

### Exercise 3: Supply Chain
Create a dictionary for a timber shipment with origin, destination, volume, date, permit number.

---

**Next Lesson**: Conditional logic and decision-making in programs!
`;

  await prisma.lesson.create({
    data: {
      title: 'Python Lab 1: Your First Scripts - Counting and Classifying',
      content,
      duration: 120,
      orderIndex: 2,
      moduleId
    }
  });

  console.log('  ✅ Lesson 2 created');
}

async function createLesson3(moduleId: string) {
  const content = `# From Stories to Code: Cultural Data Modeling

## 🌟 Introduction

In this unique lesson, we'll explore how traditional African folktales and wisdom can be represented in code. This exercise helps you understand **object-oriented programming** by connecting it to stories you already know.

## 📖 The Forest Spirit Story

### Traditional Tale: "Asase Yaa and the Sacred Grove"

> In the ancient forests of Ashanti, there lived a powerful forest spirit named Asase Yaa. She watched over the trees, each with its own spirit and story. The oldest trees were elders, carrying the wisdom of centuries. When a tree was cut without permission, the whole forest felt the pain.

## 💻 Creating Our First Class

\`\`\`python
class Tree:
    """Represents a tree in our forest"""
    
    def __init__(self, species, age, height):
        self.species = species
        self.age = age
        self.height = height
        self.is_sacred = age > 100
        
    def describe(self):
        status = "sacred elder" if self.is_sacred else "young tree"
        return f"{self.species} tree, {self.age} years old, {self.height}m tall ({status})"
    
    def grow(self, years):
        """Simulate tree growth"""
        self.age += years
        self.height += years * 0.3
        if self.age > 100:
            self.is_sacred = True

# Create trees
mahogany_elder = Tree("Mahogany", 150, 40)
young_teak = Tree("Teak", 12, 8)

print(mahogany_elder.describe())
print(young_teak.describe())

young_teak.grow(10)
print(f"\\nAfter 10 years: {young_teak.describe()}")
\`\`\`

## 🌳 Building the Forest Guardian

\`\`\`python
class ForestGuardian:
    """Represents Asase Yaa, the forest spirit"""
    
    def __init__(self, name, forest_name):
        self.name = name
        self.forest_name = forest_name
        self.trees_protected = []
        self.warnings_sent = 0
    
    def protect_tree(self, tree):
        self.trees_protected.append(tree)
        print(f"🌳 {self.name} now protects a {tree.species} tree")
    
    def send_warning(self, reason):
        self.warnings_sent += 1
        print(f"⚠️  Warning #{self.warnings_sent}: {reason}")
    
    def forest_status(self):
        total_trees = len(self.trees_protected)
        sacred_trees = sum(1 for tree in self.trees_protected if tree.is_sacred)
        
        print(f"\\n=== {self.forest_name} Status ===")
        print(f"Guardian: {self.name}")
        print(f"Total trees: {total_trees}")
        print(f"Sacred elders: {sacred_trees}")
        print(f"Warnings sent: {self.warnings_sent}")

# Create guardian
asase_yaa = ForestGuardian("Asase Yaa", "Sacred Grove of Ejisu")
asase_yaa.protect_tree(mahogany_elder)
asase_yaa.protect_tree(young_teak)
asase_yaa.send_warning("Unauthorized logging detected")
asase_yaa.forest_status()
\`\`\`

## 🌍 Modeling Supply Chains

\`\`\`python
class SupplyChainActor:
    def __init__(self, name, role, location):
        self.name = name
        self.role = role
        self.location = location
        self.transactions = []
    
    def receive_goods(self, goods, quantity, from_actor):
        self.transactions.append({
            "action": "received",
            "goods": goods,
            "quantity": quantity,
            "from": from_actor.name
        })
    
    def send_goods(self, goods, quantity, to_actor):
        self.transactions.append({
            "action": "sent",
            "goods": goods,
            "quantity": quantity,
            "to": to_actor.name
        })

farmer = SupplyChainActor("Kofi Mensah", "Farmer", "Ejisu Village")
cooperative = SupplyChainActor("Ejisu Coop", "Cooperative", "Ejisu Town")

farmer.send_goods("cocoa beans", 500, cooperative)
cooperative.receive_goods("cocoa beans", 500, farmer)
\`\`\`

## 🎯 Your Assignment: Model a Local Story

Choose one:

### Option 1: The Wise Elder
Model an elder teaching forest knowledge to students

### Option 2: Market Day
Model vendors, customers, and transactions

### Option 3: Farming Season
Model farming cycles with planting, growing, and harvesting

## 📊 Symbolic Thinking Bridge

| Real World | Code World |
|-----------|------------|
| Person | Object/Instance |
| Characteristics | Attributes |
| Actions | Methods |
| Relationships | References |

## ✅ Submission Requirements

Submit a Python file that:
1. Contains at least 2 classes
2. Creates instances and demonstrates interactions
3. Includes a main() function
4. Has comments explaining the story and code

---

**Congratulations!** You've completed Week 1!

**Next Week**: NumPy, Pandas, and real supply chain trackers!
`;

  await prisma.lesson.create({
    data: {
      title: 'Symbolic Exercise: Converting Folktales to Data Models',
      content,
      duration: 120,
      orderIndex: 3,
      moduleId
    }
  });

  console.log('  ✅ Lesson 3 created');
}

async function createAssignment1(moduleId: string) {
  const description = `# Week 1 Capstone Project: Supply Chain Story Model

## 🎯 Objective

Create a complete Python program that models a local supply chain story using classes, objects, and data structures.

## 📋 Requirements

### Minimum Requirements (70 points)

1. **Two Classes** (20 points)
   - At least 2 related classes
   - Each with 3+ attributes
   - Each with 2+ methods

2. **Data Tracking** (20 points)
   - Track at least 5 transactions/events
   - Use appropriate data structures
   - Calculate meaningful statistics

3. **Story Context** (15 points)
   - Based on real local supply chain
   - Includes explanatory comments
   - Meaningful names

4. **Functionality** (15 points)
   - Create instances
   - Demonstrate interactions
   - Print formatted output

### Bonus Features (30 points)
- Data visualization (+10)
- Error handling (+10)
- Advanced features (+10)

## 💡 Example Topics

1. **Cocoa Supply Chain**: Farmer → Coop → Exporter → Factory
2. **Timber Traceability**: Forest → Logger → Sawmill → Export
3. **Artisan Crafts**: Artisan → Market → Shop → Buyer
4. **Shea Butter**: Gatherer → Processor → Coop → Company

## 📝 Submission Format

ZIP file containing:
1. **main.py** - Your program
2. **README.md** - Documentation
3. **sample_output.txt** - Example output
4. **reflection.txt** - Reflection answers

## 🎯 Evaluation Rubric

| Criteria | Points |
|----------|--------|
| Code Quality | 20 |
| Functionality | 20 |
| Data Model | 20 |
| Context | 15 |
| Documentation | 15 |
| Creativity | 10 |
| **Total** | **100** |

## ✅ Success Criteria

- ✅ Code runs without errors
- ✅ Models a real-world system
- ✅ Demonstrates OOP concepts
- ✅ Includes meaningful data
- ✅ Shows cultural context

Good luck! 🌍💻🌳`;

  await prisma.assignment.create({
    data: {
      title: 'Week 1 Capstone: Supply Chain Story Model',
      description,
      type: 'PROJECT',
      maxScore: 100,
      orderIndex: 1,
      moduleId
    }
  });

  console.log('  ✅ Assignment created');
}

// Run the seed
seedPythonCourse()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
