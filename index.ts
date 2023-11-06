import {initDirectories} from './services/init-directories';

import {version} from './package.json';
import {filterWorkouts} from './services/filter-workouts';
import {downloadWorkouts} from './services/download-workouts';

const dryRun = process.env.DRY_RUN?.toLowerCase() === 'true' ? true : false;

(async () => {
  console.log(`=== Inspire Fitness Archival v${version} ===`);
  initDirectories();

  const workouts = await filterWorkouts();

  if (!dryRun) {
    await downloadWorkouts(workouts);
  } else {
    console.log(`Would download ${workouts.length} workouts`);
  }
})();
