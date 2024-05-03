import { Layout, LayoutProps, Rect, Txt, initial, signal, Node, Line } from "@motion-canvas/2d";
import { Color, SimpleSignal } from "@motion-canvas/core";

export interface TDMScoreboardProps extends LayoutProps {
  team1Score?: number;
  team1ScoreMax?: number;
  team2Score?: number;
  team2ScoreMax?: number;
}

export class TDMScoreboard extends Layout {
  @initial(0)
  @signal()
  public declare team1Score: SimpleSignal<number, this>;

  @initial(50)
  @signal()
  public declare team1ScoreMax: SimpleSignal<number, this>;

  @initial(0)
  @signal()
  public declare team2Score: SimpleSignal<number, this>;

  @initial(50)
  @signal()
  public declare team2ScoreMax: SimpleSignal<number, this>;

  constructor(props: TDMScoreboardProps) {
    super({layout: true, gap: 30, alignItems: "center", ...props});

    const team1Color = new Color("#3dccf7");
    const team2Color = new Color("#f44555");
    const textBgFillOpacity = 1;
    const textDecorationOpacity = 0.75;
    const textBgHeight = 66;

    this.team1Score(props.team1Score ?? 0);
    this.team1ScoreMax(props.team1ScoreMax ?? 50);
    this.team2Score(props.team2Score ?? 0);
    this.team2ScoreMax(props.team2ScoreMax ?? 50);

    this.add(<Rect layout width={75} alignItems={"center"} justifyContent={"center"}>
      <Node x={-1}>
        <Txt
          textAlign={"center"}
          fontSize={50}
          fill={"white"}
          text={() => ` ${Math.round(this.team1Score()).toString()} `}
          textWrap={"pre"}
          fontFamily={"BigNoodleTooOblique"}
          shadowBlur={4}
          shadowColor={"black"}
        />
      </Node>
      <Rect
        x={3}      y={-3}
        width={75} height={textBgHeight}
        skewX={15}
        fill={team1Color.darken(2.5)}
        opacity={textBgFillOpacity}
        zIndex={-1}
        layout={false}
        radius={4}
        clip={true}
      >
        <Rect
          position={() => [0, (this.team1ScoreMax() - this.team1Score()) / this.team1ScoreMax() * textBgHeight / 2]}
          height={() => this.team1Score() / this.team1ScoreMax() * textBgHeight}
          fill={team1Color}
          width={1000}
        />
      </Rect>
      <Line
        points={[
          [4, -44],
          [39, -44],
          [59, 34],
          [66, 38]
        ]}
        layout={false}
        lineWidth={3}
        stroke={team1Color.brighten(0.4)}
        lineCap={"round"}
        opacity={textDecorationOpacity}
      />
      <Line
        points={[
          [58, -5],
          [66, 28],
          [86, 38]
        ]}
        layout={false}
        lineWidth={3}
        stroke={team1Color.brighten(0.4)}
        lineCap={"round"}
        opacity={textDecorationOpacity}
      />
    </Rect>);

    this.add(<Node x={6}>
      <Txt
        text="VS "
        textWrap={"pre"}
        fontSize={52}
        fontFamily={"BigNoodleTooOblique"}
        fill="white"
        shadowBlur={2}
        shadowColor={"black"}
      />
    </Node>);

    this.add(<Rect layout width={75} alignItems={"center"} justifyContent={"center"}>
    <Node x={-1}>
      <Txt
        textAlign={"center"}
        fontSize={50}
        fill={"white"}
        text={() => ` ${Math.round(this.team2Score()).toString()} `}
        textWrap={"pre"}
        fontFamily={"BigNoodleTooOblique"}
        shadowBlur={4}
        shadowColor={"black"}
      />
    </Node>
    <Rect
      x={5}
      y={-3}
      width={75}
      height={textBgHeight}
      skewX={-15}
      fill={team2Color.darken(2.5)}
      opacity={textBgFillOpacity}
      zIndex={-1}
      layout={false}
      radius={4}
      clip
    >
      <Rect
        position={() => [0, (this.team2ScoreMax() - this.team2Score()) / this.team2ScoreMax() * textBgHeight / 2]}
        height={() => this.team2Score() / this.team2ScoreMax() * textBgHeight}
        fill={team2Color}
        width={1000}
      />
    </Rect>
    <Node x={8}>
      <Line
          points={[
            [-4, -44],
            [-39, -44],
            [-59, 34],
            [-66, 38]
          ]}
          layout={false}
          lineWidth={3}
          stroke={team2Color}
          lineCap={"round"}
          opacity={textDecorationOpacity}
        />
        <Line
          points={[
            [-58, -5],
            [-66, 28],
            [-86, 38]
          ]}
          layout={false}
          lineWidth={3}
          stroke={team2Color}
          lineCap={"round"}
          opacity={textDecorationOpacity}
        />
    </Node>
  </Rect>);
  }
}


