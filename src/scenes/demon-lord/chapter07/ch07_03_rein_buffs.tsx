import {Circle, Layout, Line, Rect, Txt, makeScene2D, Node, Video} from '@motion-canvas/2d';
import {Direction, PlaybackState, all, chain, createRef, createSignal, delay, easeInCubic, easeOutCubic, linear, loop, useDuration, useLogger, usePlayback, useScene, waitFor, waitUntil} from '@motion-canvas/core';

import gdc_push_forward_talk from "../../../../videos/GDC_push_forward_combat.webm";
import { slideFadeOut } from '../../../utils/slideFades';

export default makeScene2D(function* (view) {
  const logger = useLogger();

  if (usePlayback().state !== PlaybackState.Rendering) {
    view.fill("#000000aa");
  }
  const ch03Title = createRef<Node>();
  const titleUnderlineWidth = createSignal(0);
  const titleSlide = createSignal(70);
  const titleScale = createSignal(1.9);
  const title = createRef<Node>();
  const subtitle = createRef<Node>();
  const numeralSeparation = createSignal(0);

  const titleSeparation = 35;

  view.add(<Node ref={ch03Title} scale={() => titleScale()}>
    <Node ref={title} y={-titleSeparation/2} cache>
      <Rect fill="white" width={1000} height={60} y={-10} />
      <Txt fill="white" fontFamily={"Config"} compositeOperation={"source-in"} y={() => titleSlide()}>Please Hold W</Txt>
    </Node>
    <Node y={titleSeparation/2} ref={subtitle}>
      <Node>
        <Line stroke="white" lineWidth={4} x={() => -numeralSeparation()} points={[
          [0, -12],
          [0, 12]
        ]} />
        <Line stroke="white" lineWidth={4} points={[
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

  yield titleUnderlineWidth(350, 0.5, easeOutCubic);
  yield chain(
    subtitle().findFirst<Node>((node) => node instanceof Node).opacity(0,0).to(1, 0.25),
    delay(0.45, numeralSeparation(8, 0.5, easeOutCubic)));
  yield delay(0.25, titleSlide(0, 0.5));

  const titleDuration = useDuration("titleFadeout");
  ch03Title().shadowColor("black");
  ch03Title().shadowBlur(3);
  // yield titleScale(1.95, titleDuration, linear);
  yield* waitFor(titleDuration);

  yield titleScale(1.8, 1);
  yield titleSlide(70, 0.35);
  yield* titleUnderlineWidth(0, 0.5, easeInCubic);
  yield* subtitle().findFirst<Node>((node) => node instanceof Node).opacity(0, 0.3);

  yield* waitUntil("showGDCTalk");
  const gdcTalkVideo = createRef<Video>();
  const gdcTalkCaption = createRef<Txt>();
  const videoFrameHeight = createSignal(0.1);
  const videoFrameWidth = createSignal(0);
  const videoFinalScale = 0.65;
  view.add(<>
    <Rect width={videoFrameWidth} height={videoFrameHeight} radius={8} lineWidth={24} stroke={"white"} clip>
      <Video ref={gdcTalkVideo} src={gdc_push_forward_talk} loop={false} scale={1} />
    </Rect>
    <Txt ref={gdcTalkCaption} opacity={0} fill={"white"} fontFamily={"Config"} fontSize={24} topLeft={() => gdcTalkVideo().parent().bottomLeft().addY(15)}>
      "Embracing Push Forward Combat in DOOM"
      <Txt> - GDC (YouTube)</Txt>
    </Txt>
  </>);
  gdcTalkVideo().seek(16);
  gdcTalkVideo().video().volume = 0;
  gdcTalkVideo().play();
  yield* videoFrameWidth(useScene().getSize().x * videoFinalScale, 0.5, easeOutCubic);
  yield delay(0.3, gdcTalkCaption().opacity(1, 0.25));
  yield* videoFrameHeight(useScene().getSize().y * videoFinalScale, 0.5, easeOutCubic);

  yield* waitUntil("showSidenote");
  const sidenote = createRef<Txt>();

  view.add(<Layout height={300}>
    <Txt ref={sidenote} opacity={0} fill={"white"} fontFamily={"Industry"} fontSize={20} maxWidth={500} textWrap={"pre"} zIndex={-1} x={600}>
      <Txt.b fontFamily={"Config"} fontSize={26}>SIDENOTE:</Txt.b>
      <Txt textWrap={true}>{`I don't cover it in enough detail in this brief voiceover, but since you paused to read\nthis gigantic block of text, I'll assume you're interested in more details. Incentivizing\nthe Reinhardt to engage by rewarding close-quarters combat with health is\ntheoretically a good way to achieve one of my stated goals (that I'll talk more about in a\nfew seconds) of threatening the heroes at all times, but could backfire as I allude to by\ncreating a positive feedback cycle in favor of the Reinhardt: in other words, if the\nReinhardt is already favored to win, he'll win even harder.`}</Txt>
      <Txt>{`\n`}</Txt>
      <Txt textWrap={true}>{`Given that Reinhardt already does very well at lower-skill matchmaking tiers and\ndrastically loses influence as player skill increases, I feel in retrospect that lifesteal\nwould've required a great deal of attention to avoid being a dominating and unfun\nmechanic to engage with. While balance isn't necessarily the most important thing\nin a silly one-off Arcade mode like this, it's still necessary to a small degree to prevent\nthe overall experience from being tainted by one oversight.`}</Txt>
    </Txt>
  </Layout>);
  yield* all(
    gdcTalkVideo().parent().scale(1.3, 0.5),
    gdcTalkVideo().parent().position([-500, 0], 0.5),
    gdcTalkVideo().parent().opacity(0.75, 0.5),
    delay(0.15, sidenote().opacity(0.75, 0.5))
  );
  yield gdcTalkCaption().position(gdcTalkCaption().position());

  yield* waitUntil("endScene");
  yield* all(
    gdcTalkCaption().opacity(0, 0.5),
    gdcTalkVideo().parent().opacity(0, 0.75),
    gdcTalkVideo().parent().scale(0.7, 0.75, easeInCubic),
    gdcTalkVideo().parent().filters.blur(20, 0.75),
    slideFadeOut(sidenote().parent() as Layout, 0.5, Direction.Bottom, 0.2)
  );
  gdcTalkVideo().remove();
});
