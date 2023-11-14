import { Grid, Img, Layout, Line, Node, Rect, Txt, makeScene2D } from "@motion-canvas/2d";
import { Hero, HeroIcon } from "../components/HeroIcon";
import { KillfeedEntry } from "../components/KillfeedEntry";
import { Color, createRef, useLogger } from "@motion-canvas/core";

import pulseBomb from "../../images/abilities/Pulse Bomb.png";

export default makeScene2D(function* (view) {
  const width = 1920;
  const height = 1080;
  const spacing = 100;
  const padding = 36;

  const green = new Color("#45ff57");
  const red = new Color("#ff4545");
  const yellow = new Color("#fffa45");
  const orange = new Color("#ff9a45");

  const brigColor = new Color("rgb(139,98,94)");
  const anaColor = new Color("rgb(110,137,177)");

  const logger = useLogger();

  const killfeedEntry = createRef<KillfeedEntry>();
  // logger.info(`${killfeedEntry().position()}`);

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
    <Rect
      fill={orange}
      opacity={0.4}
      width={width/2}
      height={height*1.5}
      right={{x: -50, y: 0}}
    />
    <Line
      stroke={orange.darken(0.25)}
      lineWidth={16}
      lineDash={[48, 36]}
      lineCap={"round"}
      x={-50}
      shadowColor={orange.darken()}
      shadowBlur={16}
    >
      <Node y={-height/2} />
      <Node y={height/2} />
    </Line>
    <HeroIcon
      hero={Hero.Brigitte}
      x={500}
      y={-32}
      size={256}
      isFlat={true}
      radius={16}
    >
      <Rect
        stroke={brigColor.brighten(0.25)}
        shadowColor={brigColor.darken()}
        shadowBlur={16}
        lineWidth={12}
        radius={16}
        size={256}
      />
    </HeroIcon>
    <Line
      lineWidth={64}
      stroke={red.darken(0.25)}
      shadowColor={red.darken()}
      shadowBlur={16}
      endArrow={true}
      arrowSize={72}
      y={-32}
    >
      <Node x={500-128-16}/>
      <Node x={-50+5} />
    </Line>
    <HeroIcon
      hero={Hero.Ana}
      x={-600}
      y={32}
      size={256}
      isFlat={true}
      radius={16}
    >
      <Rect
        stroke={anaColor.brighten(0.25)}
        shadowColor={anaColor.darken()}
        shadowBlur={16}
        lineWidth={12}
        radius={16}
        size={256}
      />
    </HeroIcon>
    <Line
      lineWidth={64}
      stroke={green.darken(0.25)}
      shadowColor={green.darken()}
      shadowBlur={16}
      endArrow={true}
      arrowSize={72}
      y={32}
    >
      <Node x={-600+128+16}/>
      <Node x={-50-5} />
    </Line>
    <KillfeedEntry
      ref={killfeedEntry}
      killerName="Tracer"
      killerHero={Hero.Tracer}
      victimName="Ana"
      victimHero={Hero.Ana}
      nodeProps={{scale: 2.5, x: 100, y: -330, shadowColor: "black", shadowBlur: 64}}
      abilityIcon={(<Layout cache y={-4} layout justifyContent={"center"} alignItems={"center"}>
        <Img src={pulseBomb} size={64} />
        <Rect layout={false} size={64} fill={'black'} compositeOperation={"source-in"} />
      </Layout>)}
      abilityWasUltimate={true}
    />
    <>
      <Txt
        fontFamily={"Industry Black"}
        fill={"white"}
        shadowColor={"black"}
        fontSize={172}
        shadowBlur={32}
        x={-380}
        y={325}
      >
        GROUP
      </Txt>
      <Txt
        fontFamily={"Industry Black"}
        fill={"white"}
        shadowColor={"black"}
        fontSize={172}
        shadowBlur={32}
        x={400}
        y={325}
      >
        RESPAWN
      </Txt>
    </>
  </Node>);
  view.add(<Rect
    width={width - 2*padding}
    height={height - 2*padding}
    stroke={"#fff"}
    opacity={0.6}
    lineWidth={16}
    radius={padding/2}
  />);

  yield* killfeedEntry().animateIn();
});
