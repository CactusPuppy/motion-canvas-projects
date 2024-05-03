import {defineConfig} from 'vite';
import motionCanvas from '@motion-canvas/vite-plugin';
import ffmpeg from '@motion-canvas/ffmpeg';

export default defineConfig({
  plugins: [
    motionCanvas({
      output: "./output",
      project: ["./src/projects/group-respawn/project.ts", "./src/projects/group-respawn/outro.ts", "./src/projects/group-respawn/thumbnail.ts", "./src/projects/demon-lord/*.ts"]
    }),
    ffmpeg()
  ],
});
