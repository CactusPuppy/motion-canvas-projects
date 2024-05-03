import { Node, Layout, makeScene2D, Txt, Rect, Circle, Gradient, signal, Line } from "@motion-canvas/2d";
import creditsRaw from "./credits.txt?raw";
import { Direction, all, createRef, createSignal, delay, easeOutQuint, linear, useLogger, waitFor } from "@motion-canvas/core";

export default makeScene2D(function* (view) {
  const outerVerticalPadding = 140;
  const outerHorizontalPadding = 42;
  const creditsTopBar = createRef<Line>();
  const creditsBottomBar = createRef<Line>();
  const creditsRef = createRef<Txt>();
  const creditsBarExpansionSignal = createSignal(0);
  const creditsOpeningSignal = createSignal(0);
  const channelOpeningSignal = createSignal(0);
  const videoOpeningSignal = createSignal(0);

  const credits = creditsRaw.trim();

  const creditsGradient = () => new Gradient({
    stops: [
      { offset: 0, color: "#ffffff00" },
      { offset: 0.1, color: "#ffffffff" },
      { offset: 0.9, color: "#ffffffff" },
      { offset: 1, color: "#ffffff00" },
    ],
    from: { x: 0, y: -creditsRef().height()/2 * creditsOpeningSignal() },
    to: { x: 0, y: creditsRef().height()/2 * creditsOpeningSignal() },
  });

  view.add(<Layout
    layout
    width={1920}
    height={1080}
    direction={"row"}
    alignItems={"center"}
    justifyContent={"space-around"}
    paddingTop={outerVerticalPadding}
    paddingBottom={outerVerticalPadding}
    paddingLeft={outerHorizontalPadding}
    paddingRight={outerHorizontalPadding}
  >
    <Rect width={1920 / 2.5}/>
    <Layout alignItems={"center"} direction={"column"} justifyContent={"space-between"} height={1080 - 2*outerVerticalPadding} paddingTop={16} paddingBottom={16}>
      <Circle
        size={298}
        stroke={"white"}
        lineWidth={16}
        end={channelOpeningSignal}
        lineCap={"round"}
        opacity={() => 1/0.1 * channelOpeningSignal()}
      />
      <Rect
        width={612}
        height={350}
        stroke={"white"}
        lineWidth={8}
        radius={16}
        lineCap={"round"}
        lineDash={[14, 32]}
        opacity={() => 1/0.1 * videoOpeningSignal()}
        end={videoOpeningSignal}
      />
    </Layout>
  </Layout>);

  // yield creditsBarExpansionSignal(1, 0.5, easeOutQuint);
  // yield* waitFor(0.2);
  yield* all(
    creditsOpeningSignal(1, 0.75),
    channelOpeningSignal(1, 0.5),
    delay(0.25, videoOpeningSignal(1, 0.75, linear))
  );
})
