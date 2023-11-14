import { makeScene2D, Grid, Node, Line, Txt, Gradient, Rect, Layout } from "@motion-canvas/2d";
import {CodeBlock, insert, remove} from '@motion-canvas/2d/lib/components/CodeBlock';
import { all, createRef, createSignal, Vector2, fadeTransition, makeRef, range, sequence, easeInQuad, easeOutQuad, delay, easeOutQuint, easeOutCubic, waitUntil, linear, waitFor, easeInOutBounce, easeOutBounce, useDuration, useLogger, easeInQuint, easeInCubic, any, loop, Color, DEFAULT, finishScene } from "@motion-canvas/core";

import { Typewriter } from "../../components/Typewriter";
import { HeroIcon, Hero } from "../../components/HeroIcon";
import emphasisShake from "../../utils/emphasisShake";
import { KillfeedEntry } from "../../components/KillfeedEntry";

export default makeScene2D(function* (view) {
  const logger = useLogger();
  const green = new Color("#45ff57");
  const red = new Color("#ff4545");
  const yellow = new Color("#fffa45");

  const group = createRef<Node>();
  const leftLineLabel = createRef<Typewriter>();
  const rightLineLabel = createRef<Typewriter>();
  const xAxisLabel = createRef<Txt>();
  const killfeed = createRef<Layout>();
  const scale = createSignal(0.8);


  const width = 1920;
  const height = 1080;
  const spacing = 100;
  const ySpread = createSignal(0);
  const initialRespawnTime = createSignal(10);

  const secondsToXCoordinate = (seconds: number) => spacing * (5 - seconds);

  const tickMarkers: Txt[] = [];

  view.add(<Node ref={group} scale={() => scale()}>
    <Grid
      width={width * 2}
      height={height * 2}
      spacing={spacing}
      stroke={"#444"}
      lineWidth={1}
      lineCap="square"
      zIndex={-1}
    />
    <Line
      stroke={"#fff"}
      lineWidth={8}
      lineCap="round"
      x={() => secondsToXCoordinate(initialRespawnTime())}
      points={() => [new Vector2(0, -height * ySpread()), new Vector2(0, height * ySpread())]}
    >
      <Typewriter
        fill={"#fffa"}
        ref={leftLineLabel}
        message={"Max Respawn Time"}
        fontFamily={'Config Monospace'}
        rotation={-90}
        x={-40}
        fontSize={28}
        fixWidth={false}
      />
    </Line>
    <Line
      stroke={"#fff"}
      lineWidth={8}
      lineCap="round"
      x={secondsToXCoordinate(0)}
      points={() => [new Vector2(0, -height * ySpread()), new Vector2(0, height * ySpread())]}
    >
      <Typewriter
        fill={"#fffa"}
        ref={rightLineLabel}
        message={"Respawn"}
        fontFamily={'Config Monospace'}
        rotation={90}
        x={40}
        fontSize={28}
        fixWidth={false}
      />
    </Line>
    <Txt
      ref={xAxisLabel}
      fill={"#aaaa"}
      fontFamily={'Config Medium'}
      fontSize={24}
      y={height * 0.28 + 80}
      opacity={0}
    >
      Seconds Until Respawn
    </Txt>
  </Node>);
  view.add(<Layout
    ref={killfeed}
    layout={true}
    direction={"column-reverse"}
    // y={-4.2 * spacing}
    topRight={() => new Vector2(width * 0.5, height * -0.5)}
    padding={30}
    alignItems={"end"}
    width={width}
  />);

  const secondMarkersPool = range(16).map(i => (
      <Txt
        ref={makeRef(tickMarkers, i)}
        fill={"#aaaa"}
        fontFamily={'Config Medium'}
        x={secondsToXCoordinate(i)}
        y={height * 0.28 + 40}
        fontSize={16}
        opacity={0}

      >
        {`${(i).toString()}`}
      </Txt>
  ));
  group().add(
    <Layout spawner={() => secondMarkersPool.slice(0, initialRespawnTime() + 1)}></Layout>
  );

  yield* fadeTransition(1);

  yield* all(
    scale(1.1, 2),
    delay(0.4, sequence(.06, ...tickMarkers.map(marker => marker.opacity(1, 0.5)))),
    // leftLineLabel().text(, 1.25, easeOutQuad),
    leftLineLabel().typewrite(1.25),
    // rightLineLabel().text("Respawn", 1, linear),
    rightLineLabel().typewrite(1),
    delay(0.2, ySpread(0.28, 1, easeOutCubic)),
    delay(0.8, xAxisLabel().opacity(1, 0.25)),
  );

  yield* waitUntil("firstDeath");

  const killfeedEntry01 = createRef<KillfeedEntry>();
  killfeed().add(<KillfeedEntry
    ref={killfeedEntry01}
    killerName="Bastion"
    killerHero={Hero.Bastion}
    victimName="Soldier: 76"
    victimHero={Hero.Soldier76}
    wasCrit={true}
  />);
  yield killfeedEntry01().animateIn();
  yield delay(5, killfeedEntry01().animateOut());

  const RESPAWN_TIMER_OPACITY = 0.4;

  const player1Ref = createRef<Node>();
  const player1HeroIconRef = createRef<HeroIcon>();
  const player1RespawnTime = createSignal(10);
  const player1RespawnTimeLabel = createRef<Txt>();
  group().add(
    <Node ref={player1Ref} x={() => spacing * (5 - player1RespawnTime())} y={spacing *  -2.75}>
      <HeroIcon hero={Hero.Soldier76} size={72} isFlat={true} ref={player1HeroIconRef} />
      <Txt text={() => player1RespawnTime().toFixed(1)} x={92} fill="#fff" opacity={RESPAWN_TIMER_OPACITY} fontFamily={'Config Monospace'} fontSize={48} ref={player1RespawnTimeLabel} />
    </Node>);

  // We don't need to wait for this animation to complete
  yield player1Ref().opacity(0).opacity(1, 0.5);
  yield* player1HeroIconRef().scale(1.5, 0.25, easeOutQuad);
  yield* player1HeroIconRef().scale(1, 0.25);

  yield* waitUntil("player1-showGroupRespawnWindow");

  let respawnWindowGroup = createRef<Node>();
  let respawnWindow = createRef<Rect>();
  const respawnWindowEdge = createSignal(10);
  const respawnWindowColor = createSignal(yellow);
  group().insert(
      <Node ref={respawnWindowGroup}>
        <Rect
          fill={new Gradient({ angle: 90,
            stops: [{offset: 0, color: "#0000"}, {offset: 1, color: () => respawnWindowColor()}],
            // from: () => new Vector2(secondsToXCoordinate(initialRespawnTime()), 0),
            from: () => respawnWindow().left(),
            // to: () => new Vector2(secondsToXCoordinate(initialRespawnTime() - respawnWindowEdge()), 0)
            to: () => respawnWindow().right()
          })}
          opacity={.4}
          ref={respawnWindow}
          height={height * 2 * ySpread()}
          bottomLeft={() => new Vector2(secondsToXCoordinate(initialRespawnTime()), height * ySpread())}
          width={() => spacing * (initialRespawnTime() - respawnWindowEdge())}
        >
        </Rect>
        <Line stroke={() => respawnWindowColor()} lineWidth={8} x={() => respawnWindow().right().x} points={() => [new Vector2(0, -height * ySpread()), new Vector2(0, height * ySpread())]} lineCap={"round"} />
      </Node>
      , 0
  );
  // logger.info(respawnWindow().width().toString());
  yield respawnWindowGroup().opacity(0).opacity(1, 0.75, easeOutQuad);
  yield* respawnWindowEdge(initialRespawnTime() - 5, 1.5);

  yield* waitUntil("failRespawnRun01");
  yield* respawnWindowColor(red, 0.25, linear);

  yield* waitUntil("player1-hideGroupRespawnWindow");
  yield* respawnWindowGroup().opacity(0, 0.5, easeInQuad);
  // respawnWindowGroup().remove();

  yield* waitUntil("player1-startRespawnRun01");
  yield* player1RespawnTime(8, useDuration("player1-set01"));

  yield* waitUntil("secondDeath");

  const killfeedEntry02 = createRef<KillfeedEntry>();
  killfeed().add(<KillfeedEntry
    ref={killfeedEntry02}
    killerName="Illari"
    killerHero={Hero.Illari}
    victimName="Zenyatta"
    victimHero={Hero.Zenyatta}
    y={-4.2 * spacing}
  />);
  yield killfeedEntry02().animateIn();
  yield delay(5, killfeedEntry02().animateOut());

  const player2Ref = createRef<Node>();
  const player2HeroIconRef = createRef<HeroIcon>();
  const player2RespawnTime = createSignal(10);
  const player2RespawnTimeLabel = createRef<Txt>();
  group().add(
    <Node ref={player2Ref} x={() => spacing * (5 - player2RespawnTime())} y={spacing *  -1.25}>
      <HeroIcon hero={Hero.Zenyatta} size={72} isFlat={true} ref={player2HeroIconRef} />
      <Txt text={() => player2RespawnTime().toFixed(1)} x={92} fill="#fff" opacity={RESPAWN_TIMER_OPACITY} fontFamily={'Config Monospace'} fontSize={48} ref={player2RespawnTimeLabel} />
    </Node>);
  yield player2Ref().opacity(0).opacity(1, 0.5);
  yield* player2HeroIconRef().scale(1.5, 0.25, easeOutQuad);
  yield* player2HeroIconRef().scale(1, 0.25);

  yield* waitUntil("player2-showGroupRespawnWindow");
  respawnWindowColor(yellow);
  respawnWindowEdge(10);
  yield* all(
    respawnWindowGroup().opacity(1, 0.5, easeOutQuad),
    respawnWindowEdge(initialRespawnTime() - 5, 1.5)
  );
  yield* waitUntil("emphasize-respawn-group-02");
  yield* all(
    emphasisShake(player1HeroIconRef()),
    player1HeroIconRef().scale(1.25, 0.25).wait(0.2).to(1, 0.25),
    player1RespawnTimeLabel().opacity(1, 0.45).to(RESPAWN_TIMER_OPACITY, 0.25),
    delay(0.1, player1RespawnTimeLabel().scale(1.25, 0.25).wait(0.2).to(1, 0.25)),
  );

  yield* waitUntil("succeedRespawnRun02");
  yield* respawnWindowColor(green, 0.25, linear);

  yield* waitUntil("computeRespawnRun01Average");

  const computation = createRef<CodeBlock>();
  const computationWrapper = createRef<Layout>();

  yield view.add(
    <Layout ref={computationWrapper} y={-height * 0.4}>
      <CodeBlock alignItems={"start"} language={"txt"} ref={computation} code={() => `${player1RespawnTime().toFixed(1)}s`} />
    </Layout>
  );
  yield* all(
    computation().opacity(0).opacity(1, 0.5),
    player1RespawnTimeLabel().opacity(1, 0.5),
    emphasisShake(player1HeroIconRef())
  );
  yield* waitFor(0.2);
  yield* all(
    computation().edit(0.5)`${player1RespawnTime().toFixed(1)}s${insert(` + ${player2RespawnTime().toFixed(1)}s = 18.0s`)}`,
    player1RespawnTimeLabel().opacity(RESPAWN_TIMER_OPACITY, 0.5),
    player2RespawnTimeLabel().opacity(1, 0.5),
    emphasisShake(player2HeroIconRef())
  );
  yield* waitFor(0.2);
  yield* all(
    computation().edit(0.5)`${remove(`${player1RespawnTime().toFixed(1)}s + ${player2RespawnTime().toFixed(1)}s = `)}18.0s${insert(` / 2 players = 9.0s / player`)}`,
    player2RespawnTimeLabel().opacity(RESPAWN_TIMER_OPACITY, 0.5),
  );

  yield* waitUntil("showRespawnRun01Average");

  const respawnRun01AverageLine = createRef<Line>();
  group().insert(
    <Line
      ref={respawnRun01AverageLine}
      stroke={"#5f5a"}
      lineWidth={6}
      lineCap="round"
      x={spacing * -4}
      lineDash={[10, 10]}
      points={() => [new Vector2(0, -height * ySpread()), new Vector2(0, height * ySpread())]} />,
    0
  );
  yield* all(
    respawnRun01AverageLine().opacity(0).opacity(1, 1.5, easeOutBounce),
    computation().edit(1, false)`${remove(`18.0s / 2 players = `)}9.0s${remove(` / player`)}`,
    computation().selection(DEFAULT, 1),
    computationWrapper().bottom(new Vector2(spacing * -4, -height * ySpread()).addY(-60).addX(-30), 1),
  );

  yield* waitUntil("groupRespawnRun01");

  yield* all(
    player1RespawnTime(9, 1),
    player2RespawnTime(9, 1)
  );

  yield* waitFor(0.5);

  yield all(
    respawnRun01AverageLine().opacity(0, 0.5, easeOutQuad),
    respawnWindowGroup().opacity(0, 0.5, easeInQuad),
    computationWrapper().opacity(0, 0.5, easeInQuad),
  );

  yield* waitFor(0.25);

  yield all(
    player1RespawnTime(8.75, 1, easeInCubic),
    player2RespawnTime(8.75, 1, easeInCubic)
  );

  yield player1RespawnTime(0, 8.75, linear);
  yield player2RespawnTime(0, 8.75, linear);
  yield* waitUntil("end");
  finishScene();
  const fadeOutDuration = useDuration("fadeOut");
  yield* all(
    player1Ref().opacity(0, fadeOutDuration),
    player2Ref().opacity(0, fadeOutDuration)
  );
});
