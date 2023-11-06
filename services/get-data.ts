import fs from 'fs';
import fsExtra from 'fs-extra';
import path from 'path';

import {IFullInstructor, IMetadata, IWorkout} from './interfaces';
import {configPath} from './config';
import {getInstructorsData, getMetadataInfo, getWorkoutData} from './api';

const WORKOUTS = path.join(configPath, 'workouts.json');
const METADATA = path.join(configPath, 'metadata.json');
const INSTRUCTORS = path.join(configPath, 'instructors.json');

export const getWorkouts = async (): Promise<IWorkout[]> => {
  if (!fs.existsSync(WORKOUTS)) {
    const workouts = await getWorkoutData();

    fsExtra.writeJSONSync(WORKOUTS, workouts, {spaces: 2});

    return workouts;
  }

  const workouts: IWorkout[] = fsExtra.readJSONSync(WORKOUTS);

  return workouts;
};

export const getMetadata = async (): Promise<IMetadata> => {
  if (!fs.existsSync(METADATA)) {
    const metadata = await getMetadataInfo();

    fsExtra.writeJSONSync(METADATA, metadata, {spaces: 2});

    return metadata;
  }

  const metadata: IMetadata = fsExtra.readJSONSync(METADATA);

  return metadata;
};

export const getInstructors = async (): Promise<IFullInstructor[]> => {
  if (!fs.existsSync(INSTRUCTORS)) {
    const instructors = await getInstructorsData();

    fsExtra.writeJSONSync(INSTRUCTORS, instructors, {spaces: 2});

    return instructors;
  }

  const instructors: IFullInstructor[] = fsExtra.readJSONSync(INSTRUCTORS);

  return instructors;
};
