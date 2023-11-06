import _ from 'lodash';

import {getInstructors, getMetadata, getWorkouts} from './get-data';
import {IFullInstructor, IMetadata, IWorkout} from './interfaces';

const minimum = Number.isFinite(+process.env.MIN_MINUTES) ? +process.env.MIN_MINUTES * 60 : 0;
const maximum = Number.isFinite(+process.env.MAX_MINUTES) ? +process.env.MAX_MINUTES * 60 : 120 * 60; // 2 hours

const favorites = process.env.FAVORITES?.toLowerCase() === 'true' ? true : false;
const popular = process.env.POPULAR?.toLowerCase() === 'true' ? true : false;
const inProgram = process.env.IN_PROGRAM?.toLowerCase() === 'true' ? true : false;

const generateEquipment = (metadata: IMetadata): string[] => {
  const ownedEquipment = (process.env.EQUIPMENT || '')
    .split(',')
    .filter(e => e.length)
    .map(e => e.trim());

  const equipment: string[] = [];

  metadata.equipment_group.forEach(e => {
    if (e.name === 'Functional Trainer' || e.name === 'Multi Gym') {
      e.inspire_fitness_equipment.forEach(f => equipment.push(f));
    }

    if (e.name !== 'Yoga') {
      equipment.push(e.name);
    }
  });

  return equipment.filter(e => ownedEquipment.filter(oe => oe.toLowerCase() === e.toLowerCase()).length);
};

const generateInstructors = async (): Promise<IFullInstructor[]> => {
  const instructors = await getInstructors();
  const desiredInstructors = (process.env.INSTRUCTORS || '')
    .split(',')
    .filter(i => i.length)
    .map(i => i.trim().toLowerCase());

  return instructors.filter(i => desiredInstructors.includes(`${i.first_name} ${i.last_name}`.toLowerCase()));
};

const generateFusionEquipment = (metadata: IMetadata): string[][] => {
  const equipment: string[] = metadata.equipment_group.map(e => e.name);

  const fusionEquipment = (process.env.FUSION || '')
    .split(',')
    .filter(e => e.length)
    .map(e => e.trim());

  const fusion: string[][] = [];

  fusionEquipment.forEach(e => {
    const split = e
      .split('+')
      .filter(f => f.length)
      .map(f => f.trim());
    const realEquipment = equipment.filter(e => split.filter(s => s.toLowerCase() === e.toLowerCase()).length);

    if (realEquipment.length === 2) {
      fusion.push(realEquipment);
    }
  });

  return fusion;
};

const generateMusic = (metadata: IMetadata): string[] => {
  const wantedMusic = (process.env.MUSIC || '')
    .split(',')
    .filter(m => m.length)
    .map(m => m.trim());

  return metadata.music.filter(m => wantedMusic.filter(wm => wm.toLowerCase() === m.toLowerCase()).length);
};

const generatePrograms = (): string[] =>
  (process.env.PROGRAMS || '')
    .split(',')
    .filter(p => p.length)
    .map(p => p.trim());

const generateCategories = (metadata: IMetadata): string[] => {
  const wantedCategories = (process.env.CATEGORIES || '')
    .split(',')
    .filter(c => c.length)
    .map(c => c.trim());

  return metadata.category.filter(
    c => wantedCategories.filter(wc => wc.toLowerCase() === c.toLowerCase()).length && c !== 'Challenges',
  );
};

const generateInjuries = (metadata: IMetadata): string[] => {
  const injuries = (process.env.INJURIES || '')
    .split(',')
    .filter(i => i.length)
    .map(i => i.trim());

  return metadata.injury_conscious.filter(
    i =>
      injuries.filter(ij => ij.toLowerCase() === i.toLowerCase() || `${ij} pain`.toLowerCase() === i.toLowerCase())
        .length,
  );
};

const generateGoals = (metadata: IMetadata): string[] => {
  const goals = (process.env.GOALS || '')
    .split(',')
    .filter(g => g.length)
    .map(g => g.trim());

  return metadata.fitness_goal.filter(f => goals.filter(fg => fg.toLowerCase() === f.toLowerCase()).length);
};

const generateMuscleGroups = (): string[] => {
  const muscleGroups = (process.env.MUSCLE_GROUPS || '')
    .split(',')
    .filter(m => m.length)
    .map(m => m.trim());

  return ['Full', 'Upper', 'Lower'].filter(m => muscleGroups.filter(mg => mg.toLowerCase() === m.toLowerCase()).length);
};

