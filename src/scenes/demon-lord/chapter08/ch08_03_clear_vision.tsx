import {Circle, Img, Layout, Rect, Txt, Video, makeScene2D, Node} from '@motion-canvas/2d';
import {Direction, PlaybackState, PossibleVector2, all, createRef, createSignal, delay, easeInCubic, easeOutCubic, makeRef, sequence, usePlayback, useScene, waitFor, waitUntil} from '@motion-canvas/core';

import statsImage from "../../../../images/OW2_Anniversary_Stats.png";
import rareFeedbackVideo from "../../../../videos/rare_feedback.mp4";
import ms_game_dev_image from "../../../../images/profilePictures/Microsoft_Game_Dev.jpg";
import { slideFadeIn, slideFadeOut } from '../../../utils/slideFades';

import complaint_01 from "../../../../images/demon_lord/complaints/2CI9VRLtUX.png";
import complaint_02 from "../../../../images/demon_lord/complaints/Screenshot 2024-02-12 at 20-51-31 Demon Lord Mode is Unfun - General Discussion - Overwatch Forums.png";
import complaint_03 from "../../../../images/demon_lord/complaints/Screenshot 2024-02-12 at 20-52-22 Demon Lord Mode is Unfun - General Discussion - Overwatch Forums.png";
import complaint_04 from "../../../../images/demon_lord/complaints/Screenshot 2024-02-12 at 20-56-11 Demon Lord Mode is Unfun - General Discussion - Overwatch Forums.png";
import complaint_05 from "../../../../images/demon_lord/complaints/Screenshot 2024-02-12 at 20-58-59 Demon Lord Mode is Unfun - General Discussion - Overwatch Forums.png";
import complaint_06 from "../../../../images/demon_lord/complaints/Screenshot 2024-02-12 at 21-06-05 Demon Lord Mode is stupid r_Overwatch.png";
import complaint_07 from "../../../../images/demon_lord/complaints/Screenshot 2024-02-12 at 21-16-14 Demon Lord Mode is stupid r_Overwatch.png";
import { blurFadeIn, blurFadeOut } from '../../../utils/blurFades';

