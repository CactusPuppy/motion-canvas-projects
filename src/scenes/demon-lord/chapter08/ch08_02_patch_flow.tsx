import {Circle, Gradient, Line, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {Color, PlaybackState, all, chain, createRef, createSignal, linear, loop, makeRef, sequence, usePlayback, waitFor, waitUntil} from '@motion-canvas/core';

export default makeScene2D(function* (view) {
  if (usePlayback().state !== PlaybackState.Rendering) {
    view.fill("#000000aa");
  }

  yield* waitUntil("startScene");

  const loadingCircle = createRef<Circle>();
  const prototypeSection = createRef<Rect>();
  const developmentSection = createRef<Rect>();
  const qaSection = createRef<Rect>();
  const productionSection = createRef<Rect>();

  const patch = createRef<Circle>();

  const spread = createSignal(420);
  const baseline = createSignal(100);

  view.add(<>
    <Rect ref={prototypeSection}   x={()=>-spread() * 1.5} y={0} width={270} height={0} lineWidth={5} radius={6}
      fill={new Color("#54aae8").alpha(0.7)} stroke={new Color("#54aae8").saturate()} />
    <Rect ref={developmentSection} x={()=>-spread() * 0.5} y={0} width={270} height={0} lineWidth={5} radius={6}
      fill={new Color("#5de36f").alpha(0.7)} stroke={new Color("#5de36f").saturate()} />
    <Rect ref={qaSection}          x={()=>spread() * 0.5}  y={0} width={270} height={0} lineWidth={5} radius={6}
      fill={new Color("#f0e13e").alpha(0.7)} stroke={new Color("#f0e13e").saturate()} />
    <Rect ref={productionSection}  x={()=>spread() * 1.5}  y={0} width={270} height={0} lineWidth={5} radius={6}
      fill={new Color("#f0943e").alpha(0.7)} stroke={new Color("#f0943e").saturate()} />
  </>);

  prototypeSection().opacity(0);
  developmentSection().opacity(0);
  qaSection().opacity(0);
  productionSection().opacity(0);

  const sectionConnections : Line[] = [];
  const lineProgress = createSignal(0);

  view.add(<>
    <Line ref={makeRef(sectionConnections, 0)} points={[
      prototypeSection().position().addY(-60),
      prototypeSection().position().addY(-60).addX(spread() * 0.5).addY(-60),
      developmentSection().position().addY(-60)
    ]} radius={600} />
    <Line ref={makeRef(sectionConnections, 1)} points={[
      developmentSection().position().addY(-60),
      developmentSection().position().addY(-60).addX(spread() * 0.5).addY(-60),
      qaSection().position().addY(-60)
    ]} radius={600} />
    <Line ref={makeRef(sectionConnections, 2)} points={[
      qaSection().position().addY(-60),
      qaSection().position().addY(-60).addX(spread() * 0.5).addY(-60),
      productionSection().position()
    ]} radius={600} />
  </>);

  const sectionCaptions : Txt[] = [];
  view.add(<>
    <Txt ref={makeRef(sectionCaptions, 0)} fontFamily={"Config"} fontWeight={600} fill={"white"} fontSize={48} top={() => prototypeSection().bottom().addY(10)} text={"Prototyping"} />
    <Txt ref={makeRef(sectionCaptions, 1)} fontFamily={"Config"} fontWeight={600} fill={"white"} fontSize={48} top={() => developmentSection().bottom().addY(10)} text={"Development"} />
    <Txt ref={makeRef(sectionCaptions, 2)} fontFamily={"Config"} fontWeight={600} fill={"white"} fontSize={48} top={() => qaSection().bottom().addY(10)}        text={"QA"} />
    <Txt ref={makeRef(sectionCaptions, 3)} fontFamily={"Config"} fontWeight={600} fill={"white"} fontSize={48} top={() => productionSection().bottom().addY(10)} text={"Production"} />
  </>);
  sectionCaptions.forEach(caption => caption.opacity(0));

  yield* sequence(0.1,
    all(prototypeSection().opacity(1, 0.5), prototypeSection().height(300, 0.65)),
    all(developmentSection().opacity(1, 0.5), developmentSection().height(300, 0.65)),
    all(qaSection().opacity(1, 0.5), qaSection().height(300, 0.65)),
    all(productionSection().opacity(1, 0.5), productionSection().height(300, 0.65)),
    ...sectionCaptions.map(caption => caption.opacity(1, 0.5))
  );

  yield* waitUntil("startPatchFlow");

  view.add(<Circle ref={loadingCircle} size={72} stroke={new Gradient({
    stops: [{offset: 0.15, color: "#ffffff00"}, {offset: 1, color: "#ffffff"}],
    type: "conic",
    angle: -90
  })} lineWidth={12} startAngle={-90} endAngle={210} lineCap={"round"} />);
  loadingCircle().opacity(0).scale(0.85);
  loadingCircle().position(prototypeSection().position().addY(60))

  view.add(<Circle ref={patch} size={80} fill={new Color("#e05858").alpha(0.8).saturate()} stroke={new Color("#e05858").darken()} lineWidth={5} />);
  patch().position(prototypeSection().position().addY(-60));
  patch().opacity(0).scale(0.85);

  yield loop(Infinity, function* () {
    loadingCircle().rotation(0);
    yield* loadingCircle().rotation(360, 1.5, linear);
  });
  yield all(
    loadingCircle().opacity(1, 0.5),
    loadingCircle().scale(1, 0.5),
    patch().opacity(1, 0.5),
    patch().scale(1, 0.5)
  );

  yield* waitUntil("prototypeToDevelopment");

  lineProgress(0);
  patch().position(() => sectionConnections[0].getPointAtPercentage(lineProgress()).position);
  yield lineProgress(1, 1);
  yield chain(
    all(loadingCircle().opacity(0, 0.5), loadingCircle().scale(0.85, 0.5)),
    loadingCircle().position(developmentSection().position().addY(60), 0),
    all(loadingCircle().opacity(1, 0.5), loadingCircle().scale(1, 0.5)),
  );

  yield* waitUntil("developmentToQA");

  lineProgress(0);
  patch().position(() => sectionConnections[1].getPointAtPercentage(lineProgress()).position);
  yield lineProgress(1, 1);
  yield chain(
    all(loadingCircle().opacity(0, 0.5), loadingCircle().scale(0.85, 0.5)),
    loadingCircle().position(qaSection().position().addY(60), 0),
    all(loadingCircle().opacity(1, 0.5), loadingCircle().scale(1, 0.5)),
  );

  yield* waitUntil("qaToProduction");

  lineProgress(0);
  patch().position(() => sectionConnections[2].getPointAtPercentage(lineProgress()).position);
  yield lineProgress(1, 1);
  yield chain(
    all(loadingCircle().opacity(0, 0.5), loadingCircle().scale(0.85, 0.5)),
  );

  yield* waitUntil("endScene");

  yield* sequence(0.1,
    ...sectionCaptions.map(caption => caption.opacity(0, 0.5)),
    all(patch().opacity(0, 0.5), patch().scale(0.85, 0.5)),
    all(prototypeSection().opacity(0, 0.5), prototypeSection().height(0, 0.65)),
    all(developmentSection().opacity(0, 0.5), developmentSection().height(0, 0.65)),
    all(qaSection().opacity(0, 0.5), qaSection().height(0, 0.65)),
    all(productionSection().opacity(0, 0.5), productionSection().height(0, 0.65)),
  );
});
