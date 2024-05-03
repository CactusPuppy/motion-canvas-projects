import {Circle, Layout, Line, makeScene2D, Node, Rect, Txt, Video } from '@motion-canvas/2d';
import {Color, PlaybackState, all, chain, createRef, createSignal, delay, easeInCubic, easeOutCubic, linear, loop, sequence, useDuration, usePlayback, useScene, waitFor, waitUntil} from '@motion-canvas/core';
import {Typewriter} from '../../../components/Typewriter';

import eichOverhead from "../../../../videos/eich_overhead.mp4";

export default makeScene2D(function* (view) {
  if (usePlayback().state !== PlaybackState.Rendering) {
    view.fill("#000000aa");
  }
  const ch02Title = createRef<Node>();
  const titleUnderlineWidth = createSignal(0);
  const titleSlide = createSignal(70);
  const titleScale = createSignal(1.95);
  const title = createRef<Node>();
  const subtitle = createRef<Node>();
  const numeralSeparation = createSignal(0);

  const titleSeparation = 35;

  view.add(<Node ref={ch02Title} scale={() => titleScale()}>
    <Node ref={title} y={-titleSeparation/2} cache>
      <Rect fill="white" width={1000} height={60} y={-10} />
      <Txt fill="white" fontFamily={"Config"} compositeOperation={"source-in"} y={() => titleSlide()}>"He Can't Get Us Up Here"</Txt>
    </Node>
    <Node y={titleSeparation/2} ref={subtitle}>
      <Node>
        <Line stroke="white" lineWidth={4} x={() => -numeralSeparation()} points={[
          [0, -12],
          [0, 12]
        ]} />
        <Line stroke="white" lineWidth={4} x={() => numeralSeparation()} points={[
          [0, -12],
          [0, 12]
        ]} />
      </Node>
      <Layout layout={false} cache>
        <Rect fill="white" width={75} height={1080} />
        <Line stroke="white" compositeOperation={"source-out"} lineWidth={4}>
          <Node x={() => -titleUnderlineWidth() / 2} y={0} />
          <Node x={() => titleUnderlineWidth() / 2} y={0} />
        </Line>
      </Layout>
    </Node>
  </Node>);

  yield titleUnderlineWidth(550, 0.5, easeOutCubic);
  yield chain(
    subtitle().findFirst<Node>((node) => node instanceof Node).opacity(0,0).to(1, 0.25),
    delay(0.45, numeralSeparation(6, 0.5, easeOutCubic)));
  yield delay(0.25, titleSlide(0, 0.5));

  const titleDuration = useDuration("titleFadeout");
  // yield titleScale(1.95, titleDuration, linear);
  ch02Title().shadowColor("black");
  ch02Title().shadowBlur(3);
  yield* waitFor(titleDuration);

  // yield titleScale(1.8, 1);
  yield titleSlide(70, 0.35);
  yield* titleUnderlineWidth(0, 0.5, easeInCubic);
  yield* subtitle().findFirst<Node>((node) => node instanceof Node).opacity(0, 0.3);

  yield* waitUntil("showEichOverhead");

  const eichOverheadVideo = createRef<Video>();
  const videoFrameHeight = createSignal(0.1);
  const videoFrameWidth = createSignal(0);
  const videoFinalScale = 0.75;
  view.add(<Rect width={videoFrameWidth} height={videoFrameHeight} radius={8} lineWidth={24} stroke={"white"} clip>
    <Video src={eichOverhead} ref={eichOverheadVideo} scale={videoFinalScale} zIndex={-1} loop={true} />
  </Rect>);
  eichOverheadVideo().video().volume = 0;
  eichOverheadVideo().play();
  yield* videoFrameWidth(useScene().getSize().x * videoFinalScale, 0.5, easeOutCubic);
  yield* videoFrameHeight(useScene().getSize().y * videoFinalScale, 0.5, easeOutCubic);

  yield* waitUntil("showAnalysis");
  const analysesParent = createRef<Node>();
  const lineDashOffset = createSignal(0);
  eichOverheadVideo().parent().add(<Node ref={analysesParent}>
    <Circle
      stroke={new Color("#e0b6c6").saturate(3)}
      lineWidth={6}
      width={50}
      height={90}
      x={315}
      y={-175}
      shadowColor={new Color("#e0b6c6").darken(3)}
      shadowBlur={4}
      rotation={-5} />
    <Typewriter
      fill={new Color("#e0b6c6")}
      fontSize={32}
      fontFamily={"Config"}
      right={() => [280, -175]}
      message={`Accessible only\nto supports`}
      textAlign={"right"}
      fixWidth={false}
      shadowColor={new Color("#e0b6c6").darken(3)}
      shadowBlur={4}
      zIndex={1} />
    <Line
      endArrow={true}
      arrowSize={10}
      stroke={new Color("red").desaturate()}
      shadowColor={new Color("red").darken(2)}
      shadowBlur={4}
      lineWidth={6}
      points={[
        [418, -331],
        [473, -86],
        [315, -70],
      ]}
      radius={16}
    />
    <Line
      endArrow={true}
      arrowSize={10}
      stroke={new Color("red").desaturate()}
      shadowColor={new Color("red").darken(2)}
      shadowBlur={4}
      lineWidth={6}
      points={[
        [-354, -6],
        [-186, -65],
        [-37, -65],
      ]}
      radius={16}
    />
    <Typewriter
      fill={new Color("red").desaturate()}
      fontSize={32}
      fontFamily={"Config"}
      middle={() => [136, -72]}
      message={`Extremely limited routes\nfor Reinhardt`}
      fixWidth={false}
      textAlign={"center"}
      shadowColor={new Color("red").darken(2)}
      shadowBlur={4}
      zIndex={1} />
    <Line
      endArrow={true}
      arrowSize={10}
      stroke={new Color("lime").desaturate()}
      shadowColor={new Color("green").darken(2)}
      shadowBlur={4}
      lineWidth={6}
      points={[
        [248, 251],
        [286, 70],
        [255, 9],
      ]}
      radius={16}
      lineDash={[10, 10]}
      lineDashOffset={() => lineDashOffset()}
    />
    <Line
      endArrow={true}
      arrowSize={10}
      stroke={new Color("lime").desaturate()}
      shadowColor={new Color("green").darken(2)}
      shadowBlur={4}
      lineWidth={6}
      points={[
        [-131, -127],
        [-153, -229],
        [-218, -200],
      ]}
      radius={16}
      lineDash={[10, 10]}
      lineDashOffset={() => lineDashOffset()}
    />
    <Typewriter
      fill={new Color("lime").desaturate()}
      fontSize={32}
      fontFamily={"Config"}
      middle={() => [63, 130]}
      message={`Petal platform shortcuts\n(inaccessible to Reinhardt)`}
      fixWidth={false}
      textAlign={"center"}
      shadowColor={new Color("green").darken(2)}
      shadowBlur={4}
      zIndex={1}
    />
  </Node>);

  yield loop(Infinity, function* () { yield* lineDashOffset(lineDashOffset() - 60, 3, linear); });
  analysesParent().findAll<Circle>(node => node instanceof Circle).forEach(circle => {
    circle.startAngle(-90)
    circle.endAngle(-90)
  });
  analysesParent().findAll<Line>(node => node instanceof Line).forEach(line => {
    line.end(0);
  });
  yield sequence(
    0.15,
    ...analysesParent().findAll<Circle>(node => node instanceof Circle).map(circle => circle.endAngle(270, 0.5))
  );
  yield sequence(
    0.15,
    ...analysesParent().findAll<Line>(node => node instanceof Line).map(line => line.end(1, 0.5))
  );
  yield sequence(
    0.15,
    ...analysesParent().findAll<Typewriter>((node) => node instanceof Typewriter).map((msg) => msg.typewrite(0.5))
  );

  yield* waitUntil("endScene");
  yield* all(
    eichOverheadVideo().parent().opacity(0, 0.75),
    eichOverheadVideo().parent().scale(0.7, 0.75, easeInCubic),
    eichOverheadVideo().parent().filters.blur(20, 0.75)
  );
  eichOverheadVideo().remove();
});
