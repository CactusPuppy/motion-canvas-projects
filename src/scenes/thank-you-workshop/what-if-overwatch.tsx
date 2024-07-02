import { Circle, makeScene2D } from '@motion-canvas/2d';
import { PlaybackState, createRef, useLogger, usePlayback, useRandom, waitFor, waitUntil } from '@motion-canvas/core';

import TextScramble from '../../components/TextScrambler';
import ideas_list from "./ideas.json?raw";

interface Idea {
  description: string,
  author: string,
  title: string,
  code: string
}

export default makeScene2D(function* (view) {
  if (usePlayback().state !== PlaybackState.Rendering) {
    view.fill("#000000aa");
  }

  const ideas = JSON.parse(ideas_list) as Idea[];

  const completionRef = createRef<TextScramble>();
  view.add(<TextScramble fill={"white"} fontFamily={"Config"} ref={completionRef} textWrap={true} maxWidth={"100%"} />);
  completionRef().setObfuscationChars("0123456789!<>-_\\/[]{}—=+*^?#()");
  completionRef().characterRerollProbability(1);



  for (let i = 0; i < ideas.length; ++i) {
    yield completionRef().updateText(ideas[i].description, i == 0 ? 0.25 : 0.07, 0.125);
    yield* waitFor(0.5);
  }
  yield* completionRef().updateText("", 0.1, 0.25);
});
