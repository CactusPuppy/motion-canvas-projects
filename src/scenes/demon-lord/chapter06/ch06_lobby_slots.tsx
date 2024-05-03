import { Layout, makeScene2D, Node, SVG, Txt } from "@motion-canvas/2d";
import { LobbySlot } from "../../../components/overwatch/lobby_slot";
import { all, chain, createRef, createSignal, delay, Direction, easeInOutSine, loopUntil, makeRef, range, sequence, waitFor, waitUntil } from "@motion-canvas/core";
import userIcon from "../../../../images/icons/user.svg?raw";
import botIconSVG from "../../../../images/icons/robot.svg?raw";

import { slideFadeIn, slideFadeOut } from "../../../utils/slideFades";

export default makeScene2D(function* (view) {

  /* === TREE SETUP === */

  const heroSlots: LobbySlot[] = [];
  const demonLordSlot = createRef<LobbySlot>();
  const vsLetters: Txt[] = [];
  view.add(<Node x={-400}>
    {range(4).map((i) => <LobbySlot ref={makeRef(heroSlots, i)}  y={-150 + i * 100} scale={1.5} />)}
  </Node>);

  view.add(<Layout x={-10} scale={3} layout shadowBlur={4} shadowColor={"black"}>
    <Node x={4}>
      <Node ref={makeRef(vsLetters, 0)}>
        <Txt
          fontFamily={"BigNoodleTooOblique"}
          textWrap={"pre"}
          fontSize={50}
          text={"V "}
          fill="white"
        />
      </Node>
    </Node>
    <Node x={-4}>
      <Node ref={makeRef(vsLetters, 1)}>
        <Txt
          fontFamily={"BigNoodleTooOblique"}
          textWrap={"pre"}
          fontSize={50}
          text={"S "}
          fill="white"
        />
      </Node>
    </Node>
  </Layout>);

  view.add(<Node x={400}><LobbySlot ref={demonLordSlot} scale={1.5} fill="#331818c0" /></Node>);

  const userIcons : SVG[] = [];
  view.add(<>
    {range(4).map((i) => <SVG
      ref={makeRef(userIcons, i)}
      svg={userIcon}
      x={-225 + 150 * i}
      y={350}
      // size={[14, 16]}
      scale={5}
      fill={"white"}
      shadowColor={"black"}
      shadowBlur={4} />)}
  </>);

  /* === PREP COMPONENTS === */

  heroSlots.forEach((slot) => {
    slot.opacity(0),
    slot.position.x(-100)
  });
  vsLetters[0].position([5, -15]).opacity(0);
  vsLetters[1].position([-5, 15]).opacity(0);
  demonLordSlot().position([100, 0]).opacity(0);
  userIcons.forEach((icon) => icon.opacity(0));

  /* === ANIMATION === */

  yield* waitUntil("lobbyslots_start");
  yield* all(
    sequence(0.07, ...heroSlots.map((slot) => all(slot.opacity(1, 0.25), slot.position.x(0, 0.25)))),
    ...vsLetters.map((letter) => letter.opacity(1, 0.4)),
    ...vsLetters.map((letter) => letter.position([0, 0], 0.4)),
    delay(0.15, demonLordSlot().opacity(1, 0.25)),
    delay(0.15, demonLordSlot().position([0, 0], 0.25))
  );

  yield* waitUntil("showPlaytesters");
  yield* sequence(
    0.07,
    ...userIcons.map((icon) => chain(icon.opacity(1, 0), slideFadeIn(icon, 0.25, Direction.Bottom, 3)))
  );

  yield* waitUntil("movePlaytestersIntoPlace");
  yield* sequence(0.07,
    ...userIcons.slice(0, 3).map((icon, i) => sequence(0.05,
      icon.absolutePosition(() => heroSlots[i].absolutePosition(), 0.5),
      heroSlots[i].placeholderOpacity(0, 0.5),
    )),
    sequence(0.05,
      userIcons[3].absolutePosition(() => demonLordSlot().absolutePosition(), 0.5),
      demonLordSlot().placeholderOpacity(0, 0.5),
    ),
  );

  yield* waitUntil("emphasizeEmptySlot");
  yield* loopUntil("botFill", function* () {
    yield* heroSlots[3].placeholderOpacity(0, 0.3, easeInOutSine);
    yield* heroSlots[3].placeholderOpacity(1, 0.3, easeInOutSine);
  });

  const botIcon = createRef<SVG>();
  view.add(<SVG
    ref={botIcon}
    svg={botIconSVG}
    position={[0,0]}
    fill={"white"}
    shadowColor={"black"}
    shadowBlur={4}
    scale={5}
    size={[20, 16]}
    opacity={0}
  />);
  botIcon().absolutePosition(() => heroSlots[3].absolutePosition());
  yield* all(
    botIcon().opacity(1, 0.35),
    heroSlots[3].placeholderOpacity(0, 0.35),
  );

  yield* waitUntil("lobbySlots_end");
  yield* all(
    sequence(0.07, ...heroSlots.map((slot) => slideFadeOut(slot, 0.25, Direction.Left, 0.5))),
    sequence(0.07, ...userIcons.slice(0, 3).map((icon) => icon.opacity(0, 0.25))),
    delay(0.21, botIcon().opacity(0, 0.25)),
    all(vsLetters[0].opacity(0, 0.4), vsLetters[0].position([5, -15], 0.4)),
    all(vsLetters[1].opacity(0, 0.4), vsLetters[1].position([-5, 15], 0.4)),
    delay(0.15, slideFadeOut(demonLordSlot(), 0.25, Direction.Right, 0.5)),
    delay(0.15, userIcons[3].opacity(0, 0.25)),
  );
});
