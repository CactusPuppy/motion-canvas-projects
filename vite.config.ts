import {defineConfig} from 'vite';
import motionCanvas from '@motion-canvas/vite-plugin';
import ffmpeg from '@motion-canvas/ffmpeg';

export default defineConfig({
  plugins: [
    motionCanvas({
      output: "./output",
      project: ["./src/project.ts", "./src/outro.ts", "./src/thumbnail.ts"]
    }),
    ffmpeg(),
  ],
});