export default makeScene2D(function* (view) {
  if (usePlayback().state !== PlaybackState.Rendering) {
    view.fill("#000000aa");
  }
  yield* waitUntil("startScene");

  const rare_video = createRef<Video>();
  const rare_video_caption = createRef<Layout>();
  const ms_game_dev_logo = createRef<Img>();
  const ms_game_dev_title = createRef<Txt>();
  const ms_game_dev_channel = createRef<Txt>();
  const videoFrameWidth = createSignal(0);
  const videoFrameHeight = createSignal(0.1);
  const videoFinalScale = 0.65;
  const rareCaptionSlideControl = createSignal(-48);

  view.add(<>
    <Rect width={videoFrameWidth} height={videoFrameHeight} radius={8} lineWidth={24} lineCap={"round"} stroke={"white"} clip>
      <Video ref={rare_video} src={rareFeedbackVideo} scale={videoFinalScale} />
    </Rect>
    <Node cache>
      <Layout ref={rare_video_caption}
        layout
        direction={"row"}
        alignItems={"center"}
        justifyContent={"start"}
        topLeft={() => (rare_video().parent() as Rect).bottomLeft().addY(rareCaptionSlideControl()).addX(-8)}
        textWrap={"pre"}
        gap={8}
      >
        <Node cache>
          <Img src={ms_game_dev_image} ref={ms_game_dev_logo} width={64} height={64} />
          <Rect layout={false} fill="white" size={64} radius={12} position={() => ms_game_dev_logo().position()} compositeOperation={"destination-in"} />
        </Node>
        <Layout layout direction={"column"} gap={8}>
          <Txt ref={ms_game_dev_title} fontFamily={"Config"} fontWeight={700} fontSize={24} fill={"white"} />
          <Txt ref={ms_game_dev_channel} fontFamily={"Config"} fontWeight={700} fontSize={20} fill={"white"} />
        </Layout>
      </Layout>
      <Rect
        topLeft={() => (rare_video().parent() as Rect).bottomLeft().add([-8, 16])}
        width={videoFinalScale * useScene().getSize().x}
        height={90}
        fill="white"
        compositeOperation={"destination-in"}
      />
    </Node>
  </>);

  rare_video().seek(165);
  rare_video().play();
  // @ts-ignore ts(2445)
  rare_video().video().volume = 0;

  yield* videoFrameWidth(useScene().getSize().x * videoFinalScale, 0.5, easeOutCubic);
  yield* videoFrameHeight(useScene().getSize().y * videoFinalScale, 0.5, easeOutCubic);
  yield rareCaptionSlideControl(24, 0.5, easeOutCubic);
  yield* waitFor(0.2);
  yield ms_game_dev_title().text("Rare: Building Sea of Thieves with a LiveOps mentality", 0.5, easeOutCubic);
  yield ms_game_dev_channel().text("Microsoft Game Dev", 0.5, easeOutCubic);

  yield* waitUntil("quote");

  const quoteUnderlay = createRef<Rect>();
  const sean_davies_quote = createRef<Layout>();
  rare_video().parent().add(<>
    <Rect ref={quoteUnderlay} width="100%" height="100%" fill="black" opacity={0} />
    <Layout layout direction={"column"} gap={24} ref={sean_davies_quote} fontFamily={"Config"} width={() => rare_video().width()} paddingLeft={64} paddingRight={64} scale={videoFinalScale} textAlign={"left"} textWrap={"pre"}>
      <Txt fill="white" fontSize={64}>{`"If all you do is respond to feedback … you end up converging on\n a fairly middle of the road [game] and you don’t … end up with\n those moments of surprise and delight."`}</Txt>
      <Txt fill="white" fontSize={36} fontWeight={900} paddingLeft={20}>{`- Sean Davies (Technical Director @ Rare)`}</Txt>
    </Layout>
  </>);
  yield quoteUnderlay().opacity(0.75, 0.5, easeOutCubic);
  yield slideFadeIn(sean_davies_quote(), 0.5, Direction.Top, 0.2, easeOutCubic);

  yield* waitUntil("dismissQuote");
  yield* all(
    slideFadeOut(sean_davies_quote(), 0.5, Direction.Bottom, 0.2, easeInCubic),
    quoteUnderlay().opacity(0, 0.5, easeInCubic),
  );

  yield* waitUntil("dismissVideo");
  yield* all(
    rare_video().parent().scale(0.8, 0.5, easeInCubic),
    rare_video().parent().opacity(0, 0.5, easeInCubic),
    rare_video().parent().filters.blur(8, 0.5, easeOutCubic),
    rareCaptionSlideControl(-56, 0.25, easeInCubic),
    rare_video_caption().filters.blur(8, 0.5, easeOutCubic),
    rare_video_caption().opacity(0, 0.5, easeInCubic),
    rare_video_caption().parent().findLast<Rect>(node => node instanceof Rect).filters.blur(8, 0.5, easeOutCubic),
  );

  yield* waitUntil("revealComplaints");

  const complaints = [complaint_01, complaint_02, complaint_03, complaint_04, complaint_05, complaint_06, complaint_07];
  const complaintPositions: PossibleVector2[] = [
    [-400, -300],
    [454, -195],
    [-450, 7],
    [500, 73],
    [-464, 220],
    [520, 343],
    [-340, 431],
  ];
  const complaintFinalScales = [0.75, 1, 1, 1.25, 1, 1, 1.25];
  const complaintNodes: Node[] = [];

  yield* sequence(0.1,
    ...complaints.slice(0,7).map((complaint, i) => function* () {
      view.add(<Img position={complaintPositions[i]} src={complaint} ref={makeRef(complaintNodes, i)} />);
      yield* blurFadeIn(complaintNodes[i], 0.5, 8, 1, 0.8 * complaintFinalScales[i], complaintFinalScales[i], easeOutCubic)
    }())
  );

  yield* waitUntil("endScene");

  yield* sequence(0.07,
    ...complaintNodes.map((node, i) => blurFadeOut(node, 0.5, 8, 0.8 * complaintFinalScales[i], easeInCubic)),
  );
});
