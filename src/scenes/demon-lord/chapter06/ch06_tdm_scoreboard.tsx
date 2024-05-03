import { makeScene2D, Txt, Video } from "@motion-canvas/2d";

import playtesting from "../../../../videos/playtesting.mp4";
import { all, createRef, delay, waitFor, waitUntil } from "@motion-canvas/core";

import { TDMScoreboard } from "../../../components/overwatch/tdm_scoreboard";

export default makeScene2D(function* (view) {
  const scoreboard = createRef<TDMScoreboard>();
  const heroLabel = createRef<Txt>();
  const reinLabel = createRef<Txt>();
  view.add(<TDMScoreboard ref={scoreboard} x={-4} team1ScoreMax={3} team2ScoreMax={30} scale={3} opacity={0} />);
  view.add(<Txt ref={heroLabel} fontFamily="Industry" fontWeight={600} fill="white" shadowBlur={4} shadowColor="black" position={[-230, -160]}>Heroes</Txt>)
  view.add(<Txt ref={reinLabel} fontFamily="Industry" fontWeight={600} fill="white" shadowBlur={4} shadowColor="black" position={[300,  -160]}>Demon Lord</Txt>)

  yield heroLabel().opacity(0);
  yield reinLabel().opacity(0);
  yield* waitUntil("TDMScoreboard_Appear");
  yield* all(
    scoreboard().opacity(1, 0.5),
    reinLabel().opacity(1, 0.5),
    heroLabel().opacity(1, 0.5),
  );
  yield* waitUntil("TDMScoreboard_ReinWin");
  yield* all(
    scoreboard().team1Score(2, 1.5),
    scoreboard().team2Score(30, 1.5),
  );
  yield* waitUntil("TDMScoreboard_HeroesWin");
  yield* all(
    scoreboard().team1Score(3, 1.5),
    scoreboard().team2Score(23, 1.5),
  );
  yield* waitUntil("TDMScoreboard_Disappear");
  yield* all(
    scoreboard().opacity(0, 0.5),
    reinLabel().opacity(0, 0.5),
    heroLabel().opacity(0, 0.5),
  );
});
