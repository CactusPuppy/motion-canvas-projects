import { Circle, Img, Layout, Line, makeScene2D, Node, Rect, SVG, Txt } from "@motion-canvas/2d";
import { waitFor, PlaybackState, usePlayback, createSignal, createRef, delay, easeOutCubic, waitUntil, easeInCubic, useDuration, linear, Color, loop, makeRef, all, useLogger, Vector2, useScene, easeInOutQuad, easeInQuart, range } from "@motion-canvas/core";
import { TDMScoreboard } from "../../../components/overwatch/tdm_scoreboard";

import payloadProgressRef from "../../../../images/references/payload_progress.png";
import payloadIconSVG from "../../../../images/icons/payload.svg?raw";

export default makeScene2D(function* (view) {
  const logger = useLogger();
  if (usePlayback().state !== PlaybackState.Rendering) {
    view.fill("#000000aa");
  }

  const team1Color = new Color("#2adafd");
  const team2Color = new Color("#d94d5c");
  const ch01Title = createRef<Node>();
  const titleUnderlineWidth = createSignal(0);
  const titleSlide = createSignal(70);
  const titleScale = createSignal(1.8);
  const title = createRef<Node>();
  const subtitle = createRef<Node>();

  const titleSeparation = 35;

  view.add(<Node ref={ch01Title} scale={() => titleScale()}>
    <Node ref={title} y={-titleSeparation/2} cache>
      <Rect fill="white" width={1000} height={60} />
      <Txt fill="white" fontFamily={"Config"} compositeOperation={"source-in"} y={() => titleSlide()}>Lack of a Comeback Mechanic</Txt>
    </Node>
    <Node y={titleSeparation/2} ref={subtitle}>
      <Txt fill="white" y={4} fontSize={32} fontFamily={"Config"}>I</Txt>
      <Layout layout={false} cache>
        <Rect fill="white" width={75} height={1080} />
        <Line stroke="white" compositeOperation={"source-out"} lineWidth={4}>
          <Node x={() => -titleUnderlineWidth() / 2} y={0} />
          <Node x={() => titleUnderlineWidth() / 2} y={0} />
        </Line>
      </Layout>
    </Node>
  </Node>);

  ch01Title().shadowColor("black");
  ch01Title().shadowBlur(3);
  yield* subtitle().findFirst<Txt>((node) => node instanceof Txt).opacity(0, 0).to(1, 0.3);
  yield titleUnderlineWidth(700, 0.5, easeOutCubic);
  yield delay(0.15, titleSlide(0, 0.35));

  const titleDuration = useDuration("titleFadeout")
  // yield titleScale(1.95, titleDuration, linear);
  yield* waitFor(titleDuration);

  yield titleScale(1.8, 1);
  yield titleSlide(70, 0.35);
  yield* titleUnderlineWidth(0, 0.5, easeInCubic);
  yield* subtitle().findFirst<Txt>((node) => node instanceof Txt).opacity(0, 0.3);

  yield ch01Title().remove();

  yield* waitUntil("showEscortProgress");
  const payloadUI = createRef<Rect>();
  const payloadProgressSections : Rect[] = [];
  const payloadIcon = createRef<SVG>();
  const payloadProgress = createSignal(0);
  const payloadProgressBar = createRef<Rect >();
  // reference image (TODO: remove)
  // view.add(<Img src={payloadProgressRef} scale={1} x={-6} y={-32}/>);
  view.add(<Rect
    ref={payloadUI}
    width={616}
    height={92}
    fill={new Color({r: 0, g: 0, b: 0, a: 0.5})}
    radius={6}
    paddingLeft={14}
    paddingTop={26}
    paddingBottom={10}
    layout
    alignItems={"center"}
    justifyContent={"start"}
    gap={10}
  >
    {/* left spacer */}
    <Rect width={38} height={3} fill={"gray"} />
    {/* progress bar one */}
    <Rect ref={makeRef(payloadProgressSections, 0)} width={532} height={15} fill={new Color(team2Color).alpha(0.5)} radius={4} clip>
      <Rect width={() => payloadProgress()} height={15} fill={team1Color} radius={4} ref={payloadProgressBar} />
    </Rect>
  </Rect>);
  payloadUI().add(<Rect layout={false} rotation={45} width={16} height={16} radius={2} fill={"#db820e"} topLeft={payloadProgressSections[0].bottomRight().addY(2)} offset={[-1, -1]} />);
  // yield loop(100, (i) => payloadUI().opacity(1, 0.5).to(0.3, 0.5));
  yield payloadUI().opacity(0);
  yield all(
    // payloadUI().scale([0.1, 0], 0).to([1, 0.1], 0.25, easeOutCubic).to(1, 0.25, easeOutCubic),
    payloadUI().scale([0.1, 0], 0).to([1, 0.1], 0.25, easeOutCubic).to(1.5, 0.25, easeOutCubic),
    payloadUI().opacity(1, 0.25),
  );
  yield* waitFor(0.15);
  payloadUI().add(<SVG
    layout={false}
    ref={payloadIcon}
    svg={payloadIconSVG}
    width={50}
    height={32.6273}
    fill="white"
    bottom={() => payloadProgressBar().topRight()
      .addY(-5)
      .transformAsPoint(payloadProgressBar().parent().localToParent())} />);
  const attackerIndicator = createRef<Layout>();
  const payloadAttackerCount = createSignal(2);
  payloadUI().add(<Layout layout={false}>
    <Layout
      layout
      direction={"row"}
      alignItems={"center"}
      gap={4}
      ref={attackerIndicator}
      right={() => payloadIcon().left().add([-24, -9]).transformAsPoint(payloadProgressBar().parent().localToParent())}
    >
      <Circle
        fill={team1Color}
        width={26}
        height={26}
        layout
        alignItems={"center"}
        justifyContent={"center"}
        shadowBlur={2}
        shadowColor={team1Color.brighten()}
        marginRight={2}
      >
        <Node y={1}>
          <Txt fontFamily={"Config"} fontWeight={800} fontSize={22} text={() => payloadAttackerCount().toFixed(0)}/>
        </Node>
      </Circle>
      <Layout layout gap={3}>
        {() => range(Math.round(payloadAttackerCount())).map(() => <Line
          lineWidth={4}
          stroke={team1Color}
          lineCap={"round"}
          points={[
            [-6, -6],
            [0, 0],
            [-6, 6]
          ]} />)}
      </Layout>
    </Layout>
  </Layout>)
  yield payloadIcon().opacity(0, 0).to(1, 0.15);
  yield* payloadProgress(200, useDuration("startPayloadProgress"), linear);
  payloadAttackerCount(1);
  yield payloadProgress(300, useDuration("finishPayloadProgress"), linear);
  yield* waitUntil("showAttackerRunbackTime");
  const attackerRunbackLine = createRef<Line>();
  const attackerRunbackTimeLabel = createRef<Txt>();
  const attackerRunbackTime = createSignal(7);
  view.add(<Line
    ref={attackerRunbackLine}
    stroke={team1Color}
    lineWidth={6}
    points={() => [
      payloadProgressSections[0].bottomLeft().addY(15).transformAsPoint(payloadProgressSections[0].parent().localToWorld()),
      payloadProgressBar().bottomRight().addY(15).transformAsPoint(payloadProgressBar().parent().localToWorld())
    ]}
    endOffset={4}
    endArrow={true}
    arrowSize={10}
  />);
  view.add(<Txt
    ref={attackerRunbackTimeLabel}
    fill={team1Color}
    fontFamily={"Config Monospace"}
    fontSize={32}
    y={10}
    text={() => attackerRunbackTime().toFixed(1)}
    top={() => attackerRunbackLine().parsedPoints().reduce((acc, cur) => acc.add(cur), Vector2.zero).scale(0.5).sub(useScene().getSize().scale(0.5)).addY(30)}
  />);
  attackerRunbackLine().absolutePosition(Vector2.zero);
  yield loop(Infinity, () => attackerRunbackTime(attackerRunbackTime() + 0.1, 0.1, linear));
  yield attackerRunbackLine().opacity(0);
  yield attackerRunbackTimeLabel().opacity(0);
  yield attackerRunbackLine().opacity(1, 0.25);
  yield attackerRunbackTimeLabel().opacity(1, 0.25);
  yield* waitUntil("showDefenderRunbackTime");
  const defenderRunbackLine = createRef<Line>();
  const defenderRunbackTimeLabel = createRef<Txt>();
  const defenderRunbackTime = createSignal(18.6);
  view.add(<Line
    ref={defenderRunbackLine}
    stroke={team2Color}
    lineWidth={6}
    points={() => [
      payloadProgressBar().bottomRight().addY(15).transformAsPoint(payloadProgressBar().parent().localToWorld()),
      payloadProgressSections[0].bottomRight().addY(15).transformAsPoint(payloadProgressSections[0].parent().localToWorld()),
    ]}
    startOffset={2}
    startArrow={true}
    arrowSize={10}
  />);
  view.add(<Txt
    ref={defenderRunbackTimeLabel}
    fill={team2Color}
    fontFamily={"Config Monospace"}
    fontSize={32}
    y={10}
    text={() => defenderRunbackTime().toFixed(1)}
    top={() => defenderRunbackLine().parsedPoints().reduce((acc, cur) => acc.add(cur), Vector2.zero).scale(0.5).sub(useScene().getSize().scale(0.5)).addY(30)}
  />);
  defenderRunbackLine().absolutePosition(Vector2.zero);
  yield loop(Infinity, () => defenderRunbackTime(defenderRunbackTime() - 0.1, 0.1, linear));
  yield defenderRunbackLine().opacity(0);
  yield defenderRunbackTimeLabel().opacity(0);
  yield defenderRunbackLine().opacity(1, 0.25);
  yield defenderRunbackTimeLabel().opacity(1, 0.25);
  yield* waitUntil("hideRunbackTimes");
  yield all(
    attackerRunbackLine().opacity(0, 1),
    attackerRunbackTimeLabel().opacity(0, 1),
    defenderRunbackLine().opacity(0, 1),
    defenderRunbackTimeLabel().opacity(0, 1),
  );
  yield* waitUntil("showTDMScoreboard");
  const tdmScoreboard = createRef<TDMScoreboard>();
  view.add(<TDMScoreboard
    ref={tdmScoreboard}
    scale={3.5}
    team1ScoreMax={3}
    team2ScoreMax={30}
    opacity={0}
    y={50}
  />);
  yield all(
    payloadUI().position([0, -400], 1, easeInOutQuad),
    payloadUI().scale(1, 1, easeInOutQuad),
    payloadUI().opacity(0.4, 1),
    delay(0.5, tdmScoreboard().opacity(1, 1)),
  );
  yield* waitUntil("startTDMScoreboard");
  const tdmScoreboardDuration = useDuration("tdmScoreboard");
  yield all(
    tdmScoreboard().team1Score(1, tdmScoreboardDuration),
    tdmScoreboard().team2Score(27, tdmScoreboardDuration)
  )
  yield* waitUntil("endScene");
  yield* all(
    payloadUI().opacity(0, 0.5),
    tdmScoreboard().opacity(0, 0.7),
  )
});
