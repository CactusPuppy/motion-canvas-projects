import { Circle, Gradient, Grid, Img, Layout, Line, Node, Rect, Txt, makeScene2D } from "@motion-canvas/2d";
import { Color, DEFAULT, Direction, Vector2, all, any, createRef, createSignal, delay, easeInCubic, easeInOutQuad, easeInQuad, easeOutCubic, easeOutQuad, easeOutSine, fadeTransition, linear, loop, loopFor, makeRef, range, sequence, useDuration, useLogger, waitFor, waitUntil } from "@motion-canvas/core";

import { Hero, HeroIcon } from "../../components/HeroIcon";
import { KillfeedEntry } from "../../components/KillfeedEntry";
import { Typewriter } from "../../components/Typewriter";

import pulseBomb from "../../../images/abilities/Pulse Bomb.png";
import gravitonSurge from "../../../images/abilities/Graviton Surge.png";
import emphasisShake from "../../utils/emphasisShake";
import { CodeBlock, insert, remove } from "@motion-canvas/2d/lib/components/CodeBlock";
import { slideFadeOut } from "../../utils/slideFades";

export default makeScene2D(function* (view) {
  const logger = useLogger();

  const green = new Color("#45ff57");
  const red = new Color("#ff4545");
  const yellow = new Color("#fffa45");
  const orange = new Color("#ff9a45");

  const group = createRef<Node>();
  const leftLineLabel = createRef<Typewriter>();
  const rightLineLabel = createRef<Typewriter>();
  const xAxisLabel = createRef<Txt>();
  const scale = createSignal(1);


  const width = 1920;
  const height = 1080;
  const spacing = 100;
  const ySpread = createSignal(0.28);
  const initialRespawnTime = createSignal(13);

  const secondsToXCoordinate = (seconds: number) => spacing * (5 - seconds);
  const maxRespawnTimeLine = createRef<Line>();
  const respawnTimeLine = createRef<Line>();

  const tickMarkers: Txt[] = [];

  view.add(<Node ref={group} scale={() => scale()}>
    <Grid
      width={width * 2}
      height={height * 2}
      spacing={spacing}
      stroke={"#444"}
      lineWidth={1}
      lineCap="square"
      zIndex={-10}
    />
    <Line
      ref={maxRespawnTimeLine}
      stroke={"#fff"}
      lineWidth={8}
      lineCap="round"
      x={() => secondsToXCoordinate(initialRespawnTime())}
      points={() => [new Vector2(0, -height * ySpread()), new Vector2(0, height * ySpread())]}
    >
      <Txt
        fill={"#fffa"}
        ref={leftLineLabel}
        text={"Max Respawn Time"}
        fontFamily={'Config Monospace'}
        rotation={-90}
        x={-40}
        fontSize={28}
      />
    </Line>
    <Line
      ref={respawnTimeLine}
      stroke={"#fff"}
      lineWidth={8}
      lineCap="round"
      x={secondsToXCoordinate(0)}
      points={() => [new Vector2(0, -height * ySpread()), new Vector2(0, height * ySpread())]}
    >
      <Txt
        fill={"#fffa"}
        ref={rightLineLabel}
        text={"Respawn"}
        fontFamily={'Config Monospace'}
        rotation={90}
        x={40}
        fontSize={28}
      />
    </Line>
    <Txt
      ref={xAxisLabel}
      fill={"#aaaa"}
      fontFamily={'Config Medium'}
      fontSize={24}
      x={() => (secondsToXCoordinate(0) + secondsToXCoordinate(initialRespawnTime())) / 2}
      y={height * 0.28 + 80}
    >
      Seconds Until Respawn
    </Txt>
  </Node>);

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
    <Layout ref={secondMarkers} spawner={() => secondMarkersPool.slice(0, 16)}></Layout>
  );
  tickMarkers.map(tick => tick.opacity(0));
  tickMarkers.slice(0, 14).map(tick => tick.opacity(1));

  group().position({x: 1.5 * spacing, y: 0});

  yield* all(
    initialRespawnTime(10, 2),
    delay(0.20, group().position({x: 0, y: 0}, 2)),
    delay(0.2, scale(1.1, 2)),
    delay(0.2, sequence(0.4, ...tickMarkers.slice(11, 14).reverse().map(tick => tick.opacity(0, 0.5)))),
  );

  const killfeed = createRef<Layout>();
  const killfeedEntries: KillfeedEntry[] = [];
  view.add(<Layout
    layout
    ref={killfeed}
    topRight={() => new Vector2({x: width * 0.5, y: height * -0.5})}
    gap={8}
    width={width * 0.25}
    height={height * 0.25}
    scale={0.75}
    padding={30}
    direction={"column-reverse"}
    alignItems={"end"}
  />);

  yield* waitUntil("startRealtime");
  killfeed().add(<KillfeedEntry
    ref={makeRef(killfeedEntries, 0)}
    killerName="Tracer"
    killerHero={Hero.Tracer}
    victimName="Ana"
    victimHero={Hero.Ana}
    abilityIcon={(<Layout cache y={-4} layout justifyContent={"center"} alignItems={"center"}>
      <Img src={pulseBomb} size={64} />
      <Rect layout={false} size={64} fill={'black'} compositeOperation={"source-in"} />
    </Layout>)}
    abilityWasUltimate={true}
  />);
  yield function* () {
    yield* killfeedEntries[0].animateIn();
    yield* delay(5, killfeedEntries[0].animateOut());
    killfeedEntries[0].remove();
  }();

  const RESPAWN_TIMER_OPACITY = 0.4;

  const player1Ref = createRef<Layout>();
  const player1HeroIconRef = createRef<HeroIcon>();
  const player1RespawnTime = createSignal(10);
  const player1RespawnTimeLabel = createRef<Txt>();
  group().add(
    <Layout ref={player1Ref} x={() => spacing * (5 - player1RespawnTime())} y={spacing *  -2.75} size={72}>
      <HeroIcon hero={Hero.Ana} size={72} isFlat={true} ref={player1HeroIconRef} />
      <Txt text={() => player1RespawnTime().toFixed(1)} x={92} fill="#fff" opacity={RESPAWN_TIMER_OPACITY} fontFamily={'Config Monospace'} fontSize={48} ref={player1RespawnTimeLabel} />
    </Layout>
  );

  let respawnWindowGroup = createRef<Node>();
  let respawnWindow = createRef<Rect>();
  const respawnWindowEdge = createSignal(10);
  const respawnWindowColor = createSignal(yellow);
  group().add(
    <Node ref={respawnWindowGroup} zIndex={-1}>
      <Rect
        fill={() => new Gradient({ angle: 90,
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
  );
  respawnWindowColor(red);
  respawnWindowEdge(5);
  respawnWindowGroup().opacity(0);
  yield all(
    player1Ref().opacity(0).opacity(1, 0.25),
    player1HeroIconRef().scale(1.5, 0.15, easeOutQuad).to(1, 0.2),
    player1RespawnTime(8, 2, linear),
    respawnWindowGroup().opacity(1, 0.05).wait(0.25).to(0, 0.40),
  );

  yield* waitFor(2);
  killfeed().add(<KillfeedEntry
    ref={makeRef(killfeedEntries, 1)}
    killerName="Widowmaker"
    killerHero={Hero.Widowmaker}
    victimName="Pharah"
    victimHero={Hero.Pharah}
    wasCrit={true}
  />);
  yield function* () {
    yield* killfeedEntries[1].animateIn();
    yield* delay(5, killfeedEntries[1].animateOut());
    killfeedEntries[1].remove();
  }();

  const player2Ref = createRef<Layout>();
  const player2HeroIconRef = createRef<HeroIcon>();
  const player2RespawnTime = createSignal(9);
  const player2RespawnTimeLabel = createRef<Txt>();
  group().add(
    <Layout ref={player2Ref} x={() => spacing * (5 - player2RespawnTime())} y={spacing *  -2.75/2} size={72}>
      <HeroIcon hero={Hero.Pharah} size={72} isFlat={true} ref={player2HeroIconRef} />
      <Txt text={() => player2RespawnTime().toFixed(1)} x={92} fill="#fff" opacity={RESPAWN_TIMER_OPACITY} fontFamily={'Config Monospace'} fontSize={48} ref={player2RespawnTimeLabel} />
    </Layout>
  );
  player1RespawnTime(9);
  yield all(
    emphasisShake(player1HeroIconRef(), 0.3, 7, 2),

    player2Ref().opacity(0).opacity(1, 0.25),
    player2HeroIconRef().scale(1.5, 0.15, easeOutQuad).to(1, 0.2),

    player1RespawnTime(7, 2, linear),
    player2RespawnTime(7, 2, linear),
  );
  respawnWindowColor(green);
  yield respawnWindowGroup().opacity(1, 0.05).wait(0.25).to(0, 0.40);

  const player1_run01_adjustment = createRef<Line>();
  const player1_run01_adjustment_label = createRef<Txt>();
  group().add(<Line
    ref={player1_run01_adjustment}
    points={[{x: secondsToXCoordinate(8), y: 0}, {x: secondsToXCoordinate(9), y: 0}]}
    y={spacing * -2.75}
    stroke={red}
    lineWidth={8}
    lineCap={"butt"}
    endArrow={true}
    arrowSize={12}>
      <Txt
        ref={player1_run01_adjustment_label}
        fontFamily={"Config Medium"}
        fill={red}
        opacity={0.75}
        fontSize={30}
        bottom={() => {return { x: secondsToXCoordinate(8 + 0.5), y: 0 }}}
        text={() => `+${Math.floor(1 * 100) / 100}`}
      />
    </Line>);
  player1_run01_adjustment().opacity(0);
  yield function* () {
    yield* all(
      player1_run01_adjustment().opacity(1, 0.05).wait(0.25).to(0, 0.40),
      player1RespawnTimeLabel().opacity(1, 0.05).wait(0.25).to(RESPAWN_TIMER_OPACITY, 0.40),
    );
    player1_run01_adjustment().remove();
  }();
  const player1_total_adjustment_label = createRef<Txt>();
  const player1_total_adjustment_signal = createSignal(0);
  player1Ref().add(<Txt
    ref={player1_total_adjustment_label}
    fontFamily={"Config Monospace"}
    fontSize={24}
    fill={'white'}
    top={player1RespawnTimeLabel().bottom().addY(10)}
    text={() => `${player1_total_adjustment_signal() > 0 ? "+" : "-"}${player1_total_adjustment_signal().toFixed(1)}s`} />);
  player1_total_adjustment_signal(1);

  const player2_run01_adjustment = createRef<Line>();
  const player2_run01_adjustment_label = createRef<Txt>();
  group().add(<Line
    ref={player2_run01_adjustment}
    points={[{x: secondsToXCoordinate(10), y: 0}, {x: secondsToXCoordinate(9), y: 0}]}
    y={spacing * -2.75/2}
    stroke={green}
    lineWidth={8}
    lineCap={"butt"}
    endArrow={true}
    arrowSize={12}>
      <Txt
        ref={player2_run01_adjustment_label}
        fontFamily={"Config Medium"}
        fill={green}
        opacity={0.75}
        fontSize={30}
        bottom={() => {return { x: secondsToXCoordinate(10 - 0.5), y: 0 }}}
        text={() => `-${Math.floor(1 * 100) / 100}`}
      />
  </Line>);
  player2_run01_adjustment().opacity(0);
  yield function* () {
    yield* all(
      player2_run01_adjustment().opacity(1, 0.05).wait(0.25).to(0, 0.40),
      player2RespawnTimeLabel().opacity(1, 0.05).wait(0.25).to(RESPAWN_TIMER_OPACITY, 0.40),
    );
    player2_run01_adjustment().remove();
  }();
  const player2_total_adjustment_label = createRef<Txt>();
  const player2_total_adjustment_signal = createSignal(0);
  player2Ref().add(<Txt
    ref={player2_total_adjustment_label}
    fontFamily={"Config Monospace"}
    fontSize={24}
    fill={'white'}
    top={player2RespawnTimeLabel().bottom().addY(10)}
    text={() => `${player2_total_adjustment_signal() > 0 ? "+" : ""}${player2_total_adjustment_signal().toFixed(1)}s`} />);
  player2_total_adjustment_signal(-1);

  yield* waitFor(2);

  killfeed().add(<KillfeedEntry
    ref={makeRef(killfeedEntries, 2)}
    killerName="Kiriko"
    killerHero={Hero.Kiriko}
    victimName="Bastion"
    victimHero={Hero.Bastion}
    wasCrit={true}
  />);
  yield function* () {
    yield* killfeedEntries[2].animateIn();
    yield* delay(5, killfeedEntries[2].animateOut());
    killfeedEntries[2].remove();
  }();

  const player3Ref = createRef<Layout>();
  const player3HeroIconRef = createRef<HeroIcon>();
  const player3RespawnTime = createSignal(8);
  const player3RespawnTimeLabel = createRef<Txt>();
  group().add(
    <Layout ref={player3Ref} x={() => spacing * (5 - player3RespawnTime())} y={0} size={72}>
      <HeroIcon hero={Hero.Bastion} size={72} isFlat={true} ref={player3HeroIconRef} />
      <Txt text={() => player3RespawnTime().toFixed(1)} x={92} fill="#fff" opacity={RESPAWN_TIMER_OPACITY} fontFamily={'Config Monospace'} fontSize={48} ref={player3RespawnTimeLabel} />
    </Layout>
  );
  player1RespawnTime(8);
  player2RespawnTime(8);
  yield all(
    emphasisShake(player1HeroIconRef(), 0.3, 7, 2),
    emphasisShake(player2HeroIconRef(), 0.3, 7, 2),

    player3Ref().opacity(0).opacity(1, 0.25),
    player3HeroIconRef().scale(1.5, 0.15, easeOutQuad).to(1, 0.2),

    player1RespawnTime(7, 1, linear),
    player2RespawnTime(7, 1, linear),
    player3RespawnTime(7, 1, linear),
  );
  respawnWindowColor(green);
  yield respawnWindowGroup().opacity(1, 0.05).wait(0.25).to(0, 0.40);

  const player1_run02_adjustment = createRef<Line>();
  const player1_run02_adjustment_label = createRef<Txt>();
  group().add(<Line
    ref={player1_run02_adjustment}
    points={[{x: secondsToXCoordinate(7), y: 0}, {x: secondsToXCoordinate(8), y: 0}]}
    y={spacing * -2.75}
    stroke={red}
    lineWidth={8}
    lineCap={"butt"}
    endArrow={true}
    arrowSize={12}>
      <Txt
        ref={player1_run02_adjustment_label}
        fontFamily={"Config Medium"}
        fill={red}
        opacity={0.75}
        fontSize={30}
        bottom={() => {return { x: secondsToXCoordinate(8 - 0.5), y: 0 }}}
        text={() => `+${Math.floor(1 * 100) / 100}`}
      />
    </Line>);
  player1_run02_adjustment().opacity(0);
  yield function* () {
    yield* all(
      player1_run02_adjustment().opacity(1, 0.05).wait(0.25).to(0, 0.40),
      player1RespawnTimeLabel().opacity(1, 0.05).wait(0.25).to(RESPAWN_TIMER_OPACITY, 0.40),
    );
    player1_run02_adjustment().remove();
  }();
  player1_total_adjustment_signal(2);

  const player2_run02_adjustment = createRef<Line>();
  const player2_run02_adjustment_label = createRef<Txt>();
  group().add(<Line
    ref={player2_run02_adjustment}
    points={[{x: secondsToXCoordinate(7), y: 0}, {x: secondsToXCoordinate(8), y: 0}]}
    y={spacing * -2.75/2}
    stroke={red}
    lineWidth={8}
    lineCap={"butt"}
    endArrow={true}
    arrowSize={12}>
      <Txt
        ref={player2_run02_adjustment_label}
        fontFamily={"Config Medium"}
        fill={red}
        opacity={0.75}
        fontSize={30}
        bottom={() => {return { x: secondsToXCoordinate(8 - 0.5), y: 0 }}}
        text={() => `+${Math.floor(1 * 100) / 100}`}
      />
  </Line>);
  player2_run02_adjustment().opacity(0);
  yield function* () {
    yield* all(
      player2_run02_adjustment().opacity(1, 0.05).wait(0.25).to(0, 0.40),
      player2RespawnTimeLabel().opacity(1, 0.05).wait(0.25).to(RESPAWN_TIMER_OPACITY, 0.40),
    );
    player2_run02_adjustment().remove();
  }();
  player2_total_adjustment_signal(0);

  const player3_run02_adjustment = createRef<Line>();
  const player3_run02_adjustment_label = createRef<Txt>();
  group().add(<Line
    ref={player3_run02_adjustment}
    points={[{x: secondsToXCoordinate(10), y: 0}, {x: secondsToXCoordinate(8), y: 0}]}
    y={0}
    stroke={green}
    lineWidth={8}
    lineCap={"butt"}
    endArrow={true}
    arrowSize={12}>
      <Txt
        ref={player3_run02_adjustment_label}
        fontFamily={"Config Medium"}
        fill={green}
        opacity={0.75}
        fontSize={30}
        bottom={() => {return { x: secondsToXCoordinate(9), y: 0 }}}
        text={() => `-${Math.floor(2 * 100) / 100}`}
      />
  </Line>);
  player3_run02_adjustment().opacity(0);
  yield function* () {
    yield* all(
      player3_run02_adjustment().opacity(1, 0.05).wait(0.25).to(0, 0.40),
      player3RespawnTimeLabel().opacity(1, 0.05).wait(0.25).to(RESPAWN_TIMER_OPACITY, 0.40),
    );
    player3_run02_adjustment().remove();
  }();

  const player3_total_adjustment_label = createRef<Txt>();
  const player3_total_adjustment_signal = createSignal(-2);
  player3Ref().add(<Txt
    ref={player3_total_adjustment_label}
    fontFamily={"Config Monospace"}
    fontSize={24}
    fill={'white'}
    top={player3RespawnTimeLabel().bottom().addY(10)}
    text={() => `${player3_total_adjustment_signal() > 0 ? "+" : ""}${player3_total_adjustment_signal().toFixed(1)}s`} />);

  yield delay(0.25, all(
    scale(1, 0.75),
    group().position({x: 100, y: 0}, 0.75),
  ))
  yield* waitFor(1);

  yield sequence(0.1, ...tickMarkers.slice(11, 14).map(tick => tick.opacity(1, 0.25)));
  yield initialRespawnTime(13, 0.2);

  killfeed().add(<KillfeedEntry
    ref={makeRef(killfeedEntries, 3)}
    killerName="Zenyatta"
    killerHero={Hero.Zenyatta}
    victimName="Illari"
    victimHero={Hero.Illari}
  />);
  yield function* () {
    yield* killfeedEntries[3].animateIn();
    yield* delay(5, killfeedEntries[3].animateOut());
    killfeedEntries[3].remove();
  }();

  const player4Ref = createRef<Layout>();
  const player4HeroIconRef = createRef<HeroIcon>();
  const player4RespawnTime = createSignal(13);
  const player4RespawnTimeLabel = createRef<Txt>();
  group().add(
    <Layout ref={player4Ref} x={() => spacing * (5 - player4RespawnTime())} y={spacing *  2.75/2} size={72}>
      <HeroIcon hero={Hero.Illari} size={72} isFlat={true} ref={player4HeroIconRef} />
      <Txt text={() => player4RespawnTime().toFixed(1)} x={92} fill="#fff" opacity={RESPAWN_TIMER_OPACITY} fontFamily={'Config Monospace'} fontSize={48} ref={player4RespawnTimeLabel} />
    </Layout>
  );
  yield all(
    player4Ref().opacity(0).opacity(1, 0.25),
    player4HeroIconRef().scale(1.5, 0.15, easeOutQuad).to(1, 0.2),

    player1RespawnTime(3, 4, linear),
    player2RespawnTime(3, 4, linear),
    player3RespawnTime(3, 4, linear),
    player4RespawnTime(9, 4, linear),
  );
  respawnWindowColor(red);
  respawnWindowEdge(8);
  respawnWindow().fill(new Gradient({ angle: 90, stops: [{offset: 0, color: "#0000"}, {offset: 1, color: () => respawnWindowColor()}], from: () => respawnWindow().left(), to: () => respawnWindow().right() }));
  yield respawnWindowGroup().opacity(1, 0.05).wait(0.25).to(0, 0.40);

  yield* waitFor(4);

  killfeed().add(<KillfeedEntry
    ref={makeRef(killfeedEntries, 4)}
    killerName="Zarya"
    killerHero={Hero.Zarya}
    victimName="D.Va"
    victimHero={Hero.Dva}
    abilityIcon={(<Layout cache y={-4} layout justifyContent={"center"} alignItems={"center"}>
      <Img src={gravitonSurge} size={64} />
      <Rect layout={false} size={64} fill={'black'} compositeOperation={"source-in"} />
    </Layout>)}
    abilityWasUltimate={true}
  />);
  yield function* () {
    yield* killfeedEntries[4].animateIn();
    yield* delay(5, killfeedEntries[4].animateOut());
    killfeedEntries[4].remove();
  }();

  const player5Ref = createRef<Layout>();
  const player5HeroIconRef = createRef<HeroIcon>();
  const player5RespawnTime = createSignal(11);
  const player5RespawnTimeLabel = createRef<Txt>();
  group().add(
    <Layout ref={player5Ref} x={() => spacing * (5 - player5RespawnTime())} y={spacing *  2.75} size={72}>
      <HeroIcon hero={Hero.Dva} size={72} isFlat={true} ref={player5HeroIconRef} />
      <Txt text={() => player5RespawnTime().toFixed(1)} x={92} fill="#fff" opacity={RESPAWN_TIMER_OPACITY} fontFamily={'Config Monospace'} fontSize={48} ref={player5RespawnTimeLabel} />
    </Layout>
  );
  player4RespawnTime(11);
  yield all(
    emphasisShake(player4HeroIconRef(), 0.3, 7, 2),

    player5Ref().opacity(0).opacity(1, 0.25),
    player5HeroIconRef().scale(1.5, 0.15, easeOutQuad).to(1, 0.2),

    function* () {
      yield* player1RespawnTime(0, 3, linear);
      yield player1Ref().position(player1Ref().position());
      yield* slideFadeOut(player1Ref(), 0.5, Direction.Right, 0.5, easeOutCubic);
      player1Ref().remove();
    }(),
    function* () {
      yield* player2RespawnTime(0, 3, linear);
      yield player2Ref().position(player2Ref().position());
      yield* slideFadeOut(player2Ref(), 0.5, Direction.Right, 0.5, easeOutCubic);
      player2Ref().remove();
    }(),
    function* () {
      yield* player3RespawnTime(0, 3, linear);
      yield player3Ref().position(player3Ref().position());
      yield* slideFadeOut(player3Ref(), 0.5, Direction.Right, 0.5, easeOutCubic);
      player3Ref().remove();
    }(),
    function* () {
      yield* player4RespawnTime(0, 11, linear);
      yield player4Ref().position(player4Ref().position());
      yield* slideFadeOut(player4Ref(), 0.5, Direction.Right, 0.5, easeOutCubic);
      player4Ref().remove();
    }(),
    function* () {
      yield* player5RespawnTime(0, 11, linear);
      yield player5Ref().position(player5Ref().position());
      yield* slideFadeOut(player5Ref(), 0.5, Direction.Right, 0.5, easeOutCubic);
      player5Ref().remove();
    }(),
  );

  respawnWindowColor(green);
  yield respawnWindowGroup().opacity(1, 0.05).wait(0.25).to(0, 0.40);

  const player4_run03_adjustment = createRef<Line>();
  const player4_run03_adjustment_label = createRef<Txt>();
  group().add(<Line
    ref={player4_run03_adjustment}
    points={[{x: secondsToXCoordinate(9), y: 0}, {x: secondsToXCoordinate(11), y: 0}]}
    y={spacing * 2.75/2}
    stroke={red}
    lineWidth={8}
    lineCap={"butt"}
    endArrow={true}
    arrowSize={12}>
      <Txt
        ref={player4_run03_adjustment_label}
        fontFamily={"Config Medium"}
        fill={red}
        opacity={0.75}
        fontSize={30}
        bottom={() => {return { x: secondsToXCoordinate(10), y: 0 }}}
        text={() => `+${Math.floor(2 * 100) / 100}`}
      />
  </Line>);
  player4_run03_adjustment().opacity(0);
  yield function* () {
    yield* all(
      player4_run03_adjustment().opacity(1, 0.05).wait(0.25).to(0, 0.40),
      player4RespawnTimeLabel().opacity(1, 0.05).wait(0.25).to(RESPAWN_TIMER_OPACITY, 0.40),
    );
    player4_run03_adjustment().remove();
  }();
  const player4_total_adjustment_label = createRef<Txt>();
  const player4_total_adjustment_signal = createSignal(2);
  player4Ref().add(<Txt
    ref={player4_total_adjustment_label}
    fontFamily={"Config Monospace"}
    fontSize={24}
    fill={'white'}
    top={player4RespawnTimeLabel().bottom().addY(10)}
    text={() => `${player4_total_adjustment_signal() > 0 ? "+" : ""}${player4_total_adjustment_signal().toFixed(1)}s`} />);

  const player5_run03_adjustment = createRef<Line>();
  const player5_run03_adjustment_label = createRef<Txt>();
  group().add(<Line
    ref={player5_run03_adjustment}
    points={[{x: secondsToXCoordinate(13), y: 0}, {x: secondsToXCoordinate(11), y: 0}]}
    y={spacing * 2.75}
    stroke={green}
    lineWidth={8}
    lineCap={"butt"}
    endArrow={true}
    arrowSize={12}>
      <Txt
        ref={player5_run03_adjustment_label}
        fontFamily={"Config Medium"}
        fill={green}
        opacity={0.75}
        fontSize={30}
        bottom={() => {return { x: secondsToXCoordinate(12), y: 0 }}}
        text={() => `-${Math.floor(2 * 100) / 100}`}
      />
  </Line>);
  player5_run03_adjustment().opacity(0);
  yield function* () {
    yield* all(
      player5_run03_adjustment().opacity(1, 0.05).wait(0.25).to(0, 0.40),
      player5RespawnTimeLabel().opacity(1, 0.05).wait(0.25).to(RESPAWN_TIMER_OPACITY, 0.40),
    );
    player5_run03_adjustment().remove();
  }();

  const player5_total_adjustment_label = createRef<Txt>();
  const player5_total_adjustment_signal = createSignal(-2);
  player5Ref().add(<Txt
    ref={player5_total_adjustment_label}
    fontFamily={"Config Monospace"}
    fontSize={24}
    fill={'white'}
    top={player5RespawnTimeLabel().bottom().addY(10)}
    text={() => `${player5_total_adjustment_signal() > 0 ? "+" : ""}${player5_total_adjustment_signal().toFixed(1)}s`} />);


  yield* waitUntil("beginOutro");

  yield* all(
    ySpread(0, 1),
    maxRespawnTimeLine().opacity(0, 1),
    respawnTimeLine().opacity(0, 1),
    sequence(0.05, ...tickMarkers.reverse().map(tick => tick.opacity(0, 0.25))),
    delay(0.25, slideFadeOut(xAxisLabel(), 0.5, Direction.Top, 0.75, easeInCubic)),
  );
})
