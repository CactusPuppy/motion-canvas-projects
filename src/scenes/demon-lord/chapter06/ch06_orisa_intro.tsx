import { Rect, makeScene2D } from "@motion-canvas/2d";

import { HeroIcon, Hero } from "../../../components/HeroIcon";
import { Color, all, createRef, delay, useDuration, waitUntil } from "@motion-canvas/core";

export default makeScene2D(function* (view) {
  yield* waitUntil("startScene");

  const jqIcon = createRef<HeroIcon>();
  const orisaIcon = createRef<HeroIcon>();

  const jqColor = new Color("#8eb5d7");
  const orisaColor = new Color("#458b42");

  view.add(<HeroIcon ref={orisaIcon} hero={Hero.Orisa} scale={4} opacity={0}>
    <Rect
      stroke={orisaColor.brighten(0.25)}
      lineWidth={4}
      shadowBlur={16}
      shadowColor={orisaColor.darken()}
      radius={4}
      size={64}
    />
  </HeroIcon>);
  view.add(<HeroIcon ref={jqIcon} hero={Hero.JunkerQueen} scale={4} opacity={0}>
    <Rect
      stroke={jqColor.brighten(0.25)}
      lineWidth={4}
      shadowBlur={16}
      shadowColor={jqColor.darken()}
      radius={4}
      size={64}
    />
  </HeroIcon>);

  yield* waitUntil("showJQIcon");
  yield* jqIcon().opacity(1, 0.5);

  yield* waitUntil("showOrisaIcon");
  const orisaIntroDuration = useDuration("orisaIntro");
  yield* all(
    orisaIcon().opacity(1, orisaIntroDuration),
    orisaIcon().position([300, 0], orisaIntroDuration),
    jqIcon().position([-300, 0], orisaIntroDuration),
  );

  yield* waitUntil("moveIconsToTop");
  yield* all(
    orisaIcon().position([400, -400], 1),
    orisaIcon().scale(1.5, 1),
    jqIcon().position([-400, -400], 1),
    jqIcon().scale(1.5, 1),
  );

  yield* waitUntil("emphasizeJQIcon");
  yield* all(
    orisaIcon().opacity(0.5, 0.5),
    jqIcon().position([-350, -400], 0.5),
    jqIcon().scale(2, 0.5),
  );

  yield* waitUntil("emphasizeOrisaIcon");
  yield* all(
    orisaIcon().position([350, -400], 0.5),
    orisaIcon().scale(2, 0.5),
    orisaIcon().opacity(1, 0.5),
    jqIcon().position([-400, -400], 0.5),
    jqIcon().scale(1.5, 0.5),
    jqIcon().opacity(0.5, 0.5),
  );

  yield* waitUntil("hideAll");
  yield* all(
    orisaIcon().scale(1.75, 0.5),
    orisaIcon().position([375, -400], 0.5),
    orisaIcon().opacity(0.75, 0.5),
    jqIcon().scale(1.75, 0.5),
    jqIcon().position([-375, -400], 0.5),
    jqIcon().opacity(0.75, 0.5),
    delay(0.3, all(
      orisaIcon().opacity(0, 0.5),
      jqIcon().opacity(0, 0.5),
    ))
  );

});
