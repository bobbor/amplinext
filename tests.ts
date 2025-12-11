import { spec } from 'node:test/reporters'
import { run } from 'node:test';

let watch = false;
process.argv.slice(2).forEach(argv => {
  if(argv === '--watch') {
    watch = true;
  }
});

run({
  concurrency: true,
  globPatterns: ["./src/**/*.test.ts"],
  watch,
  only: true
}).compose(spec).pipe(process.stdout)