import {Circle, Layout, Rect, Txt, Video, makeScene2D, Node, Img} from '@motion-canvas/2d';
import {Direction, PlaybackState, all, createRef, createSignal, delay, easeInCubic, easeOutCubic, makeRef, range, sequence, useDuration, usePlayback, useScene, waitFor, waitUntil} from '@motion-canvas/core';

import GMTK_Valve_Playtesting from "../../../../videos/GMTK_Valve_Playtesting.webm";
import speedPowerupVideo from "../../../../videos/speed_powerup.mp4";
import ultPowerupVideo from "../../../../videos/ult_powerup.mp4";
import gmtkLogo from "../../../../images/profilePictures/gmtklogo2024.webp";


import { TDMScoreboard } from '../../../components/overwatch/tdm_scoreboard';
import { LobbySlot } from "../../../components/overwatch/lobby_slot";
import { slideFadeIn, slideFadeOut } from "../../../utils/slideFades";
import { Rank, RankIcon } from '../../../components/overwatch/rank_icon';

export default makeScene2D(function* (view) {
  if (usePlayback().state !== PlaybackState.Rendering) {
    view.fill("#000000aa");
  }

  yield* waitUntil("showPortalPlaytesting");

  const gmtk_clip = createRef<Video>();
  const gmtk_clip_caption = createRef<Layout>();
  const gmtk_logo = createRef<Img>();
  const gmtk_caption_title = createRef<Txt>();
  const gmtk_caption_channel = createRef<Txt>();
  const videoFrameWidth = createSignal(0);
  const videoFrameHeight = createSignal(0.1);
  const videoFinalScale = 0.65;
  const gmtkCaptionSlideControl = createSignal(-48);

  view.add(<>
    <Rect width={videoFrameWidth} height={videoFrameHeight} radius={8} lineWidth={24} lineCap={"round"} stroke={"white"} clip>
      <Video ref={gmtk_clip} src={GMTK_Valve_Playtesting} loop={false} scale={videoFinalScale} />
    </Rect>
    <Node cache>
      <Layout ref={gmtk_clip_caption}
        layout
        direction={"row"}
        alignItems={"center"}
        justifyContent={"start"}
        topLeft={() => (gmtk_clip().parent() as Rect).bottomLeft().addY(gmtkCaptionSlideControl()).addX(-8)}
        textWrap="pre"
        gap={8}
      >
        <Node cache>
          <Img src={gmtkLogo} ref={gmtk_logo} width={64} height={64} />
          <Rect layout={false} fill="white" size={64} radius={12} position={gmtk_logo().position} compositeOperation={"destination-in"} />
        </Node>
        <Layout layout direction={"column"} alignItems={"start"}>
          <Txt ref={gmtk_caption_title} fill="white" fontFamily={"Config"} fontWeight={700} fontSize={24} text={""}/>
          <Txt ref={gmtk_caption_channel} fill="white" fontFamily={"Config"} fontWeight={500} fontSize={20} text={""}/>
        </Layout>
      </Layout>
      <Rect
        topLeft={() => (gmtk_clip().parent() as Rect).bottomLeft().addY(16).addX(-8)}
        width={videoFinalScale * useScene().getSize().x}
        height={90}
        fill="white"
        compositeOperation={"destination-in"}
      />
    </Node>
  </>);

  gmtk_clip().play();
  gmtk_clip().seek(89);
  /* @ts-ignore ts(2445) */
  gmtk_clip().video().volume = 0;
  yield* videoFrameWidth(useScene().getSize().x * videoFinalScale, 0.5, easeOutCubic);
  yield* videoFrameHeight(useScene().getSize().y * videoFinalScale, 0.5, easeOutCubic);
  // yield* waitFor(0.3);
  yield gmtkCaptionSlideControl(24, 0.5, easeOutCubic);
  yield* waitFor(0.2);
  yield gmtk_caption_title().text("Valve's \"Secret Weapon\"", 0.5, easeOutCubic);
  yield gmtk_caption_channel().text("Game Maker's Toolkit", 0.5, easeOutCubic);

  const titleMask = createRef<Node>();
  view.add(<Node ref={titleMask} cache>
    <Rect width={videoFrameWidth} height={videoFrameHeight} fill="white" compositeOperation={"destination-in"} />
  </Node>);
  yield* waitUntil("playtestMotto_01");


  const title01_bg = createRef<Txt>();
  view.add(<Txt ref={title01_bg} fill="white" fontFamily={"Lemon Milk"} fontStyle={"italic"} fontWeight={700} fontSize={190} y={-150} text={"Playtest Early"} zIndex={-1} />);
  const title01_fg = title01_bg().clone();
  title01_fg.fill("#0000").stroke("white").lineWidth(4).absolutePosition(() => title01_bg().absolutePosition()).opacity(0.75);
  title01_bg().save();
  title01_bg().position(title01_bg().position().add(title01_bg().size().getOriginOffset(Direction.Top)));
  titleMask().insert(title01_fg, 0);
  yield* title01_bg().restore(0.3, easeOutCubic);

  yield* waitUntil("playtestMotto_02");
  const title02_bg = createRef<Txt>();
  view.add(<Txt ref={title02_bg} fill="white" fontFamily={"Lemon Milk"} fontWeight={700} fontSize={190} y={170} text={"Playtest Often"} zIndex={-1} />);
  const title02_fg = title02_bg().clone();
  title02_fg.fill("#0000").stroke("white").lineWidth(4).absolutePosition(() => title02_bg().absolutePosition()).opacity(0.75);
  title02_bg().save();
  title02_bg().position(title02_bg().position().add(title02_bg().size().getOriginOffset(Direction.Bottom)));
  titleMask().insert(title02_fg, 0);
  yield* title02_bg().restore(0.3, easeOutCubic);

  yield* waitUntil("removePlaytestMotto");
  title01_bg().remove();
  title01_fg.remove();
  title02_bg().remove();
  title02_fg.remove();
  titleMask().remove();

  yield* waitUntil("hideGMTKClip");
  yield* all(
    gmtk_clip().parent().scale(0.8, 0.5),
    gmtk_clip().parent().opacity(0, 0.5),
    gmtk_clip().parent().filters.blur(8, 0.5, easeOutCubic),
    gmtkCaptionSlideControl(-56, 0.25, easeInCubic),
    gmtk_clip_caption().filters.blur(8, 0.5, easeOutCubic),
    title01_bg().opacity(0, 0.3),
    title02_bg().opacity(0, 0.3),
  );

  gmtk_clip().parent().remove();
  gmtk_clip_caption().parent().remove();

  yield* waitUntil("showTDMScoreboard");
  const tdmScoreboard = createRef<TDMScoreboard>();
  view.add(<TDMScoreboard ref={tdmScoreboard} team1ScoreMax={3} team2ScoreMax={30} scale={3} y={-300} />);
  const heroImbalanceDuration = useDuration("heroOPDuration");
  tdmScoreboard().opacity(0);
  yield* tdmScoreboard().opacity(1, 0.5);
  yield* all(
    tdmScoreboard().team1Score(3, heroImbalanceDuration),
    tdmScoreboard().team2Score(7, heroImbalanceDuration),
  );
  yield* waitUntil("reinOP");
  const reinOPDuration = useDuration("reinOPDuration");
  yield* all(
    tdmScoreboard().team1Score(1, reinOPDuration),
    tdmScoreboard().team2Score(30, reinOPDuration),
  );

  yield* waitUntil("hideTDMScoreboard");
  yield* tdmScoreboard().opacity(0, 0.5);
  tdmScoreboard().remove();

  yield* waitUntil("showPowerupConcerns");
  const speed_powerup_video = createRef<Video>();
  const ult_powerup_video = createRef<Video>();
  view.add(<>
    <Rect width={500} height={600} radius={8} lineWidth={24} lineCap={"round"} stroke={"white"} clip x={-1400}>
      <Video src={speedPowerupVideo} ref={speed_powerup_video} loop={true} scale={1.25} x={0} />
    </Rect>
    <Rect width={500} height={600} radius={8} lineWidth={24} lineCap={"round"} stroke={"white"} clip x={1400}>
      <Video src={ultPowerupVideo} ref={ult_powerup_video} loop={true} scale={1.4} x={20} y={80} />
    </Rect>
  </>);
  speed_powerup_video().play();
  /* @ts-ignore ts(2445) */
  speed_powerup_video().video().volume = 0;
  speed_powerup_video().seek(57);
  ult_powerup_video().play();
  /* @ts-ignore ts(2445) */
  ult_powerup_video().video().volume = 0;
  ult_powerup_video().seek(39);
  yield* all(
    speed_powerup_video().parent().x(-350, 1, easeOutCubic),
    ult_powerup_video().parent().x(350, 1, easeOutCubic),
  );
  yield* waitUntil("hidePowerupConcerns");
  yield* all(
    speed_powerup_video().parent().x(-1400, 1, easeInCubic),
    ult_powerup_video().parent().x(1400, 1, easeInCubic),
  );
  speed_powerup_video().parent().remove();
  ult_powerup_video().parent().remove();

  yield* waitUntil("showVaryingLobbies");

  /* === TREE SETUP === */

  const heroSlots: LobbySlot[] = [];
  const demonLordSlot = createRef<LobbySlot>();
  const vsLetters: Txt[] = [];
  view.add(<Node x={-467}>
    {range(4).map((i) => <LobbySlot ref={makeRef(heroSlots, i)} y={-175 + i * 100 * 7/6} scale={1.75} />)}
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

  view.add(<Node x={467}><LobbySlot ref={demonLordSlot} scale={1.75} fill="#331818c0" /></Node>);

  /* === PREP COMPONENTS === */

  heroSlots.forEach((slot) => {
    slot.opacity(0),
    slot.position.x(-100)
  });
  vsLetters[0].position([5, -15]).opacity(0);
  vsLetters[1].position([-5, 15]).opacity(0);
  demonLordSlot().position([100, 0]).opacity(0);

  /* === ANIMATION === */

  yield* all(
    sequence(0.07, ...heroSlots.map((slot) => all(slot.opacity(1, 0.25), slot.position.x(0, 0.25)))),
    ...vsLetters.map((letter) => letter.opacity(1, 0.4)),
    ...vsLetters.map((letter) => letter.position([0, 0], 0.4)),
    delay(0.15, demonLordSlot().opacity(1, 0.25)),
    delay(0.15, demonLordSlot().position([0, 0], 0.25))
  );

  yield* waitUntil("showFirstRankSet");
  const rankIcons01: RankIcon[] = [];
  const ranks01 = [Rank.Bronze, Rank.Silver, Rank.Bronze, Rank.Bronze, Rank.Silver];

  yield* all(
    sequence(0.05, ...heroSlots.map((slot) => slot.placeholderOpacity(0, 0.2))),
    delay(0.07, demonLordSlot().placeholderOpacity(0, 0.2)),
    delay(0.03, sequence(0.05, ...heroSlots.map((slot, i) => function* () {
      view.add(<RankIcon ref={makeRef(rankIcons01, i)} rank={ranks01[i]} scale={0.45} />);
      rankIcons01[i].absolutePosition(slot.absolutePosition().addY(10));
      yield* slideFadeIn(rankIcons01[i], 0.3, Direction.Left, 0.1);
    }()))),
    delay(0.1, function* (){
      view.add(<RankIcon ref={makeRef(rankIcons01, heroSlots.length)} rank={ranks01[ranks01.length - 1]} scale={0.45} />);
      rankIcons01[heroSlots.length].absolutePosition(demonLordSlot().absolutePosition().addY(10));
      yield* slideFadeIn(rankIcons01[heroSlots.length], 0.3, Direction.Right, 0.1);
    }())
  );

  yield* waitUntil("showSecondRankSet");
  const rankIcons02: RankIcon[] = [];
  const ranks02 = [Rank.Gold, Rank.Platinum, Rank.Diamond, Rank.Gold, Rank.Platinum];

  yield* all(
    sequence(0.05, ...rankIcons01.slice(0, rankIcons01.length - 1).map((icon) => slideFadeOut(icon, 0.3, Direction.Right, 0.1))),
    delay(0.07, slideFadeOut(rankIcons01[rankIcons01.length - 1], 0.3, Direction.Left, 0.1)),
    delay(0.1, sequence(0.05, ...heroSlots.map((slot, i) => function* () {
      view.add(<RankIcon ref={makeRef(rankIcons02, i)} rank={ranks02[i]} scale={0.45} />);
      rankIcons02[i].absolutePosition(slot.absolutePosition().addY(10));
      yield* slideFadeIn(rankIcons02[i], 0.3, Direction.Left, 0.1);
    }()))),
    delay(0.2, function* (){
      view.add(<RankIcon ref={makeRef(rankIcons02, heroSlots.length)} rank={ranks02[ranks02.length - 1]} scale={0.45} />);
      rankIcons02[heroSlots.length].absolutePosition(demonLordSlot().absolutePosition().addY(10));
      yield* slideFadeIn(rankIcons02[heroSlots.length], 0.3, Direction.Right, 0.1);
    }())
  );
  rankIcons01.forEach((icon) => icon.remove());

  yield* waitUntil("showThirdRankSet");
  const rankIcons03: RankIcon[] = [];
  const ranks03 = [Rank.Master, Rank.Grandmaster, Rank.Master, Rank.Master, Rank.Grandmaster];

  yield* all(
    sequence(0.05, ...rankIcons02.slice(0, rankIcons02.length - 1).map((icon) => slideFadeOut(icon, 0.3, Direction.Right, 0.1))),
    delay(0.07, slideFadeOut(rankIcons02[rankIcons02.length - 1], 0.3, Direction.Left, 0.1)),
    delay(0.1, sequence(0.05, ...heroSlots.map((slot, i) => function* () {
      view.add(<RankIcon ref={makeRef(rankIcons03, i)} rank={ranks03[i]} scale={0.35} />);
      rankIcons03[i].absolutePosition(slot.absolutePosition().addY(10));
      yield* slideFadeIn(rankIcons03[i], 0.3, Direction.Left, 0.1);
    }()))),
    delay(0.2, function* (){
      view.add(<RankIcon ref={makeRef(rankIcons03, heroSlots.length)} rank={ranks03[ranks03.length - 1]} scale={0.35} />);
      rankIcons03[heroSlots.length].absolutePosition(demonLordSlot().absolutePosition().addY(10));
      yield* slideFadeIn(rankIcons03[heroSlots.length], 0.3, Direction.Right, 0.1);
    }())
  );
  rankIcons02.forEach((icon) => icon.remove());

  yield* waitUntil("hideLobbySlots");
  yield* all(
    sequence(0.07, ...heroSlots.map((slot) => slideFadeOut(slot, 0.25, Direction.Left, 0.5))),
    all(vsLetters[0].opacity(0, 0.4), vsLetters[0].position([5, -15], 0.4)),
    all(vsLetters[1].opacity(0, 0.4), vsLetters[1].position([-5, 15], 0.4)),
    delay(0.15, slideFadeOut(demonLordSlot(), 0.25, Direction.Right, 0.5)),
    sequence(0.05, ...rankIcons03.slice(0, rankIcons02.length - 1).map((icon) => slideFadeOut(icon, 0.3, Direction.Left, 0.05))),
    delay(0.15, slideFadeOut(rankIcons03[rankIcons03.length - 1], 0.3, Direction.Right, 0.05)),
  );
  heroSlots[0].parent().remove();
  vsLetters[0].parent().parent().remove();
  demonLordSlot().parent().remove();
  rankIcons03.forEach((icon) => icon.remove());
});