export const filterWorkouts = async (): Promise<IWorkout[]> => {
  const metadata = await getMetadata();

  if (minimum > 0) {
    console.log(`Filtering with a minimum time of ${Math.round(minimum / 60)} minutes`);
  }

  if (maximum < 120 * 60) {
    console.log(`Filtering with a maximum time of ${Math.round(maximum / 60)} minutes`);
  }

  const equipment = generateEquipment(metadata);
  const fusionEquipment = generateFusionEquipment(metadata);

  if (equipment.length && fusionEquipment.length) {
    console.log(`Can't filter both equipment and Fusion equipment`);
    return [];
  }

  if (equipment.length) {
    console.log('Filtering equipment with: ', equipment.join(', '));
  }

  if (fusionEquipment.length) {
    console.log('Filtering Fusion workouts with: ', fusionEquipment.join(' :: '));
  }

  const instructors = await generateInstructors();
  if (instructors.length) {
    console.log('Filtering instructors with: ', instructors.map(i => `${i.first_name} ${i.last_name}`).join(', '));
  }

  const music = await generateMusic(metadata);
  if (music.length) {
    console.log('Filtering music with: ', music.join(', '));
  }

  if (popular) {
    console.log('Filtering with "popular" tag (only Cardio and Fusion)');
  }

  const wantedPrograms = generatePrograms();

  if (wantedPrograms.length && inProgram) {
    console.log(`Can't filter both PROGRAMS and IN_PROGRAM`);
    return [];
  }

  if (wantedPrograms.length) {
    console.log('Filtering programs with: ', wantedPrograms.join(', '));
  }

  if (inProgram) {
    console.log('Filtering workouts that are part of a program');
  }

  const categories = generateCategories(metadata);
  if (categories.length) {
    console.log('Filtering categories with: ', categories.join(', '));
  }

  const injuries = generateInjuries(metadata);
  if (injuries.length) {
    console.log('Filtering injury conscious with: ', injuries.join(', '));
  }

  const goals = generateGoals(metadata);
  if (goals.length) {
    console.log('Filtering goals with: ', goals.join(', '));
  }

  const muscleGroups = generateMuscleGroups();
  if (muscleGroups.length) {
    console.log('Filtering muscle groups with: ', muscleGroups.join(', '));
  }

  const workouts = await getWorkouts();
  console.log('Total workouts: ', workouts.length);

  return workouts.filter(workout => {
    if (favorites && !workout.is_favorited) {
      return false;
    }

    if (workout.expected_duration < minimum || workout.expected_duration > maximum) {
      return false;
    }

    if (instructors.length && !workout.instructors.filter(i => instructors.find(j => j.uuid === i.uuid)).length) {
      return false;
    }

    if (
      equipment.length &&
      !_.intersectionWith(workout.equipment_groups, equipment).length &&
      !_.intersectionWith(workout.equipment, equipment).length
    ) {
      return false;
    }

    if (fusionEquipment.length && workout.category !== 'Fusion') {
      return false;
    }

    if (
      fusionEquipment.length &&
      !fusionEquipment.filter(f => _.intersectionWith(f, workout.equipment_groups).length === 2).length
    ) {
      return false;
    }

    if (music.length && !_.intersectionWith(music, workout.music).length) {
      return false;
    }

    if (popular && !(workout.tags || []).filter(t => t === 'Popular').length) {
      return false;
    }

    if (
      (inProgram || wantedPrograms.length) &&
      (!workout.session_groups || !workout.session_groups.length || workout.session_groups[0].group_type !== 'program')
    ) {
      return false;
    }

    if (
      wantedPrograms.length &&
      !wantedPrograms.filter(wp => wp.toLowerCase() === (workout.session_groups?.[0].name || 'zzz').toLowerCase())
        .length
    ) {
      return false;
    }

    if (categories.length && !categories.includes(workout.category)) {
      return false;
    }

    if (
      injuries.length &&
      !(workout.intake?.injury_conscious || []).filter(i => injuries.find(ic => ic === i)).length
    ) {
      return false;
    }

    if (goals.length && !(workout.intake?.fitness_goal || []).filter(fg => goals.find(g => g === fg)).length) {
      return false;
    }

    if (muscleGroups.length && !muscleGroups.includes(workout.muscle_group)) {
      return false;
    }

    return true;
  });
};
