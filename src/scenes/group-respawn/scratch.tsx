import { makeScene2D, Grid, Node, Line, Txt, Gradient, Rect, Layout } from "@motion-canvas/2d";
import {CodeBlock, insert, remove} from '@motion-canvas/2d/lib/components/CodeBlock';
import { all, createRef, createSignal, Vector2, fadeTransition, makeRef, range, sequence, easeInQuad, easeOutQuad, delay, easeOutQuint, easeOutCubic, waitUntil, linear, waitFor, easeInOutBounce, easeOutBounce, useDuration, useLogger, easeInQuint, easeInCubic, any, loop, Color, DEFAULT } from "@motion-canvas/core";

import { Typewriter } from "../components/Typewriter";
import { HeroIcon, Hero } from "../components/HeroIcon";
import emphasisShake from "../utils/emphasisShake";

export default makeScene2D(function* (view) {
  const group = createRef<Node>();
  const initialRespawnTime = createSignal(10);
  const secondsToXCoordinate = (seconds: number) => spacing * (5 - seconds);

  view.add(<Node ref={group} scale={() => scale()}>
    <Grid
      ...
    />
    <Line
      ...
      x={() => secondsToXCoordinate(initialRespawnTime())}
    >
      <Txt
        ...
        text={"Max Respawn Time"}
        rotation={90}
      />
    </Line>
    <Line
      ...
      x={secondsToXCoordinate(0)}
    >
      <Txt
        ...
        text={"Respawn"}
        rotation={90}
      />
    </Line>
    <Txt>
      Seconds Until Respawn
    </Txt>
  </Node>);

  const tickMarkers: Txt[] = [];

  const secondMarkersPool = range(16).map(i => (
    <Txt
      ref={makeRef(tickMarkers, i)}
      fill={"#aaaa"}
      fontFamily={'Config Medium'}
      x={secondsToXCoordinate(i)}
      y={height * 0.28 + 40}
      fontSize={16}
    >
      {`${i}`}
    </Txt>
  ));

  const secondMarkers = createRef<Layout>();
  group().add(
    <Layout ref={secondMarkers} spawner={() => secondMarkersPool.slice(0, initialRespawnTime() + 1)}></Layout>
  );

  yield* all(
    initialRespawnTime(13, 1),
    delay(.4, sequence(0.2, ...tickMarkers.slice(11, 14).map(tick => tick.opacity(0).opacity(1, 0.3)))),
  );
});
