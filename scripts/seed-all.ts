import { execSync } from 'child_process';

const steps = [
  'scripts/seed.ts',
  'scripts/seed-stage-courses.ts',
  'scripts/seed-young-sages-course.ts',
  'scripts/seed-blocks-lessons.ts',
];

function run(script: string) {
  console.log(`\n▶ Running ${script}...`);
  execSync(`tsx --require dotenv/config ${script}`, { stdio: 'inherit' });
  console.log(`✓ Completed ${script}`);
}

async function main() {
  console.log('🌱 Starting full database seed pipeline...');
  for (const step of steps) {
    run(step);
  }
  console.log('\n🎉 Full database seed pipeline completed.');
}

main().catch((error) => {
  console.error('❌ Full seed pipeline failed:', error);
  process.exit(1);
});
