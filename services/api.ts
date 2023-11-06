import axios from 'axios';
import url from 'url';
import _ from 'lodash';

import {IFullInstructor, IMetadata, IWorkout} from './interfaces';

const USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36';

const USERNAME = process.env.EMAIL;
const PASSWORD = process.env.PASSWORD;

const inspireApi = axios.create({
  baseURL: 'https://fitness.inspirefitness.com/',
  timeout: 120 * 1000,
  withCredentials: true,
});

let cookies = '';

export const authenticate = async (): Promise<void> => {
  try {
    console.log('Logging in...');

    const {headers} = await inspireApi.post(
      'auth/authenticate',
      {},
      {
        headers: {
          Accept: 'application/json, text/plain, */*',
          Authorization: `secret ${PASSWORD}`,
          'User-Agent': USER_AGENT,
          email: USERNAME,
        },
      },
    );

    if (headers['set-cookie']) {
      const allCookies = [];

      _.forEach(headers['set-cookie'] || [], c => {
        const splitCookie = c.split(';');

        _.forEach(splitCookie, d => {
          if (d.startsWith('x-user=') || d.startsWith('x-token=')) {
            allCookies.push(d);
          }
        });
      });

      cookies = allCookies.join(';');
    }
  } catch (e) {
    console.error(e);
    console.log('Could not authenticate');
  }
};

export const getMetadataInfo = async (): Promise<IMetadata> => {
  try {
    if (!cookies.length) {
      await authenticate();
    }

    console.log('Getting metadata');

    const {data} = await inspireApi.get<IMetadata>('v2/metadata', {
      headers: {
        Cookie: cookies,
        'User-Agent': USER_AGENT,
      },
    });

    return data;
  } catch (e) {
    console.error(e);
    console.log('Could not get instructors');
  }
};

export const getInstructorsData = async (): Promise<IFullInstructor[]> => {
  try {
    if (!cookies.length) {
      await authenticate();
    }

    console.log('Getting instructors');

    const {data} = await inspireApi.get<IFullInstructor[]>('instructors?archived=false', {
      headers: {
        Cookie: cookies,
        'User-Agent': USER_AGENT,
      },
    });

    return data;
  } catch (e) {
    console.error(e);
    console.log('Could not get instructors');
  }
};

export const getWorkoutData = async (): Promise<IWorkout[]> => {
  try {
    if (!cookies.length) {
      await authenticate();
    }

    console.log('Getting workouts');

    const params = new url.URLSearchParams({
      is_published: 'true',
      limit: '10000',
      page: '0',
      session_statuses: 'Accessible',
      vod_statuses: 'Approved',
    }).toString();

    const {data} = await inspireApi.get<IWorkout[]>(`session?${params}`, {
      headers: {
        Cookie: cookies,
        'User-Agent': USER_AGENT,
      },
    });

    return data;
  } catch (e) {
    console.error(e);
    console.log('Could not get workouts');
  }
};
