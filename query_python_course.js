const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const course = await prisma.course.findFirst({
    where: {
      title: {
        contains: 'Python Fundamentals'
      }
    },
    select: {
      id: true,
      title: true
    }
  });
  
  if (course) {
    console.log('Course found:');
    console.log('ID:', course.id);
    console.log('Title:', course.title);
    console.log('\nCourse URLs:');
    console.log('Public URL: https://sagedlabs.com/courses/' + course.id);
    console.log('Admin Edit URL: https://sagedlabs.com/admin/courses/' + course.id);
  } else {
    console.log('Python Fundamentals course not found');
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
