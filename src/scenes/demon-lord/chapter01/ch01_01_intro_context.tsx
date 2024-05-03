import {Circle, Line, Rect, makeScene2D} from '@motion-canvas/2d';
import {clamp, createRef, loop, makeRef, range, useLogger, waitFor, waitUntil} from '@motion-canvas/core';
import { usePlayback } from '@motion-canvas/core';

import intro_context_audio from "../../../../audio/demon-lord/intro_context_final_VO_001.wav";

export default makeScene2D(function* (view) {
  const audioCtx = new AudioContext();
  const analyzer = audioCtx.createAnalyser();

  const response = yield fetch(intro_context_audio);
  const buffer = yield audioCtx.decodeAudioData(yield response.arrayBuffer());
  const source = audioCtx.createBufferSource();
  source.buffer = buffer;
  source.connect(analyzer);

  analyzer.fftSize = 2048;
  const bufferLength = analyzer.frequencyBinCount;
  const dataArray = new Float32Array(bufferLength);

  const bars : Line[] = [];
  const startLine = createRef<Line>();
  const width = 1200;
  const height = 800;
  view.add(<>
    {/* <Line ref={startLine} points={() => [[-width / 2 - width / bufferLength, 0], [-width / 2, dataArray[0] * height / 2]]} stroke="white" lineWidth={4} /> */}
    {range(bufferLength + 1)
      .map(i => <Line ref={makeRef(bars, i)} points={() => [
        [-width / 2 + width / bufferLength * i, dataArray[i] * height / 2],
        [-width / 2 + width / bufferLength * (i + 1), dataArray[i + 1] * height / 2]
      ]} stroke="white" lineWidth={4} />)
    }
  </>);
  yield loop(Infinity, function* () {
    const logger = useLogger();
    analyzer.getFloatTimeDomainData(dataArray);

    // logger.info(dataArray[0].toString());
    // startLine().points([[-width / 2 - width / bufferLength, 0], [-width / 2, dataArray[0] * height / 2]]);
    for (let i = 0; i < bufferLength; i++) {
      yield bars[i].points([
        [-width / 2 + width / bufferLength * i, dataArray[i] * height / 2],
        [-width / 2 + width / bufferLength * (i + 1), dataArray[i + 1] * height / 2]
      ]);
    }
    yield* waitFor(0.01);
  });
  yield source.start(0, 0);

  // yield* waitFor(10);
  yield* waitUntil("endScene");
});
