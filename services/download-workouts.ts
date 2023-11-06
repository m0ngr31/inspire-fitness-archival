import path from 'path';
import fs from 'fs';
import YTDlpWrap from 'yt-dlp-wrap';
import async from 'async';
import moment from 'moment';

import fsExtra from 'fs-extra';

import {IWorkout} from './interfaces';
import {videoPath} from './config';

const conurrency = Number.isFinite(+process.env.CONCURRENCY) ? +process.env.CONCURRENCY : 4;

const ytDlpWrap = new YTDlpWrap();

const createFileName = (workout: IWorkout, parentDir: string): string[] => {
  let currentDir = parentDir;

  if (
    workout.session_groups?.[0] &&
    workout.session_groups[0].name &&
    workout.session_groups[0].group_type === 'program'
  ) {
    currentDir = path.join(currentDir, workout.session_groups[0].name);
  }

  const instructor = `${workout.instructors[0].first_name} ${workout.instructors[0].last_name}`;

  let fileName = `${workout.name} (${workout.type} - ${workout.style})`;

  if (workout.equipment[0]) {
    fileName = `${fileName} (${workout.equipment[0]})`;
  } else {
    if (workout.equipment_groups.length === 1) {
      fileName = `${fileName} (${workout.equipment_groups[0]})`;
    } else if (workout.equipment_groups.length === 2) {
      fileName = `${fileName} (${workout.equipment_groups[0]} + ${workout.equipment_groups[1]})`;
    } else {
      fileName = `${fileName} (${workout.equipment_groups.join(', ')})`;
    }
  }

  return [
    `${fileName} - ${instructor} - ${moment(workout.start_time).format('MM-DD-YYYY')}`
      .replace(/\//, '+')
      .replace(/:/g, ' - ')
      .replace(/  /g, ' '),
    currentDir,
  ];
};

const downloadVideo = async (workout: IWorkout): Promise<void> => {
  const workoutDir = path.join(videoPath, workout.category);
  const [fileName, dir] = createFileName(workout, workoutDir);

  if (!fs.existsSync(workoutDir)) {
    fs.mkdirSync(workoutDir);
  }

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }

  if (!fs.existsSync(path.join(dir, `${fileName}.json`))) {
    fsExtra.writeJSONSync(path.join(dir, `${fileName}.json`), workout as any, {spaces: 2});
  }

  if (fs.existsSync(path.join(dir, `${fileName}.mp4`))) {
    console.log('Skipping: ', `${fileName}.mp4`);
    return;
  }

  console.log('Downloading: ', `${fileName}.mp4`);

  return new Promise((resolve, reject) => {
    ytDlpWrap
      .exec([workout.video.url, '-o', path.join(dir, `${fileName}.mp4`)])
      .on('error', e => {
        console.log('Error downloading: ', `${fileName}.mp4`);
        reject(e);
      })
      .on('close', () => {
        console.log('Finished: ', `${fileName}.mp4`);
        resolve();
      });
  });
};

export const downloadWorkouts = async (workouts: IWorkout[]): Promise<void> => {
  if (!workouts || !workouts.length) {
    console.log('Nothing to download!');
  }

  console.log(`Found ${workouts.length} matching workouts`);

  const jobQueue = async.queue(async (w: IWorkout, callback) => {
    try {
      await downloadVideo(w);
    } catch (e) {}
    callback();
  }, conurrency);

  workouts.forEach(w => jobQueue.push(w));

  return new Promise(resolve => {
    jobQueue.drain = () => {
      console.log('Downloads complete');
      resolve();
    };
  });
};
