export interface IVideo {
  url: string;
  uuid: string;
  format: string;
  state: string;
  duration: number;
}

export interface IIntake {
  fitness_goal?: string[];
  gender?: string;
  age_group?: string;
  injury_conscious?: string[];
}

export interface IInstructor {
  uuid: string;
  first_name: string;
  last_name: string;
  title: string;
  bio: string;
  image_url: string;
  video_url: string;
  archived: boolean;
}

export interface IFullInstructor extends IInstructor {
  instagram_url: string;
  facebook_url: string;
  youtube_url: string;
  user_uuid: string;
  bio: string;
  active: boolean;
}

export interface IEquipment {
  name: string;
}

export interface IExercise {
  compatible_equipment: string[];
  tags: string[];
  images: string[];
  name: string;
  muscles: string[];
  muscle_group: string;
  train_status: string;
  session_status: string;
  equipment_group: string;
  info: string;
  uuid: string;
  attachment: string;
}

export interface ISummarySet {
  equipment: IEquipment;
  exercise: IExercise;
  time: number[];
}

export interface ISetGroup {
  time_cap: number;
  repeat: string;
  name: string;
  summary_sets: ISummarySet[];
}

export interface ISessionGroup {
  category: string;
  duration_weeks: number;
  name: string;
  equipment: string[];
  type: string;
  ordinal: number;
  style: string;
  level: string;
  updated_at: string;
  group_type: 'program' | 'series';
  status: string;
  info: string;
  total_sessions: number;
  uuid: string;
  weekly_structure?: string;
  created_at: string;
}

export interface IWorkout {
  category: string;
  video: IVideo;
  is_complete: boolean;
  music: string[];
  accessories: string[];
  name: string;
  thumbnail_url: string;
  recording_status: string;
  start_time: string;
  equipment: string[];
  muscles: string[];
  type: string;
  equipment_groups: string[];
  muscle_group: string;
  style: string;
  level: string;
  updated_at: string;
  intake?: IIntake;
  status: string;
  session_groups?: ISessionGroup[];
  instructors: IInstructor[];
  info: string;
  live: false;
  uuid: string;
  room: boolean;
  is_favorited: boolean;
  publish_date: string;
  vod_status: string;
  created_at: string;
  free_weights: string[];
  summary_set_groups: ISetGroup[];
  expected_duration: number;
  tags?: string[];
}

export interface IWorkoutMetadata {
  type: string;
  image: string;
  description: string;
  styles: {
    name: string;
    description: string;
    fitness_goals: string[];
  }[];
}

export interface IMetadata {
  'Cross Train': IWorkoutMetadata[];
  category: string[];
  fusion_cardio_equipment_group: string[];
  accessory: {
    Cardio: string[];
    Strength: string[];
    Fusion: string[];
    'Cross Train': string[];
    Yoga: string[];
    Challenges: string[];
  };
  tags: {
    Cardio: string[];
    Strength: string[];
    Fusion: string[];
    Yoga: string[];
    'Cross Train': string[];
    Challenges: string[];
  };
  fitness_level: string[];
  music: string[];
  injury_conscious_mapping: {
    'Shoulder Pain': string;
    'Neck Pain': string;
    'Hip Pain': string;
    'Knee Pain': string;
    'Back Pain': string;
  };
  default_thumbnail_url: {
    session: string;
  };
  publish_status: string[];
  free_weight: string[];
  Yoga: {
    type: string;
    image: string;
    description: string;
    styles: {
      name: string;
      description: string;
      fitness_goals: string[];
    }[];
  }[];
  completed_on: string[];
  equipment: {
    name: string;
    info: string;
    images: {
      product: string;
      callout: string;
    };
    equipment_groups: string[];
  }[];
  muscle: {
    primary: {
      name: string;
      url: string;
    }[];
    secondary: {
      name: string;
      url: string;
    }[];
  };
  muscle_group: {
    type: string;
    default: string;
    values: string[];
  }[];
  age_group: string[];
  injury_conscious: string[];
  strength_workout_structure: string[];
  studio: number[];
  fusion_strength_equipment_group: string[];
  user_notification: {
    types: string[];
    spotlight_challenge: {content_keys: string[]};
    spotlight_modal: {content_keys: string[]};
  };
  equipment_group: {
    name: string;
    info: string;
    images: {
      product: string;
    };
    inspire_fitness_equipment: string[];
    inspire_fitness_equipment_string: string;
    inspire_fitness_equipment_note: string;
    general_equipment: string;
  }[];
  fitness_goal: string[];
  Fusion: IWorkoutMetadata[];
  Strength: IWorkoutMetadata[];
  gender: string[];
  Cardio: IWorkoutMetadata[];
  vod_status: string[];
  fusion_equipment_group_combo: {
    name: string;
    image: string;
    info: string;
    equipment_groups: string[];
  }[];
}
