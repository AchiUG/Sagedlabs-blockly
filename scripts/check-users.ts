import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  console.log('Fetching all users...\n');
  
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: 'asc'
    }
  });

  console.log(`Found ${users.length} users:\n`);
  
  users.forEach(user => {
    console.log(`ID: ${user.id}`);
    console.log(`Email: ${user.email}`);
    console.log(`Name: ${user.name}`);
    console.log(`Role: ${user.role}`);
    console.log(`Created: ${user.createdAt}`);
    console.log('---\n');
  });

  // Also check for the Python course
  const pythonCourse = await prisma.course.findFirst({
    where: {
      title: {
        contains: 'Python Fundamentals'
      }
    },
    select: {
      id: true,
      title: true,
    }
  });

  if (pythonCourse) {
    console.log(`\nPython Course Found:`);
    console.log(`ID: ${pythonCourse.id}`);
    console.log(`Title: ${pythonCourse.title}`);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
