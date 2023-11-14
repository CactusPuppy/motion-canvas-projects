import { Circle, Gradient, Grid, Img, Layout, Line, Node, Rect, Txt, makeScene2D } from "@motion-canvas/2d";
import { Color, DEFAULT, Direction, Vector2, all, any, createRef, createSignal, delay, easeInOutQuad, easeInQuad, easeOutQuad, easeOutSine, fadeTransition, linear, loop, loopFor, makeRef, range, sequence, useDuration, useLogger, waitFor, waitUntil } from "@motion-canvas/core";

import { Hero, HeroIcon } from "../components/HeroIcon";
import { KillfeedEntry } from "../components/KillfeedEntry";
import { Typewriter } from "../components/Typewriter";
import { slideFadeIn, slideFadeOut } from "../utils/slideFades";

import pulseBomb from "../../images/abilities/Pulse Bomb.png";
import gravitonSurge from "../../images/abilities/Graviton Surge.png";
import emphasisShake from "../utils/emphasisShake";
import { CodeBlock, insert, remove } from "@motion-canvas/2d/lib/components/CodeBlock";

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
  const scale = createSignal(1.1);


  const width = 1920;
  const height = 1080;
  const spacing = 100;
  const ySpread = createSignal(0.28);
  const initialRespawnTime = createSignal(10);

  const secondsToXCoordinate = (seconds: number) => spacing * (5 - seconds);
  const maxRespawnTimeLine = createRef<Line>();

  const tickMarkers: Txt[] = [];

  yield* fadeTransition(1);

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
  const killfeed = createRef<Layout>();
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
      >
        {`${i}`}
      </Txt>
  ));
  const secondMarkers = createRef<Layout>();
  group().add(
    <Layout ref={secondMarkers} spawner={() => secondMarkersPool.slice(0, 16)}></Layout>
  );
  tickMarkers.map(tick => tick.opacity(0));
  tickMarkers.slice(0, 11).map(tick => tick.opacity(1));

  const heroRosterHeroes = [Hero.Dva, Hero.Pharah, Hero.Bastion, Hero.Ana, Hero.Illari];

  let initialHeroIcons: HeroIcon[] = [];
  const maxSpread = 1200
  view.add(heroRosterHeroes.map((hero, i) => (
    <HeroIcon
      ref={makeRef(initialHeroIcons, i)}
      hero={hero}
      size={200}
      opacity={0}
      x={-maxSpread / 2 + i * (maxSpread / (heroRosterHeroes.length - 1))}
    />
  )));

  yield* waitUntil("revealDva");

  yield* initialHeroIcons[0].opacity(1, 0);
  yield* slideFadeIn(initialHeroIcons[0], 0.5, Direction.Bottom, 0.5);

  yield* waitUntil("revealPharah");

  yield* initialHeroIcons[1].opacity(1, 0);
  yield* all(
    initialHeroIcons[0].opacity(0.5, 0.35),
    initialHeroIcons[0].position(initialHeroIcons[0].position().addY(25), 0.35),
    slideFadeIn(initialHeroIcons[1], 0.5, Direction.Bottom, 0.5)
  );

  yield* waitUntil("revealBastion");

  yield* initialHeroIcons[2].opacity(1, 0);
  yield* all(
    initialHeroIcons[1].opacity(0.5, 0.35),
    initialHeroIcons[1].position(initialHeroIcons[1].position().addY(25), 0.35),
    slideFadeIn(initialHeroIcons[2], 0.5, Direction.Bottom, 0.5));

  yield* waitUntil("revealAna");

  yield* initialHeroIcons[3].opacity(1, 0);
  yield* all(
    initialHeroIcons[2].opacity(0.5, 0.35),
    initialHeroIcons[2].position(initialHeroIcons[2].position().addY(25), 0.35),
    slideFadeIn(initialHeroIcons[3], 0.5, Direction.Bottom, 0.5));

  yield* waitUntil("revealIllari");

  yield* initialHeroIcons[4].opacity(1, 0);
  yield* all(
    initialHeroIcons[3].opacity(0.5, 0.35),
    initialHeroIcons[3].position(initialHeroIcons[3].position().addY(25), 0.35),
    slideFadeIn(initialHeroIcons[4], 0.5, Direction.Bottom, 0.5),
  );
  yield delay(0.1, all(
    initialHeroIcons[4].opacity(0.5, 0.5),
    initialHeroIcons[4].position(initialHeroIcons[4].position().addY(25), 0.5, easeInOutQuad)));

  yield* waitUntil("hideHeroRoster");

  yield* sequence(0.07,
    ...initialHeroIcons.map(icon => slideFadeOut(icon, 0.5, Direction.Bottom, 0.5)),
  );
  initialHeroIcons.map(icon => icon.remove());

  yield* waitUntil("showKill01");

  const killfeedEntry01 = createRef<KillfeedEntry>();
  killfeed().add(<KillfeedEntry
    ref={killfeedEntry01}
    killerName="Tracer"
    killerHero={Hero.Tracer}
    victimName="Ana"
    victimHero={Hero.Ana}
    wasCrit={true}
    scale={1}
    y={-4.2 * spacing}
    opacity={0}
    abilityIcon={(<Layout cache y={-4} layout justifyContent={"center"} alignItems={"center"}>
      <Img src={pulseBomb} size={64} />
      <Rect layout={false} size={64} fill={'black'} compositeOperation={"source-in"} />
    </Layout>)}
    abilityWasUltimate={true} />);

  yield killfeedEntry01().animateIn();
  yield delay(5, killfeedEntry01().animateOut());

  const RESPAWN_TIMER_OPACITY = 0.4;

  const player1Ref = createRef<Node>();
  const player1HeroIconRef = createRef<HeroIcon>();
  const player1RespawnTime = createSignal(10);
  const player1RespawnTimeLabel = createRef<Txt>();
  group().add(
    <Node ref={player1Ref} x={() => spacing * (5 - player1RespawnTime())} y={spacing *  -2.75}>
      <HeroIcon hero={Hero.Ana} size={72} isFlat={true} ref={player1HeroIconRef} />
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

  yield* waitUntil("player1-resolveRespawnWindow");
  yield* respawnWindowColor(red, 0.25, linear);

  yield* waitUntil("player1-hideGroupRespawnWindow");
  yield* respawnWindowGroup().opacity(0, 0.5, easeInQuad);

  yield* waitUntil("player1-startRespawnRun01");
  yield* player1RespawnTime(8, useDuration("player1-set01"));

  yield* waitUntil("player2-death");

  const killfeedEntry02 = createRef<KillfeedEntry>();
  killfeed().add(<KillfeedEntry
    ref={killfeedEntry02}
    killerName="Widowmaker"
    killerHero={Hero.Widowmaker}
    victimName="Pharah"
    victimHero={Hero.Pharah}
    wasCrit={true}
    scale={1}
    y={-4.2 * spacing}
    opacity={0}
    />);

  yield killfeedEntry02().animateIn();
  yield delay(5, killfeedEntry02().animateOut());

  const player2Ref = createRef<Node>();
  const player2HeroIconRef = createRef<HeroIcon>();
  const player2RespawnTime = createSignal(10);
  const player2RespawnTimeLabel = createRef<Txt>();
  group().add(
    <Node ref={player2Ref} x={() => spacing * (5 - player2RespawnTime())} y={spacing *  -2.75/2}>
      <HeroIcon hero={Hero.Pharah} size={72} isFlat={true} ref={player2HeroIconRef} />
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
    emphasisShake(player1HeroIconRef(), 0.5, 7, 3),
    player1HeroIconRef().scale(1.25, 0.25).wait(0.2).to(1, 0.25),
    player1RespawnTimeLabel().opacity(1, 0.45).to(RESPAWN_TIMER_OPACITY, 0.25),
    delay(0.1, player1RespawnTimeLabel().scale(1.25, 0.25).wait(0.2).to(1, 0.25)),
  );

  yield* waitUntil("succeedRespawnRun02");
  yield* respawnWindowColor(green, 0.25, linear);

  yield* waitUntil("computeRespawnRun01Average-step01");

  const computation = createRef<CodeBlock>();
  const computationWrapper = createRef<Layout>();

  group().add(
    <Layout ref={computationWrapper} y={-height * 0.35}>
      <CodeBlock alignItems={"start"} language={"txt"} ref={computation} code={() => `${player1RespawnTime().toFixed(1)}s`} />
    </Layout>
  );
  yield* all(
    computation().opacity(0).opacity(1, 0.5),
    player1HeroIconRef().scale(1.25, 0.25).wait(0.2).to(1, 0.25),
    player1RespawnTimeLabel().opacity(1, 0.5).to(RESPAWN_TIMER_OPACITY, 0.25),
    delay(0.1, player1RespawnTimeLabel().scale(1.25, 0.25).wait(0.2).to(1, 0.25)),
    emphasisShake(player1HeroIconRef(), 0.5, 7, 3)
  );

  yield* waitUntil("computeRespawnRun01Average-step02");

  yield* all(
    computation().edit(0.5)`${player1RespawnTime().toFixed(1)}s${insert(` + ${player2RespawnTime().toFixed(1)}s`)}`,
    player2HeroIconRef().scale(1.25, 0.25).wait(0.2).to(1, 0.25),
    player2RespawnTimeLabel().opacity(1, 0.5).to(RESPAWN_TIMER_OPACITY, 0.25),
    delay(0.1, player2RespawnTimeLabel().scale(1.25, 0.25).wait(0.2).to(1, 0.25)),
    emphasisShake(player2HeroIconRef())
  );

  yield* waitUntil("computeRespawnRun01Average-step02-sum");
  yield* computation().edit(0.5)`${player1RespawnTime().toFixed(1)}s + ${player2RespawnTime().toFixed(1)}s${insert(` = 18.0s`)}`

  yield* waitUntil("computeRespawnRun01Average-emphasizeNumPlayers");
  yield* all(
    emphasisShake(player1HeroIconRef()),
    emphasisShake(player2HeroIconRef()),
  );

  yield* waitUntil("computeRespawnRun01Average-step03");

  yield* all(
    computation().edit(1)`${remove(`${player1RespawnTime().toFixed(1)}s + ${player2RespawnTime().toFixed(1)}s = `)}18.0s${insert(` / 2 players`)}`,
  );

  yield* waitUntil("computeRespawnRun01Average-step03-divide");
  yield* computation().edit(1)`18.0s / 2 players${insert(` = 9.0s / player`)}`;

  yield* waitUntil("showRespawnRun01Average");

  const respawnRunAverageLine = createRef<Line>();
  group().insert(
    <Line
      ref={respawnRunAverageLine}
      stroke={"#5f5a"}
      lineWidth={6}
      lineCap="round"
      x={spacing * -4}
      lineDash={[10, 10]}
      points={() => [new Vector2(0, -height * ySpread()), new Vector2(0, height * ySpread())]} />,
    0
  );
  yield* all(
    respawnRunAverageLine().opacity(0).opacity(1, 1.5, easeOutSine),
    computation().edit(1, false)`${remove(`18.0s / 2 players = `)}9.0s${remove(` / player`)}`,
    computation().selection(DEFAULT, 1),
    computationWrapper().bottom(new Vector2(spacing * -4, -height * ySpread()).addY(-40), 1),
  );

  yield* waitUntil("groupRespawnRun01");

  yield* all(
    player1RespawnTime(9, 1),
    player2RespawnTime(9, 1)
  );

  yield* waitFor(0.5);

  yield all(
    respawnRunAverageLine().opacity(0, 0.5, easeOutQuad),
    respawnWindowGroup().opacity(0, 0.5, easeInQuad),
    computationWrapper().opacity(0, 0.5, easeInQuad),
  );

  yield* waitUntil("respawnRun01-showPlayer1Adjustment");
  const player1_run01_adjustment = createRef<Line>();
  const player1_run01_adjustment_signal = createSignal(0);
  const player1_run01_adjustment_label = createRef<Txt>();
  group().add(<Line
    ref={player1_run01_adjustment}
    points={[{x: secondsToXCoordinate(8), y: 0}, {x: secondsToXCoordinate(9), y: 0}]}
    y={spacing * -2.75}
    end={player1_run01_adjustment_signal}
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
        bottom={() => {return { x: secondsToXCoordinate(8 + player1_run01_adjustment_signal() * 0.5), y: 0 }}}
        text={() => `+${Math.floor(player1_run01_adjustment_signal() * 100) / 100}`}
      />
    </Line>);
  const player1_total_adjustment_label = createRef<Txt>();
  const player1_total_adjustment_signal = createSignal(0);
  player1Ref().add(<Txt
    ref={player1_total_adjustment_label}
    fontFamily={"Config Monospace"}
    fontSize={24}
    fill={'white'}
    top={player1RespawnTimeLabel().bottom().addY(10)}
    text={() => `${player1_total_adjustment_signal() > 0 ? "+" : "-"}${player1_total_adjustment_signal().toFixed(1)}s`} />);
  yield all(
    player1RespawnTimeLabel().opacity(0.25, 0.25),
    player1HeroIconRef().opacity(0.5, 0.25),
    player1_run01_adjustment().opacity(0).opacity(1, 0.25),
    player1_total_adjustment_label().opacity(0).opacity(1, 0.25));
  yield* all(
    player1_run01_adjustment_signal(1, 0.5),
    player1_total_adjustment_signal(1, 0.5),);

  yield* waitUntil("respawnRun01-showPlayer2Adjustment");
  const player2_run01_adjustment = createRef<Line>();
  const player2_run01_adjustment_signal = createSignal(0);
  const player2_run01_adjustment_label = createRef<Txt>();
  group().add(<Line
    ref={player2_run01_adjustment}
    points={[{x: secondsToXCoordinate(10), y: 0}, {x: secondsToXCoordinate(9), y: 0}]}
    y={spacing * -2.75/2}
    end={player2_run01_adjustment_signal}
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
        bottom={() => {return { x: secondsToXCoordinate(10 - player2_run01_adjustment_signal() * 0.5), y: 0 }}}
        text={() => `-${Math.floor(player2_run01_adjustment_signal() * 100) / 100}`}
      />
    </Line>);
  const player2_total_adjustment_label = createRef<Txt>();
  const player2_total_adjustment_signal = createSignal(0);
  player2Ref().add(<Txt
    ref={player2_total_adjustment_label}
    fontFamily={"Config Monospace"}
    fontSize={24}
    fill={'white'}
    top={player2RespawnTimeLabel().bottom().addY(10)}
    text={() => `${player2_total_adjustment_signal() > 0 ? "+" : ""}${player2_total_adjustment_signal().toFixed(1)}s`} />);
  yield all(
    player2RespawnTimeLabel().opacity(0.25, 0.25),
    player2HeroIconRef().opacity(0.5, 0.25),
    player2_run01_adjustment().opacity(0).opacity(1, 0.25),
    player2_total_adjustment_label().opacity(0).opacity(1, 0.25));
  yield* all(player2_run01_adjustment_signal(1, 0.5), player2_total_adjustment_signal(-1, 0.5));

  yield* waitUntil("respawnRun01-hidePlayerAdjustments");
  yield* all(
    player1_run01_adjustment().opacity(0, 0.5),
    player2_run01_adjustment().opacity(0, 0.5),
    player1_total_adjustment_label().opacity(0.8, 0.5),
    player2_total_adjustment_label().opacity(0.8, 0.5),
    player1HeroIconRef().opacity(1, 0.5),
    player2HeroIconRef().opacity(1, 0.5),
    player1RespawnTimeLabel().opacity(RESPAWN_TIMER_OPACITY, 0.5),
    player2RespawnTimeLabel().opacity(RESPAWN_TIMER_OPACITY, 0.5),
  );

  yield* waitUntil("preKill03-timeAdvance");
  yield all(
    player1RespawnTime(7, 2),
    player2RespawnTime(7, 2),
  );

  yield* waitUntil("showKill03");
  const killfeedEntry03 = createRef<KillfeedEntry>();
  killfeed().add(<KillfeedEntry
    ref={killfeedEntry03}
    killerName="Kiriko"
    killerHero={Hero.Kiriko}
    victimName="Bastion"
    victimHero={Hero.Bastion}
    wasCrit={true}
    y={-4.2 * spacing}
    opacity={0}
  />);

  yield killfeedEntry03().animateIn();
  yield delay(5, killfeedEntry03().animateOut());

  const player3Ref = createRef<Node>();
  const player3HeroIconRef = createRef<HeroIcon>();
  const player3RespawnTime = createSignal(10);
  const player3RespawnTimeLabel = createRef<Txt>();
  group().add(
    <Node ref={player3Ref} x={() => spacing * (5 - player3RespawnTime())} y={0}>
      <HeroIcon hero={Hero.Bastion} size={72} isFlat={true} ref={player3HeroIconRef} />
      <Txt text={() => player3RespawnTime().toFixed(1)} x={92} fill="#fff" opacity={RESPAWN_TIMER_OPACITY} fontFamily={'Config Monospace'} fontSize={48} ref={player3RespawnTimeLabel} />
    </Node>);

  yield player3Ref().opacity(0).opacity(1, 0.5);
  yield* player3HeroIconRef().scale(1.5, 0.25, easeOutQuad);
  yield* player3HeroIconRef().scale(1, 0.25);

  yield* waitUntil("respawnRun03-emphasizeExistingRespawnTimes");
  yield* all(
    player1RespawnTimeLabel().opacity(1, 0.45).to(RESPAWN_TIMER_OPACITY, 0.25),
    delay(0.1, player1RespawnTimeLabel().scale(1.25, 0.25).wait(0.2).to(1, 0.25)),
    player2RespawnTimeLabel().opacity(1, 0.45).to(RESPAWN_TIMER_OPACITY, 0.25),
    delay(0.1, player2RespawnTimeLabel().scale(1.25, 0.25).wait(0.2).to(1, 0.25)),
  );

  yield* waitUntil("respawnRun03-emphasizeNewRespawnTime");
  yield* all(
    player3HeroIconRef().scale(1.25, 0.25).wait(0.2).to(1, 0.25),
    emphasisShake(player3HeroIconRef()),
    player3RespawnTimeLabel().opacity(1, 0.45).to(RESPAWN_TIMER_OPACITY, 0.25),
    delay(0.1, player3RespawnTimeLabel().scale(1.25, 0.25).wait(0.2).to(1, 0.25)),
  )

  yield* waitUntil("player3-showGroupRespawnWindow");

  respawnWindowColor(yellow);
  respawnWindowEdge(10);
  yield* all(
    respawnWindowGroup().opacity(1, 0.5, easeOutQuad),
    respawnWindowEdge(initialRespawnTime() - 5, 1.5)
  );

  yield* waitUntil("emphasize-respawn-group-03");
  yield* all(
    emphasisShake(player1HeroIconRef()),
    emphasisShake(player2HeroIconRef()),
    player1HeroIconRef().scale(1.25, 0.25).wait(0.2).to(1, 0.25),
    player1RespawnTimeLabel().opacity(1, 0.45).to(RESPAWN_TIMER_OPACITY, 0.25),
    delay(0.1, player1RespawnTimeLabel().scale(1.25, 0.25).wait(0.2).to(1, 0.25)),
    player2HeroIconRef().scale(1.25, 0.25).wait(0.2).to(1, 0.25),
    player2RespawnTimeLabel().opacity(1, 0.45).to(RESPAWN_TIMER_OPACITY, 0.25),
    delay(0.1, player2RespawnTimeLabel().scale(1.25, 0.25).wait(0.2).to(1, 0.25)),
  );

  yield* waitUntil("succeedRespawnRun03");
  yield* respawnWindowColor(green, 0.25, linear);

  yield* waitUntil("computeRespawnRun03Average-step01");
  computationWrapper().position({x: 0, y: -height * 0.35});
  computation().code(`${player3RespawnTime().toFixed(1)}s`);
  yield* all(
    computationWrapper().opacity(1, 0.5),
    emphasisShake(player3HeroIconRef()),
    player3HeroIconRef().scale(1.25, 0.25).wait(0.2).to(1, 0.25),
    player3RespawnTimeLabel().opacity(1, 0.45).to(RESPAWN_TIMER_OPACITY, 0.25),
    delay(0.1, player3RespawnTimeLabel().scale(1.25, 0.25).wait(0.2).to(1, 0.25)),
  );

  yield* waitUntil("computeRespawnRun03Average-step02");
  yield* all(
    computation().edit(0.25)`${player3RespawnTime().toFixed(1)}s${insert(` + ${player1RespawnTime().toFixed(1)}s`)}`,
    emphasisShake(player1HeroIconRef(), 0.5),
    player1HeroIconRef().scale(1.25, 0.25).to(1, 0.25),
    player1RespawnTimeLabel().opacity(1, 0.25).to(RESPAWN_TIMER_OPACITY, 0.25),
    delay(0.1, player1RespawnTimeLabel().scale(1.25, 0.25).to(1, 0.25)),
  );

  yield* waitUntil("computeRespawnRun03Average-step03");
  yield* all(
    computation().edit(0.25)`${player3RespawnTime().toFixed(1)}s + ${player1RespawnTime().toFixed(1)}s${insert(` + ${player2RespawnTime().toFixed(1)}s`)}`,
    emphasisShake(player2HeroIconRef(), 0.5),
    player2HeroIconRef().scale(1.25, 0.25).to(1, 0.25),
    player2RespawnTimeLabel().opacity(1, 0.45).to(RESPAWN_TIMER_OPACITY, 0.25),
    delay(0.1, player2RespawnTimeLabel().scale(1.25, 0.25).to(1, 0.25)),
  );

  yield* waitUntil("computeRespawnRun03Average-step04");
  yield* computation().edit(0.5)`${player3RespawnTime().toFixed(1)}s + ${player1RespawnTime().toFixed(1)}s + ${player2RespawnTime().toFixed(1)}s${insert(` = 24.0s`)}`;

  yield* waitUntil("computeRespawnRun03Average-step05");
  yield* all(
    computation().edit(0.75)`${remove(`${player3RespawnTime().toFixed(1)}s + ${player1RespawnTime().toFixed(1)}s + ${player2RespawnTime().toFixed(1)}s = `)}24.0s${insert(` / 3 players`)}`,
    emphasisShake(player1HeroIconRef()),
    emphasisShake(player2HeroIconRef()),
    emphasisShake(player3HeroIconRef()),
  );

  yield* waitUntil("computeRespawnRun03Average-step06");
  yield* computation().edit(1)`24.0s / 3 players${insert(` = 8.0s / player`)}`;

  yield* waitUntil("computeRespawnRun03Average-step07");
  respawnRunAverageLine().position({x: secondsToXCoordinate(8), y: 0});
  yield* all(
    computation().edit(1, false)`${remove(`24.0s / 3 players = `)}8.0s${remove(` / player`)}`,
    computation().selection(DEFAULT, 1),
    respawnRunAverageLine().opacity(1, 0.5, easeOutSine),
    computationWrapper().bottom(new Vector2(secondsToXCoordinate(8), -height * ySpread()).addY(-40), 1)
  );

  yield* waitUntil("groupRespawnRun02");

  const player1_run02_adjustment = createRef<Line>();
  const player1_run02_adjustment_signal = createSignal(0);
  const player1_run02_adjustment_label = createRef<Txt>();
  const player2_run02_adjustment = createRef<Line>();
  const player2_run02_adjustment_signal = createSignal(0);
  const player2_run02_adjustment_label = createRef<Txt>();
  const player3_run02_adjustment = createRef<Line>();
  const player3_run02_adjustment_signal = createSignal(0);
  const player3_run02_adjustment_label = createRef<Txt>();

  group().add(<Line
    ref={player1_run02_adjustment}
    points={[{x: secondsToXCoordinate(7), y: 0}, {x: secondsToXCoordinate(8), y: 0}]}
    y={spacing * -2.75}
    end={player1_run02_adjustment_signal}
    stroke={red.darken(0.25)}
    shadowColor={red.darken()}
    shadowBlur={2}
    lineWidth={8}
    lineCap={"butt"}
    endArrow={true}
    arrowSize={12}
  >
    <Txt
      ref={player1_run02_adjustment_label}
      fontFamily={"Config Medium"}
      fill={red}
      shadowColor={red.darken()}
      shadowBlur={2}
      fontSize={30}
      bottom={() => {return { x: secondsToXCoordinate(7 + player1_run02_adjustment_signal() * 0.5), y: 0 }}}
      text={() => `+${Math.floor(player1_run02_adjustment_signal() * 100) / 100}`}
    />
  </Line>);
  group().add(<Line
    ref={player2_run02_adjustment}
    points={[{x: secondsToXCoordinate(7), y: 0}, {x: secondsToXCoordinate(8), y: 0}]}
    y={spacing * -2.75/2}
    end={player2_run02_adjustment_signal}
    stroke={red.darken(0.25)}
    shadowColor={red.darken()}
    shadowBlur={2}
    lineWidth={8}
    lineCap={"butt"}
    endArrow={true}
    arrowSize={12}
  >
    <Txt
      ref={player2_run02_adjustment_label}
      fontFamily={"Config Medium"}
      fill={red}
      shadowColor={red.darken()}
      shadowBlur={2}
      fontSize={30}
      bottom={() => {return { x: secondsToXCoordinate(7 + player2_run02_adjustment_signal() * 0.5), y: 0 }}}
      text={() => `+${Math.floor(player2_run02_adjustment_signal() * 100) / 100}`}
    />
  </Line>);
  group().add(<Line
    ref={player3_run02_adjustment}
    points={[{x: secondsToXCoordinate(10), y: 0}, {x: secondsToXCoordinate(8), y: 0}]}
    y={0}
    end={() => player3_run02_adjustment_signal() * -0.5}
    stroke={green.darken(0.25)}
    shadowColor={green.darken()}
    shadowBlur={2}
    lineWidth={8}
    lineCap={"butt"}
    endArrow={true}
    arrowSize={12}
  >
    <Txt
      ref={player3_run02_adjustment_label}
      fontFamily={"Config Medium"}
      fill={green}
      shadowColor={green.darken()}
      shadowBlur={2}
      fontSize={30}
      bottom={() => {return { x: secondsToXCoordinate(10 + player3_run02_adjustment_signal() * 0.5), y: 0 }}}
      text={() => `${Math.floor(player3_run02_adjustment_signal() * 100) / 100}`}
    />
  </Line>);

  const player3_total_adjustment_label = createRef<Txt>();
  const player3_total_adjustment_signal = createSignal(0);
  player3Ref().add(<Txt
    ref={player3_total_adjustment_label}
    fontFamily={"Config Monospace"}
    fontSize={24}
    fill={'white'}
    opacity={0.8}
    top={player3RespawnTimeLabel().bottom().addY(10)}
    text={() => `${player3_total_adjustment_signal() > 0 ? "+" : ""}${player3_total_adjustment_signal().toFixed(1)}s`}
  />);
  yield* all(
    player1RespawnTime(8, 1),
    player2RespawnTime(8, 1),
    player3RespawnTime(8, 1),

    player1_run02_adjustment().opacity(0).opacity(1, 0.5),
    player1HeroIconRef().opacity(0.5, 0.5),
    player1RespawnTimeLabel().opacity(0.25, 0.5),
    player1_run02_adjustment_signal(1, 1),
    player1_total_adjustment_signal(2, 1),

    player2_run02_adjustment().opacity(0).opacity(1, 0.5),
    player2HeroIconRef().opacity(0.5, 0.5),
    player2RespawnTimeLabel().opacity(0.25, 0.5),
    player2_run02_adjustment_signal(1, 1),
    player2_total_adjustment_signal(0, 1),

    player3_run02_adjustment().opacity(0).opacity(1, 0.5),
    player3HeroIconRef().opacity(0.5, 0.5),
    player3RespawnTimeLabel().opacity(0.25, 0.5),
    player3_run02_adjustment_signal(-2, 1),
    player3_total_adjustment_label().opacity(0).opacity(0.8, 0.25),
    player3_total_adjustment_signal(-2, 1),
  );
  yield* waitFor(0.5);
  yield all(
    respawnRunAverageLine().opacity(0, 0.5, easeOutQuad),
    respawnWindowGroup().opacity(0, 0.5, easeInQuad),
    computationWrapper().opacity(0, 0.5, easeInQuad),

    player1_run02_adjustment().opacity(0, 0.5),
    player2_run02_adjustment().opacity(0, 0.5),
    player3_run02_adjustment().opacity(0, 0.5),

    player1HeroIconRef().opacity(1, 0.5),
    player1RespawnTimeLabel().opacity(RESPAWN_TIMER_OPACITY, 0.5),

    player2HeroIconRef().opacity(1, 0.5),
    player2RespawnTimeLabel().opacity(RESPAWN_TIMER_OPACITY, 0.5),

    player3HeroIconRef().opacity(1, 0.5),
    player3RespawnTimeLabel().opacity(RESPAWN_TIMER_OPACITY, 0.5),
  );

  yield* waitUntil("preKill04-timeAdvance");
  const preKill03TimeAdvanceDuration = useDuration("preKill04-timeAdvanceDuration");
  yield* all(
    player1RespawnTime(7, preKill03TimeAdvanceDuration),
    player2RespawnTime(7, preKill03TimeAdvanceDuration),
    player3RespawnTime(7, preKill03TimeAdvanceDuration),
  );

  yield* waitUntil("emphasizeMaxRespawnTime");
  yield* all(
    maxRespawnTimeLine().scale(1.1, 0.25).wait(0.75).to(1, 0.25),
    loop(3, (i) => maxRespawnTimeLine().opacity(0.4 + 0.2 * i, 0.075).to(1, 0.075)),
  );

  yield* waitUntil("pushForwardSpawn");
  const pushForwardMax = createSignal(2);

  const pushForwardSegment = createRef<Node>();

  group().add(
    <Node ref={pushForwardSegment} zIndex={-5} cache>
      <Rect
        fill={green}
        opacity={.4}
        size={() => new Vector2(spacing * Math.max(Math.min(initialRespawnTime() - 10, pushForwardMax()), 0), ySpread() * height * 2)}
        right={() => new Vector2(secondsToXCoordinate(10), 0)}
        // compositeOperation={"source-out"}
        />
      <Txt
        fill={"#fff"}
        opacity={0.6}
        fontSize={36}
        x={secondsToXCoordinate(11)}
        fontFamily={'Config Medium'}
        compositeOperation={"source-in"}
        rotation={-90}>
        Push Forward Spawn
      </Txt>
      <Rect
        fill={green}
        zIndex={1}
        opacity={.4}
        size={() => new Vector2(spacing * Math.max(Math.min(initialRespawnTime() - 10, pushForwardMax()), 0), ySpread() * height * 2)}
        right={() => new Vector2(secondsToXCoordinate(10), 0)}
        />
    </Node>);

  yield* all(
    delay(0.2, scale(0.9, 0.8)),
    delay(0.2, group().position.x(60, 0.8)),
    initialRespawnTime(12, 1),
    delay(.4, sequence(0.2, ...tickMarkers.slice(11, 13).map(tick => tick.opacity(0).opacity(1, 0.3)))),
  );

  yield* waitUntil("overtime");

  // Add rectangle showing additional time in respawn
  const overtimeSegment = createRef<Node>();
  group().add(
    <Node ref={overtimeSegment} zIndex={-5} cache>
      <Rect
        fill={orange}
        opacity={.4}
        size={() => new Vector2(spacing * Math.min(initialRespawnTime() - (10 + pushForwardMax()), 3), ySpread() * height * 2)}
        right={() => new Vector2(secondsToXCoordinate((10 + pushForwardMax())), 0)}
        // compositeOperation={"source-out"}
        />
      <Txt
        fill={"#fff"}
        opacity={0.6}
        fontSize={36}
        x={() => secondsToXCoordinate((10 + pushForwardMax()) + 1.5)}
        fontFamily={'Config Medium'}
        compositeOperation={"source-in"}
        rotation={-90}>
        Overtime
      </Txt>
      <Rect
        fill={orange}
        zIndex={1}
        opacity={.4}
        size={() => new Vector2(spacing * Math.min(initialRespawnTime() - (10 + pushForwardMax()), 3), ySpread() * height * 2)}
        right={() => new Vector2(secondsToXCoordinate((10 + pushForwardMax())), 0)}
          />
    </Node>);

  yield* all(
    delay(0.2, scale(0.85, 1)),
    delay(0.2, group().position.x(100, 1)),
    initialRespawnTime(15, 1),
    delay(.4, sequence(0.2, ...tickMarkers.slice(13, 16).map(tick => tick.opacity(0).opacity(1, 0.3)))),
  );



  yield* waitUntil("normalSpawn");

  yield* all(
    delay(0.2, scale(1, 1.3)),
    group().position({x: 1.5 * spacing, y: 0}, 1.3),
    initialRespawnTime(13, 1.3),
    pushForwardMax(0, 1.3),
    delay(0.4, sequence(0.1, ...tickMarkers.slice(14, 16).reverse().map(tick => tick.opacity(0, 0.3)))),
  );

  // overtimeSegment().remove();
  pushForwardSegment().remove();

  yield* waitUntil("showKill04");

  const killfeedEntry04 = createRef<KillfeedEntry>();
  killfeed().add(<KillfeedEntry
    ref={killfeedEntry04}
    killerName="Zenyatta"
    killerHero={Hero.Zenyatta}
    victimName="Illari"
    victimHero={Hero.Illari}
    y={-4.2 * spacing}
    opacity={0}
  />);

  yield all(
    killfeedEntry04().animateIn(),
    delay(5, killfeedEntry04().animateOut()),
  );

  const player4Ref = createRef<Node>();
  const player4HeroIconRef = createRef<HeroIcon>();
  const player4RespawnTime = createSignal(13);
  const player4RespawnTimeLabel = createRef<Txt>();
  group().add(
    <Node ref={player4Ref} x={() => spacing * (5 - player4RespawnTime())} y={spacing *  2.75/2}>
      <HeroIcon hero={Hero.Illari} size={72} isFlat={true} ref={player4HeroIconRef} />
      <Txt text={() => player4RespawnTime().toFixed(1)} x={92} fill="#fff" opacity={RESPAWN_TIMER_OPACITY} fontFamily={'Config Monospace'} fontSize={48} ref={player4RespawnTimeLabel} />
    </Node>);

  yield player4Ref().opacity(0).opacity(1, 0.5);
  yield* player4HeroIconRef().scale(1.5, 0.25, easeOutQuad).to(1, 0.25);

  yield* waitUntil("player04-emphasizeRespawnTime");
  yield* all(
    emphasisShake(player4HeroIconRef()),
    player4HeroIconRef().scale(1.25, 0.25).wait(0.2).to(1, 0.25),
    player4RespawnTimeLabel().opacity(1, 0.45).to(RESPAWN_TIMER_OPACITY, 0.25),
    delay(0.1, player4RespawnTimeLabel().scale(1.25, 0.25).wait(0.2).to(1, 0.25)),
  );

  yield* waitUntil("respawnRun04-emphasizeOvertime");
  yield* all(
    // overtimeSegment().scale(1.1, 0.25).wait(0.2).to(1, 0.25),
    loop(3, (i) => overtimeSegment().opacity(0.4 + 0.2 * i, 0.075).to(1, 0.075)),
  );

  yield* waitUntil("player4-showGroupRespawnWindow");

  respawnWindowColor(yellow);
  respawnWindowEdge(13);
  yield* all(
    overtimeSegment().opacity(0, 0.5),
    respawnWindowGroup().opacity(1, 0.5, easeOutQuad),
    respawnWindowEdge(initialRespawnTime() - 5, 1.5)
  );

  yield* waitUntil("failRespawnRun04");
  yield* respawnWindowColor(red, 0.25, linear);

  yield* waitUntil("hideRespawnRun04");
  yield* all(
    respawnWindowGroup().opacity(0, 0.5, easeInQuad),
    computationWrapper().opacity(0, 0.5, easeInQuad),
  );

  yield* waitUntil("preKill05-timeAdvance");
  const preKill05TimeAdvanceDuration = useDuration("preKill05-timeAdvanceDuration");
  yield* all(
    player1RespawnTime(3, preKill05TimeAdvanceDuration),
    player2RespawnTime(3, preKill05TimeAdvanceDuration),
    player3RespawnTime(3, preKill05TimeAdvanceDuration),
    player4RespawnTime(9, preKill05TimeAdvanceDuration),
  );

  yield* waitUntil("showKill05");
  const killfeedEntry05 = createRef<KillfeedEntry>();
  killfeed().add(<KillfeedEntry
    ref={killfeedEntry05}
    killerName="Zarya"
    killerHero={Hero.Zarya}
    victimName="D.Va"
    victimHero={Hero.Dva}
    abilityIcon={(<Layout cache y={-4} layout justifyContent={"center"} alignItems={"center"}>
      <Img src={gravitonSurge} size={64} />
      <Rect layout={false} size={64} fill={'black'} compositeOperation={"source-in"} />
    </Layout>)}
    abilityWasUltimate={true}
    y={-4.2 * spacing}
    opacity={0}
  />);

  yield all(
    killfeedEntry05().animateIn(),
    delay(5, killfeedEntry05().animateOut()),
  );

  const player5Ref = createRef<Node>();
  const player5HeroIconRef = createRef<HeroIcon>();
  const player5RespawnTime = createSignal(13);
  const player5RespawnTimeLabel = createRef<Txt>();

  group().add(
    <Node ref={player5Ref} x={() => spacing * (5 - player5RespawnTime())} y={spacing *  2.75}>
      <HeroIcon hero={Hero.Dva} size={72} isFlat={true} ref={player5HeroIconRef} />
      <Txt text={() => player5RespawnTime().toFixed(1)} x={92} fill="#fff" opacity={RESPAWN_TIMER_OPACITY} fontFamily={'Config Monospace'} fontSize={48} ref={player5RespawnTimeLabel} />
    </Node>);

  yield* all(
    player5Ref().opacity(0).opacity(1, 0.5),
    player5HeroIconRef().scale(1.5, 0.25, easeOutQuad).to(1, 0.25),
  );

  yield* waitUntil("player5-showGroupRespawnWindow");

  respawnWindowColor(yellow);
  respawnWindowEdge(13);
  yield* all(
    respawnWindowGroup().opacity(1, 0.5, easeOutQuad),
    respawnWindowEdge(initialRespawnTime() - 5, 1.5)
  );

  yield* waitUntil("player05-emphasizeRespawnTime");
  yield* all(
    emphasisShake(player4HeroIconRef()),
    player4HeroIconRef().scale(1.25, 0.25).wait(0.2).to(1, 0.25),
    player4RespawnTimeLabel().opacity(1, 0.45).to(RESPAWN_TIMER_OPACITY, 0.25),
    delay(0.1, player4RespawnTimeLabel().scale(1.25, 0.25).wait(0.2).to(1, 0.25)),
  );

  yield* waitUntil("successRespawnRun05");
  yield* respawnWindowColor(green, 0.25, linear);

  yield* waitUntil("computeRespawnRun05Average-step01");
  computationWrapper().position({x: secondsToXCoordinate(6.5), y: -height * 0.35});
  computation().code(`${player5RespawnTime().toFixed(1)}s`);

  yield* all(
    computationWrapper().opacity(1, 0.5),
    emphasisShake(player5HeroIconRef()),
    player5HeroIconRef().scale(1.25, 0.25).wait(0.2).to(1, 0.25),
    player5RespawnTimeLabel().opacity(1, 0.45).to(RESPAWN_TIMER_OPACITY, 0.25),
    delay(0.1, player5RespawnTimeLabel().scale(1.25, 0.25).wait(0.2).to(1, 0.25)),
  );

  yield* waitUntil("computeRespawnRun05Average-step02");
  yield* all(
    computation().edit(0.25)`${player5RespawnTime().toFixed(1)}s${insert(` + ${player4RespawnTime().toFixed(1)}s`)}`,
    emphasisShake(player4HeroIconRef(), 0.5),
    player4HeroIconRef().scale(1.25, 0.25).to(1, 0.25),
    player4RespawnTimeLabel().opacity(1, 0.25).to(RESPAWN_TIMER_OPACITY, 0.25),
    delay(0.1, player4RespawnTimeLabel().scale(1.25, 0.25).to(1, 0.25)),
  );

  yield* waitUntil("computeRespawnRun05Average-step03");
  yield* computation().edit(0.5)`${player5RespawnTime().toFixed(1)}s + ${player4RespawnTime().toFixed(1)}s${insert(` = 22.0s`)}`;

  yield* waitUntil("computeRespawnRun05Average-step04");
  yield* all(
    computation().edit(0.75)`${remove(`${player5RespawnTime().toFixed(1)}s + ${player4RespawnTime().toFixed(1)}s = `)}22.0s${insert(` / 2 players`)}`,
    emphasisShake(player4HeroIconRef()),
    emphasisShake(player5HeroIconRef()),
  );

  yield* waitUntil("computeRespawnRun05Average-step05");
  yield* computation().edit(1)`22.0s / 2 players${insert(` = 11.0s / player`)}`;

  yield* waitUntil("computeRespawnRun05Average-step06");
  respawnRunAverageLine().position({x: secondsToXCoordinate(11), y: 0});
  yield* all(
    computation().edit(1, false)`${remove(`22.0s / 2 players = `)}11.0s${remove(` / player`)}`,
    computation().selection(DEFAULT, 1),
    respawnRunAverageLine().opacity(1, 0.5, easeOutSine),
    computationWrapper().bottom(new Vector2(secondsToXCoordinate(11), -height * ySpread()).addY(-40), 1)
  );

  yield* waitUntil("groupRespawnRun05");

  const player4_run05_adjustment = createRef<Line>();
  const player4_run05_adjustment_signal = createSignal(0);
  const player4_run05_adjustment_label = createRef<Txt>();
  const player5_run05_adjustment = createRef<Line>();
  const player5_run05_adjustment_signal = createSignal(0);
  const player5_run05_adjustment_label = createRef<Txt>();

  group().add(<Line
    ref={player4_run05_adjustment}
    points={[{x: secondsToXCoordinate(9), y: 0}, {x: secondsToXCoordinate(11), y: 0}]}
    y={spacing * 2.75 / 2}
    end={() => player4_run05_adjustment_signal() * 0.5}
    stroke={red.darken(0.25)}
    shadowColor={red.darken()}
    shadowBlur={2}
    lineWidth={8}
    lineCap={"butt"}
    endArrow={true}
    arrowSize={12}
  >
    <Txt
      ref={player4_run05_adjustment_label}
      fontFamily={"Config Medium"}
      fill={red}
      shadowColor={red.darken()}
      shadowBlur={2}
      fontSize={30}
      bottom={() => {return { x: secondsToXCoordinate(9 + player4_run05_adjustment_signal() * 0.5), y: 0 }}}
      text={() => `+${Math.floor(player4_run05_adjustment_signal() * 100) / 100}`}
    />
  </Line>);
  group().add(<Line
    ref={player5_run05_adjustment}
    points={[{x: secondsToXCoordinate(13), y: 0}, {x: secondsToXCoordinate(11), y: 0}]}
    y={spacing * 2.75}
    end={() => player5_run05_adjustment_signal() * -0.5}
    stroke={green.darken(0.25)}
    shadowColor={red.darken()}
    shadowBlur={2}
    lineWidth={8}
    lineCap={"butt"}
    endArrow={true}
    arrowSize={12}
  >
    <Txt
      ref={player5_run05_adjustment_label}
      fontFamily={"Config Medium"}
      fill={green}
      shadowColor={green.darken()}
      shadowBlur={2}
      fontSize={30}
      bottom={() => {return { x: secondsToXCoordinate(13 + player5_run05_adjustment_signal() * 0.5), y: 0 }}}
      text={() => `${Math.floor(player5_run05_adjustment_signal() * 100) / 100}`}
    />
  </Line>);

  const player4_total_adjustment_label = createRef<Txt>();
  const player4_total_adjustment_signal = createSignal(0);
  player4Ref().add(<Txt
    ref={player4_total_adjustment_label}
    fontFamily={"Config Monospace"}
    fontSize={24}
    fill={'white'}
    top={player4RespawnTimeLabel().bottom().addY(10)}
    text={() => `${player4_total_adjustment_signal() > 0 ? "+" : ""}${player4_total_adjustment_signal().toFixed(1)}s`}
  />);

  const player5_total_adjustment_label = createRef<Txt>();
  const player5_total_adjustment_signal = createSignal(0);
  player5Ref().add(<Txt
    ref={player5_total_adjustment_label}
    fontFamily={"Config Monospace"}
    fontSize={24}
    fill={'white'}
    top={player5RespawnTimeLabel().bottom().addY(10)}
    text={() => `${player5_total_adjustment_signal() > 0 ? "+" : ""}${player5_total_adjustment_signal().toFixed(1)}s`}
  />);

  yield* all(
    player4RespawnTime(11, 1),
    player5RespawnTime(11, 1),

    player4_run05_adjustment().opacity(0).opacity(1, 0.5),
    player4HeroIconRef().opacity(0.5, 0.5),
    player4RespawnTimeLabel().opacity(0.25, 0.5),
    player4_run05_adjustment_signal(2, 1),
    player4_total_adjustment_label().opacity(0).opacity(0.8, 0.25),
    player4_total_adjustment_signal(2, 1),

    player5_run05_adjustment().opacity(0).opacity(1, 0.5),
    player5HeroIconRef().opacity(0.5, 0.5),
    player5RespawnTimeLabel().opacity(0.25, 0.5),
    player5_run05_adjustment_signal(-2, 1),
    player5_total_adjustment_label().opacity(0).opacity(0.8, 0.25),
    player5_total_adjustment_signal(-2, 1),
  );
  yield* waitFor(0.5);
  yield all(
    respawnRunAverageLine().opacity(0, 0.5, easeOutQuad),
    respawnWindowGroup().opacity(0, 0.5, easeInQuad),
    computationWrapper().opacity(0, 0.5, easeInQuad),

    player4_run05_adjustment().opacity(0, 0.5),
    player5_run05_adjustment().opacity(0, 0.5),

    player4HeroIconRef().opacity(1, 0.5),
    player4RespawnTimeLabel().opacity(RESPAWN_TIMER_OPACITY, 0.5),

    player5HeroIconRef().opacity(1, 0.5),
    player5RespawnTimeLabel().opacity(RESPAWN_TIMER_OPACITY, 0.5),
  );

  yield* waitUntil("resumeAndFadeOut");

  yield* any(
    player1RespawnTime(0, 3, linear),
    player1Ref().opacity(0, 1.25, linear),

    player2RespawnTime(0, 3, linear),
    player2Ref().opacity(0, 1.25, linear),

    player3RespawnTime(0, 3, linear),
    player3Ref().opacity(0, 1.25, linear),

    player4RespawnTime(0, 11, linear),
    player4Ref().opacity(0, 1.25, linear),

    player5RespawnTime(0, 11, linear),
    player5Ref().opacity(0, 1.25, linear),
  );
});
