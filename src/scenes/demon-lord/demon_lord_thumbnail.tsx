import {Node, Grid, makeScene2D, Rect, Txt, Code, LezerHighlighter, Layout, Gradient} from '@motion-canvas/2d';
import { Hero, HeroIcon } from "../../components/HeroIcon";
import {Color, createRef, waitFor, waitUntil} from '@motion-canvas/core';

import { parser } from '@lezer/cpp';

const cppHighlighter = new LezerHighlighter(parser);

export default makeScene2D(function* (view) {
  const width = 1920;
  const height = 1080;
  const spacing = 100;
  const padding = 36;

  const green = new Color("#45ff57");
  const red = new Color("#ff4545");
  const yellow = new Color("#fffa45");
  const orange = new Color("#ff9a45");

  view.add(<Node rotation={4}>
    <Grid
      width={width * 2}
      height={height * 2}
      spacing={spacing}
      stroke={"#444"}
      lineWidth={4}
      lineCap="square"
      zIndex={-10}
      opacity={0.5}
    />
  </Node>);

  // const codeContainer = createRef<Layout>();
  // view.add(<Layout ref={codeContainer} x={910} cache layout>
  //   <Rect
  //     height={height}
  //     width={() => codeContainer().width() / 2 + 128}
  //     fill={() => new Gradient({
  //       stops: [{color: "#fff", offset: 0.25}, {color: "#fff7", offset: 0.75}, {color: "#fff0", offset: 0.95}],
  //       fromX: -(codeContainer().width() / 2 + 128) / 2,
  //       toX: (codeContainer().width() / 2 + 128) / 2
  //     })}
  //     layout={false}
  //     left={() => [-codeContainer().width() / 2 - 64, 0]} />
  //   <Node y={2*padding}>
  //     <Code compositeOperation={"source-in"} rotation={4} highlighter={cppHighlighter} code={`\
  //     rule: "When Reinhardt is eligible to set enemies on fire, create effects, then wait until no longer eligible to clean up"
  //     Event.OngoingPlayer
  //     Team.Team2
  //     Player.Reinhardt
  //     if (chargeCanSetEnemiesOnFire)
  //     {
  //       reinhardtIgnitionEffect[ReinhardtIgnitionEffect.MaterialEffect] = CreateEffect(
  //     AllPlayers(),
  //     Effect.AsheDynamiteBurningMaterialEffect,
  //     <Color>TeamOf(),
  //     EventPlayer(),
  //     0,
  //     EffectRev.None
  //       );
  //       reinhardtIgnitionEffect[ReinhardtIgnitionEffect.ParticleEffect] = CreateEffect(
  //     AllPlayers(),
  //     Effect.AsheDynamiteBurningParticleEffect,
  //     <Color>TeamOf(),
  //     EventPlayer(),
  //     0,
  //     EffectRev.None
  //       );
  //       WaitUntil(!chargeCanSetEnemiesOnFire, 5);
  //       DestroyEffect(reinhardtIgnitionEffect[ReinhardtIgnitionEffect.MaterialEffect]);
  //       DestroyEffect(reinhardtIgnitionEffect[ReinhardtIgnitionEffect.ParticleEffect]);
  //     }

  //     rule: "If a member of Team 1 is too close to a reinhardt who can set them on fire, make them catch fire"
  //     Event.OngoingPlayer
  //     Team.Team1
  //     # If any players on Team 2 who can set this player on fire are close enough to do so...
  //     if (IsTrueForAny(AllLivingPlayers(Team.Team2).FilteredArray((player) => player.chargeCanSetEnemiesOnFire), DistanceBetween(ArrayElement(), EventPlayer()) < CHARGE_IGNITION_DISTANCE))
  //     {
  //       # Stop any existing DoT to refresh the duration
  //       if ((reinhardtIgnitionDoT != -1 && EntityExists(reinhardtIgnitionDoT))) {
  //     StopDamageOverTime(reinhardtIgnitionDoT);
  //       }
  //       reinhardtIgnitionDoT = StartDamageOverTime(
  //     Receivers: EventPlayer(),
  //     Damagers: AllLivingPlayers(Team.Team2).FilteredArray((player) => player.chargeCanSetEnemiesOnFire).SortedArray(player => DistanceBetween(player, EventPlayer())).First,
  //     Duration: CHARGE_IGNITION_DURATION,
  //     DamagePerSecond: CHARGE_IGNITION_DPS
  //       );
  //       SetStatus(EventPlayer(), null, Status.Burning, CHARGE_IGNITION_DURATION);
  //       Wait(CHARGE_IGNITION_DURATION, WaitBehavior.RestartWhenTrue);
  //       StopDamageOverTime(reinhardtIgnitionDoT);
  //       reinhardtIgnitionDoT = -1;
  //     }`} fontSize={20} />
  //   </Node>
  // </Layout>);

  // view.add(<Rect
  //   width={width - 2*padding}
  //   height={height - 2*padding}
  //   stroke={"#fff"}
  //   opacity={0.6}
  //   lineWidth={16}
  //   radius={padding/2}
  // />);
});
