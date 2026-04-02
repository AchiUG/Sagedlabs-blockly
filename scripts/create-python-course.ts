
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Creating SAGED Python Fundamentals Course...\n');

  // Create the course
  const course = await prisma.course.create({
    data: {
      title: 'SAGED Python Fundamentals: Building a Data Analysis App',
      shortDescription: 'Learn Python by building a complete data analysis and visualization web application from scratch using a top-down approach.',
      description: `Master Python fundamentals by reverse-engineering and building a real-world data analysis application. 

**Top-Down Learning Approach**: Instead of spending months on syntax, you'll start by exploring a complete, working app, then learn Python concepts as you build it yourself.

**What You'll Build**:
- Data upload and processing system
- Statistical analysis engine
- Interactive visualizations (matplotlib & plotly)
- RESTful API with Flask
- Complete web interface
- Optional: Database integration

**Perfect For**:
- Complete beginners (no coding experience required)
- People who learn by doing
- Anyone who wants to build practical data analysis tools
- Those tired of boring syntax-first tutorials

**By the end**: You'll have a deployed, working data analysis app and the Python skills to build more.`,
      imageUrl: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800&q=80',
      level: 'BEGINNER',
      price: 0,
      isPublished: true,
      categoryId: null,
      instructorId: 'cmfvxtbiv00070bt75m2iw1qn', // Admin user ID
      duration: '50 hours', // 50 hours total
      learningObjectives: [
        'Build a complete data analysis web application from scratch',
        'Master Python fundamentals in a practical, project-based context',
        'Work with pandas for data manipulation and analysis',
        'Create visualizations with matplotlib and plotly',
        'Build RESTful APIs with Flask',
        'Handle file uploads and process various data formats',
        'Deploy Python applications to production',
        'Write clean, maintainable Python code'
      ],
      prerequisites: 'No programming experience required. Just a computer, internet connection, and willingness to learn by building.',
    },
  });

  console.log(`✅ Course created: ${course.title}`);
  console.log(`   Course ID: ${course.id}\n`);

  // Module 1: The Big Picture
  const module1 = await prisma.module.create({
    data: {
      title: 'Module 1: The Big Picture - What We\'re Building',
      description: 'Start by seeing the complete application in action, understanding its architecture, and setting up your development environment.',
      courseId: course.id,
      orderIndex: 1,
      lessons: {
        create: [
          {
            title: 'App Demo & Overview',
            content: 'Full walkthrough of the completed data analysis app. See what you\'ll be building and understand all its features.',
            duration: 30,
            orderIndex: 1,
            videoUrl: 'https://www.youtube.com/watch?v=example1', // User will update
            thumbnailUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
          },
          {
            title: 'Application Architecture',
            content: 'High-level system design: frontend vs backend, data flow, and key technologies (Python, pandas, matplotlib, Flask).',
            duration: 45,
            orderIndex: 2,
            videoUrl: 'https://www.youtube.com/watch?v=example2',
            thumbnailUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80',
          },
          {
            title: 'Setting Up Your Environment',
            content: 'Install Python, VS Code, set up virtual environments, and run the app locally for the first time.',
            duration: 90,
            orderIndex: 3,
            videoUrl: 'https://www.youtube.com/watch?v=example3',
            thumbnailUrl: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=800&q=80',
          },
          {
            title: 'Running Your First Python Script',
            content: 'The "Hello World" of data analysis. Learn just enough Python syntax to run a simple data analysis script and see results.',
            duration: 45,
            orderIndex: 4,
            videoUrl: 'https://www.youtube.com/watch?v=example4',
            thumbnailUrl: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=800&q=80',
          },
        ],
      },
    },
  });
  console.log(`✅ Created: ${module1.title}`);

  // Module 2: Data Handling
  const module2 = await prisma.module.create({
    data: {
      title: 'Module 2: Data Handling - The Foundation',
      description: 'Learn Python data types, pandas DataFrames, data cleaning, and file operations - all in the context of building your app.',
      courseId: course.id,
      orderIndex: 2,
      lessons: {
        create: [
          {
            title: 'Understanding Data Types',
            content: 'Learn strings, numbers, booleans, and lists by seeing where each type is used in the app.',
            duration: 60,
            orderIndex: 1,
            videoUrl: 'https://www.youtube.com/watch?v=example5',
            thumbnailUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
          },
          {
            title: 'Working with Pandas DataFrames',
            content: 'Master the tool that stores and manipulates all tabular data in your app. Load, view, select, and filter data.',
            duration: 90,
            orderIndex: 2,
            videoUrl: 'https://www.youtube.com/watch?v=example6',
            thumbnailUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
          },
          {
            title: 'Data Cleaning & Transformation',
            content: 'Handle missing values, rename columns, convert data types, and create calculated fields - essential for real-world data.',
            duration: 90,
            orderIndex: 3,
            videoUrl: 'https://www.youtube.com/watch?v=example7',
            thumbnailUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
          },
          {
            title: 'Reading & Writing Files',
            content: 'Build the file I/O system: handle CSV, Excel, JSON uploads and save processed data.',
            duration: 60,
            orderIndex: 4,
            videoUrl: 'https://www.youtube.com/watch?v=example8',
            thumbnailUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
          },
        ],
      },
    },
  });
  console.log(`✅ Created: ${module2.title}`);

  // Module 3: Data Analysis
  const module3 = await prisma.module.create({
    data: {
      title: 'Module 3: Data Analysis - The Core Logic',
      description: 'Implement the app\'s analysis features: statistics, grouping, filtering, and sorting.',
      courseId: course.id,
      orderIndex: 3,
      lessons: {
        create: [
          {
            title: 'Basic Statistics with Python',
            content: 'Build the statistics dashboard: mean, median, mode, standard deviation using numpy and pandas.',
            duration: 75,
            orderIndex: 1,
            videoUrl: 'https://www.youtube.com/watch?v=example9',
            thumbnailUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
          },
          {
            title: 'Grouping & Aggregation',
            content: 'Implement the "group by" feature: break down data by categories, create pivot tables.',
            duration: 75,
            orderIndex: 2,
            videoUrl: 'https://www.youtube.com/watch?v=example10',
            thumbnailUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
          },
          {
            title: 'Filtering & Conditional Logic',
            content: 'Build the data filter system using boolean indexing, multiple conditions, and if-else statements.',
            duration: 75,
            orderIndex: 3,
            videoUrl: 'https://www.youtube.com/watch?v=example11',
            thumbnailUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
          },
          {
            title: 'Sorting & Ranking',
            content: 'Implement result ordering: sort dataframes, rank data, create "Top N" analyses.',
            duration: 60,
            orderIndex: 4,
            videoUrl: 'https://www.youtube.com/watch?v=example12',
            thumbnailUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
          },
        ],
      },
    },
  });
  console.log(`✅ Created: ${module3.title}`);

  // Module 4: Data Visualization
  const module4 = await prisma.module.create({
    data: {
      title: 'Module 4: Data Visualization - Making Insights Visual',
      description: 'Build the app\'s plotting engine with matplotlib and plotly: bar charts, line charts, scatter plots, and interactive visualizations.',
      courseId: course.id,
      orderIndex: 4,
      lessons: {
        create: [
          {
            title: 'Introduction to Matplotlib',
            content: 'Learn the plotting engine: create basic plots, customize appearance, save as images.',
            duration: 60,
            orderIndex: 1,
            videoUrl: 'https://www.youtube.com/watch?v=example13',
            thumbnailUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
          },
          {
            title: 'Bar Charts & Histograms',
            content: 'Build the bar chart generator: vertical, horizontal, grouped, and stacked bars.',
            duration: 60,
            orderIndex: 2,
            videoUrl: 'https://www.youtube.com/watch?v=example14',
            thumbnailUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
          },
          {
            title: 'Line Charts & Time Series',
            content: 'Create the time series plotter: handle datetime data, multiple lines, trend lines.',
            duration: 60,
            orderIndex: 3,
            videoUrl: 'https://www.youtube.com/watch?v=example15',
            thumbnailUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
          },
          {
            title: 'Advanced Visualizations',
            content: 'Implement scatter plots, heatmaps, box plots, and multi-panel dashboards.',
            duration: 90,
            orderIndex: 4,
            videoUrl: 'https://www.youtube.com/watch?v=example16',
            thumbnailUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
          },
          {
            title: 'Interactive Plots with Plotly',
            content: 'Add interactivity: hover tooltips, zooming, dropdowns, sliders for dynamic visualizations.',
            duration: 75,
            orderIndex: 5,
            videoUrl: 'https://www.youtube.com/watch?v=example17',
            thumbnailUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
          },
        ],
      },
    },
  });
  console.log(`✅ Created: ${module4.title}`);

  // Module 5: Functions & Code Organization
  const module5 = await prisma.module.create({
    data: {
      title: 'Module 5: Functions & Code Organization',
      description: 'Learn to write clean, reusable code with functions, modules, and classes.',
      courseId: course.id,
      orderIndex: 5,
      lessons: {
        create: [
          {
            title: 'Understanding Functions',
            content: 'Master functions: definition, parameters, return values, scope. Turn repeated code into reusable functions.',
            duration: 60,
            orderIndex: 1,
            videoUrl: 'https://www.youtube.com/watch?v=example18',
            thumbnailUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
          },
          {
            title: 'Building Reusable Components',
            content: 'Create the utils.py helper library: importing custom functions, default parameters, error handling.',
            duration: 60,
            orderIndex: 2,
            videoUrl: 'https://www.youtube.com/watch?v=example19',
            thumbnailUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
          },
          {
            title: 'Classes & Objects (Optional)',
            content: 'Organize app state with classes: basic structure, methods, attributes, DataAnalyzer class.',
            duration: 60,
            orderIndex: 3,
            videoUrl: 'https://www.youtube.com/watch?v=example20',
            thumbnailUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
          },
          {
            title: 'Code Quality & Documentation',
            content: 'Professional Python: PEP 8, comments, docstrings, type hints, code formatting.',
            duration: 60,
            orderIndex: 4,
            videoUrl: 'https://www.youtube.com/watch?v=example21',
            thumbnailUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
          },
        ],
      },
    },
  });
  console.log(`✅ Created: ${module5.title}`);

  // Module 6: Building the Web Interface
  const module6 = await prisma.module.create({
    data: {
      title: 'Module 6: Building the Web Interface',
      description: 'Connect Python to the web with Flask: create API endpoints, handle file uploads, serve visualizations.',
      courseId: course.id,
      orderIndex: 6,
      lessons: {
        create: [
          {
            title: 'Web Basics for Python Developers',
            content: 'Understand HTTP, REST APIs, JSON, and how the browser talks to Python.',
            duration: 45,
            orderIndex: 1,
            videoUrl: 'https://www.youtube.com/watch?v=example22',
            thumbnailUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
          },
          {
            title: 'Flask Basics',
            content: 'Build the backend server: Flask structure, routes, request/response, templates.',
            duration: 90,
            orderIndex: 2,
            videoUrl: 'https://www.youtube.com/watch?v=example23',
            thumbnailUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
          },
          {
            title: 'File Upload Handling',
            content: 'Implement the upload feature: handle files, validate types, save securely, process CSVs.',
            duration: 75,
            orderIndex: 3,
            videoUrl: 'https://www.youtube.com/watch?v=example24',
            thumbnailUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
          },
          {
            title: 'API Endpoints for Data Analysis',
            content: 'Create all analysis endpoints: accept parameters, return JSON, handle errors.',
            duration: 90,
            orderIndex: 4,
            videoUrl: 'https://www.youtube.com/watch?v=example25',
            thumbnailUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
          },
          {
            title: 'Serving Plots to the Frontend',
            content: 'Send visualizations to browser: return images, base64 encoding, Plotly JSON, caching.',
            duration: 60,
            orderIndex: 5,
            videoUrl: 'https://www.youtube.com/watch?v=example26',
            thumbnailUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
          },
        ],
      },
    },
  });
  console.log(`✅ Created: ${module6.title}`);

  // Module 7: Database Integration
  const module7 = await prisma.module.create({
    data: {
      title: 'Module 7: Database Integration (Optional)',
      description: 'Add persistence with SQLite: store user data, query with SQL, integrate with pandas.',
      courseId: course.id,
      orderIndex: 7,
      lessons: {
        create: [
          {
            title: 'Why Databases?',
            content: 'Understand when to use databases vs files, SQL vs NoSQL, and plan your data model.',
            duration: 30,
            orderIndex: 1,
            videoUrl: 'https://www.youtube.com/watch?v=example27',
            thumbnailUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
          },
          {
            title: 'SQLite with Python',
            content: 'Add database persistence: connect, create tables, INSERT/SELECT/UPDATE/DELETE operations.',
            duration: 90,
            orderIndex: 2,
            videoUrl: 'https://www.youtube.com/watch?v=example28',
            thumbnailUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
          },
          {
            title: 'Using Pandas with SQL',
            content: 'Best of both worlds: pd.read_sql(), to_sql(), query optimization.',
            duration: 60,
            orderIndex: 3,
            videoUrl: 'https://www.youtube.com/watch?v=example29',
            thumbnailUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
          },
          {
            title: 'Data Modeling Best Practices',
            content: 'Design database schema: relationships, keys, normalization, migrations.',
            duration: 60,
            orderIndex: 4,
            videoUrl: 'https://www.youtube.com/watch?v=example30',
            thumbnailUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
          },
        ],
      },
    },
  });
  console.log(`✅ Created: ${module7.title}`);

  // Module 8: Advanced Features & Deployment
  const module8 = await prisma.module.create({
    data: {
      title: 'Module 8: Advanced Features & Deployment',
      description: 'Polish your app with error handling, optimization, security, and deploy it live to the internet.',
      courseId: course.id,
      orderIndex: 8,
      lessons: {
        create: [
          {
            title: 'Error Handling & Validation',
            content: 'Make the app bulletproof: try-except blocks, input validation, logging, user-friendly errors.',
            duration: 60,
            orderIndex: 1,
            videoUrl: 'https://www.youtube.com/watch?v=example31',
            thumbnailUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
          },
          {
            title: 'Performance Optimization',
            content: 'Handle large datasets: chunking files, caching results, async processing, profiling.',
            duration: 60,
            orderIndex: 2,
            videoUrl: 'https://www.youtube.com/watch?v=example32',
            thumbnailUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
          },
          {
            title: 'Security Basics',
            content: 'Protect your app: file upload security, input sanitization, environment variables, HTTPS.',
            duration: 45,
            orderIndex: 3,
            videoUrl: 'https://www.youtube.com/watch?v=example33',
            thumbnailUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
          },
          {
            title: 'Deployment to Production',
            content: 'Share your app with the world! Deploy to Heroku/Railway/Render with monitoring and logs.',
            duration: 75,
            orderIndex: 4,
            videoUrl: 'https://www.youtube.com/watch?v=example34',
            thumbnailUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
          },
        ],
      },
    },
  });
  console.log(`✅ Created: ${module8.title}`);

  console.log('\n🎉 Course creation complete!');
  console.log(`\n📊 Summary:`);
  console.log(`   • 8 modules created`);
  console.log(`   • 35 lessons total`);
  console.log(`   • ~50 hours of content`);
  console.log(`\n⚠️  Next steps:`);
  console.log(`   1. Update instructorId with actual admin user ID`);
  console.log(`   2. Replace video URLs with actual content links`);
  console.log(`   3. Add custom thumbnail images for each lesson`);
  console.log(`   4. Create and upload course syllabus PDF`);
  console.log(`   5. Set up assignments and quizzes for each module`);
  console.log(`\n🔗 View the course at: https://sagedlabs.com/courses/${course.id}`);
}

main()
  .catch((e) => {
    console.error('❌ Error creating course:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
