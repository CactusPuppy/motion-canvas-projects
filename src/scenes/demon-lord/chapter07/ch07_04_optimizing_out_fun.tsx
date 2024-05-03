import {Circle, Gradient, Layout, Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {Color, PlaybackState, all, chain, clamp, createRef, createSignal, delay, easeInCubic, easeInQuad, easeOutCubic, makeRef, sequence, useDuration, useLogger, usePlayback, useRandom, useScene, waitFor, waitUntil} from '@motion-canvas/core';

import {Hero, HeroIcon} from '../../../components/HeroIcon';
import emphasisShake from '../../../utils/emphasisShake';

export default makeScene2D(function* (view) {
  const logger = useLogger();

  if (usePlayback().state !== PlaybackState.Rendering) {
    view.fill("#000000aa");
  }
  const ch04Title = createRef<Node>();
  const titleUnderlineWidth = createSignal(0);
  const titleSlide = createSignal(70);
  const titleScale = createSignal(1.9);
  const title = createRef<Node>();
  const subtitle = createRef<Node>();
  const numeralSeparation = createSignal(0);

  const titleSeparation = 35;

  view.add(<Node ref={ch04Title} scale={() => titleScale()}>
    <Node ref={title} y={-titleSeparation/2} cache>
      <Rect fill="white" width={1000} height={60} y={-10} />
      <Txt fill="white" fontFamily={"Config"} compositeOperation={"source-in"} y={() => titleSlide()}>Optimal FPS: Fun-Per-Second</Txt>
    </Node>
    <Node y={titleSeparation/2} ref={subtitle}>
      <Node>
        <Line stroke="white" lineWidth={4} x={() => -numeralSeparation()} points={[
          [0, -10],
          [0, 12]
        ]} />
        {/* <Line stroke="white" lineWidth={4} points={[
          [0, -12],
          [0, 12]
        ]} />
        <Line stroke="white" lineWidth={4} x={() => numeralSeparation()} points={[
          [0, -12],
          [0, 12]
        ]} /> */}
        <Txt fill="white" scaleX={() => clamp(0, 1, numeralSeparation() / 4)} x={numeralSeparation} y={4} fontSize={32} fontFamily={"Config"}>V</Txt>
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

  yield titleUnderlineWidth(630, 0.5, easeOutCubic);
  yield chain(
    subtitle().findFirst<Node>((node) => node instanceof Node).opacity(0,0).to(1, 0.25),
    delay(0.45, numeralSeparation(7, 0.5, easeOutCubic)));
  yield delay(0.25, titleSlide(0, 0.5));

  const titleDuration = useDuration("titleFadeout");
  ch04Title().shadowColor("black");
  ch04Title().shadowBlur(3);
  // yield titleScale(1.95, titleDuration, linear);
  yield* waitFor(titleDuration);

  yield titleScale(1.8, 1);
  yield titleSlide(70, 0.35);
  yield* titleUnderlineWidth(0, 0.5, easeInCubic);
  yield* subtitle().findFirst<Node>((node) => node instanceof Node).opacity(0, 0.3);

  yield* waitUntil("theory");
  const reinColor = new Color("#94a1a5");
  const reinColorSignal = createSignal(reinColor);
  const orisaColor = new Color("#458b42");
  const lifeweaverColor = new Color("#e0b6c6");
  const lucioColor = new Color("#84c951");
  const genjiColor = new Color("#95ef42");
  const reinIconRef = createRef<HeroIcon>();
  const orisaIconRef = createRef<HeroIcon>();
  const lifeweaverIconRef = createRef<HeroIcon>();
  const lucioIconRef = createRef<HeroIcon>();
  const genjiIconRef = createRef<HeroIcon>();

  view.add(<HeroIcon ref={reinIconRef} hero={Hero.Reinhardt} x={-500} y={10} isFlat={true} radius={16} size={128}>
    <Rect
      stroke={() => reinColorSignal().brighten(0.25)}
      shadowColor={() => reinColorSignal().darken()}
      shadowBlur={16}
      lineWidth={8}
      radius={16}
      size={128}
    />
  </HeroIcon>);
  view.add(<HeroIcon ref={orisaIconRef} hero={Hero.Orisa} x={150} y={-36} isFlat={true} radius={16} size={128}>
    <Rect
      stroke={() => orisaColor.brighten(0.25)}
      shadowColor={() => orisaColor.darken()}
      shadowBlur={16}
      lineWidth={8}
      radius={16}
      size={128}
    />
  </HeroIcon>);
  view.add(<HeroIcon ref={lifeweaverIconRef} hero={Hero.Lifeweaver} x={639} y={-281} isFlat={true} radius={16} size={128}>
    <Rect
      stroke={() => lifeweaverColor.brighten(0.25)}
      shadowColor={() => lifeweaverColor.darken()}
      shadowBlur={16}
      lineWidth={8}
      radius={16}
      size={128}
    />
  </HeroIcon>);
  view.add(<HeroIcon ref={lucioIconRef} hero={Hero.Lucio} x={536} y={-95} isFlat={true} radius={16} size={128}>
    <Rect
      stroke={() => lucioColor.brighten(0.25)}
      shadowColor={() => lucioColor.darken()}
      shadowBlur={16}
      lineWidth={8}
      radius={16}
      size={128}
    />
  </HeroIcon>);
  view.add(<HeroIcon ref={genjiIconRef} hero={Hero.Genji} x={310} y={275} isFlat={true} radius={16} size={128}>
    <Rect
      stroke={() => genjiColor.brighten(0.25)}
      shadowColor={() => genjiColor.darken()}
      shadowBlur={16}
      lineWidth={8}
      radius={16}
      size={128}
    />
  </HeroIcon>);
  view.findAll<HeroIcon>((node) => node instanceof HeroIcon).forEach((icon) => {
    icon.opacity(0);
  });
  const threatenArrow = createRef<Line>();
  view.add(<Node cache zIndex={-1}>
    <Line
      ref={threatenArrow}
      lineWidth={400}
      stroke={"white"}
      endArrow={true}
      arrowSize={430}
      points={[
        [-600, 0],
        [450, 0]
      ]}
      end={0}
    />
    <Rect width={1100} x={-100} height={useScene().getSize().height} fill={new Gradient({
      from: [-600, 0],
      to: [400, 0],
      stops: [
        {offset: 0, color: new Color("red").alpha(0.5)},
        {offset: 0.5, color: new Color("red").alpha(0.3)},
        {offset: 1, color: new Color("red").alpha(0.15)},
      ]
    })} compositeOperation={"source-in"} />
  </Node>);

  yield* sequence(
    0.1,
    reinIconRef().opacity(1, 0.5),
    orisaIconRef().opacity(1, 0.5),
    lifeweaverIconRef().opacity(1, 0.5),
    lucioIconRef().opacity(1, 0.5),
    genjiIconRef().opacity(1, 0.5),
    threatenArrow().end(1, 1),
    delay(1, all(
      reinIconRef().position([-350, 0], 0.5),
      reinColorSignal(new Color("red"), 0.5).to(reinColor, 0.5),
      reinIconRef().scale(1.5, 0.5, easeOutCubic).to(1, 0.5, easeInCubic),
      emphasisShake(reinIconRef(), 1, 5, 7),
    )),
  );

  const reactionCaptions : Txt[] = [];
  view.add(<Txt ref={makeRef(reactionCaptions, 1)} fill="white" fontFamily={"Config"} fontWeight={800} fontSize={32} bottom={() => orisaIconRef().top().addY(-15)}>tank diff</Txt>);
  view.add(<Txt ref={makeRef(reactionCaptions, 2)} fill="white" fontFamily={"Config"} fontWeight={800} fontSize={32} bottom={() => lifeweaverIconRef().top().addY(-15)}>whatever</Txt>);
  view.add(<Txt ref={makeRef(reactionCaptions, 3)} fill="white" fontFamily={"Config"} fontWeight={800} fontSize={32} bottom={() => lucioIconRef().top().addY(-15)}>L tank fr</Txt>);
  view.add(<Txt ref={makeRef(reactionCaptions, 0)} fill="white" fontFamily={"Config"} fontWeight={800} fontSize={32} bottom={() => genjiIconRef().top().addY(-15)}>meh...</Txt>);

  reactionCaptions.map((caption) => caption.opacity(0));
  yield* sequence(
    0.15,
    ...reactionCaptions.map((caption) => caption.opacity(1, 0.5)),
  );
  yield* waitUntil("reinSad");
  const reinReaction = createRef<Txt>();
  view.add(<Txt ref={reinReaction} fill="white" fontFamily={"Config"} fontWeight={800} fontSize={32} bottom={() => reinIconRef().top().addY(-15)} opacity={0}>{":("}</Txt>);
  yield all(
    reinReaction().opacity(1, 0.5),
  );

  yield* waitUntil("ultimate");
  yield all(
    reinIconRef().position([-1100, 10], 1.5, easeInQuad),
    threatenArrow().opacity(0, 0.75)
  );

  yield* waitUntil("endScene");
  yield* all(
    delay(useRandom().gauss(0.25, 0.5), all(
      orisaIconRef().position(orisaIconRef().position().addX(1000), 1, easeInCubic),
      orisaIconRef().opacity(0, 1),
    )),
    delay(useRandom().gauss(0.25, 0.5), all(
      lifeweaverIconRef().position(lifeweaverIconRef().position().addX(1000), 1, easeInCubic),
      lifeweaverIconRef().opacity(0, 1),
    )),
    delay(useRandom().gauss(0.25, 0.5), all(
      lucioIconRef().position(lucioIconRef().position().addX(1000), 1, easeInCubic),
      lucioIconRef().opacity(0, 1),
    )),
    delay(useRandom().gauss(0.25, 0.5), all(
      genjiIconRef().position(genjiIconRef().position().addX(1000), 1, easeInCubic),
      genjiIconRef().opacity(0, 1),
    )),
    ...reactionCaptions.map((caption) => caption.opacity(0, 0.5)),
    reinReaction().opacity(0, 0.5),
  );
});
