import fs from 'fs';
// import fsExtra from 'fs-extra';
// import {globSync} from 'glob';

import {configPath, videoPath} from './config';

export const initDirectories = (): void => {
  if (!fs.existsSync(configPath)) {
    fs.mkdirSync(configPath);
  }

  if (!fs.existsSync(videoPath)) {
    fs.mkdirSync(videoPath);
  }

  // const partialFiles = globSync(`${videoPath}/**/*.mp4.*`);
  // partialFiles.forEach(f => fsExtra.removeSync(f));
};
