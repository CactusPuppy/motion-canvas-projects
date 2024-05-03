import { Circle, ComponentChildren, Gradient, Img, Layout, Node, NodeProps, Rect, SVG, Txt, blur, initial, signal } from "@motion-canvas/2d";
import { Hero, HeroIcon } from "./HeroIcon";
import { Color, PossibleVector2, Reference, SimpleSignal, Vector2, all, createRef, delay, easeInCubic, easeInQuint, easeOutCirc, easeOutCubic, easeOutQuad, easeOutQuint, linear, useLogger } from "@motion-canvas/core";

import critIcon from "../../images/icons/killfeed_crit.svg?raw";
import arrow from "../../images/icons/killfeed_arrow_probably.svg?raw";

export interface KillfeedEntryProps extends NodeProps {
  nodeProps?: NodeProps;

  abilityIcon?: Node;
  abilityWasUltimate?: boolean;
  hideKiller?: boolean;
  killerName: string;
  killerHero: Hero;
  killerTeamColor?: Color;
  victimName: string;
  victimHero: Hero;
  victimTeamColor?: Color;
  wasCrit?: boolean;
}
export class KillfeedEntry extends Node {
  protected layout: Reference<Layout> = createRef<Layout>();

  protected cover: Reference<Rect> = createRef<Rect>();
  protected killer: Reference<Rect> = createRef<Rect>();
  protected killerBg: Reference<Rect> = createRef<Rect>();
  protected victim: Reference<Rect> = createRef<Rect>();
  protected victimLeftBorder: Reference<Rect> = createRef<Rect>();
  protected connector: Reference<Rect> = createRef<Rect>();

  @signal()
  @initial(0)
  protected declare _paddingRight: SimpleSignal<number, this>;

  @signal()
  @initial(0)
  protected declare _killerBgXOffset: SimpleSignal<number, this>;

  @signal()
  protected declare readonly _anchor: SimpleSignal<Vector2, this>;

  constructor(props?: KillfeedEntryProps) {
    const killerTeamColor = props.killerTeamColor ?? new Color("#25cced");
    const victimTeamColor = props.victimTeamColor ?? new Color("#e72f51");

    super({...props.nodeProps});

    // const layout = new Layout({
    //   ...props,
    //   ref: this.layout,
    //   gap: 4,
    //   alignItems: "center",
    //   paddingRight: () => this._paddingRight(),
    //   layout: true,
    //   opacity: 0});
    const layout = (<Layout
      {...props}
      ref={this.layout}
      gap={4}
      alignItems={"center"}
      paddingRight={() => this._paddingRight()}
      layout={true}
      opacity={0}
    />);


    if (!props.hideKiller) layout.add(
      <Rect ref={this.killer} layout height={64} clip={true} radius={4} paddingLeft={() => 16 - this._killerBgXOffset()} alignItems={"center"}>
        <Txt fontFamily={"Config Monospace"} fontSize={32} fill="#fff" marginTop={6}>{props.killerName.toUpperCase()}</Txt>
        <Rect layout fill="#0008" width={96} height={60} marginLeft={12} radius={4} clip={true} alignSelf={"center"} justifyContent={"center"} alignItems={"center"}>
          <HeroIcon hero={props.killerHero} size={1.5 * 64} isFlat={true} />
        </Rect>
        <Rect fill={killerTeamColor} width={8} height={64} marginLeft={8} />
        <Rect ref={this.killerBg} layout={false} size={() => this.killer().size()} fill={killerTeamColor.alpha(0.6)} zIndex={-1} x={this._killerBgXOffset}/>
      </Rect>
    );

    let connectorPaddingLeft = 8;
    if (props.abilityIcon) {
      if (props.abilityWasUltimate) {
        connectorPaddingLeft = -64;
      } else {
        connectorPaddingLeft = 4;
      }
    }

    const connectorBgColor = new Color("#000").alpha(0.6)
    layout.add(<Rect
      ref={this.connector}
      layout
      height={56}
      radius={4}
      gap={props.abilityIcon ? 12 : 0}
      paddingLeft={props.abilityIcon ? 8 : 12}
      padding={12} alignItems={"center"}
      fill={connectorBgColor}/>);


    if (props.abilityIcon) {
      if (props.abilityWasUltimate) {
        this.connector().add(<Circle layout={false} position={() => props.abilityIcon.position()} size={70} fill='white' shadowColor={"#19bef6"} shadowBlur={32} />);
        this.connector().fill(() => new Gradient({from: props.abilityIcon.position(), to: this.connector().right(), stops: [{color: "#0000", offset: 0}, {color: connectorBgColor, offset: 0.00001}]}))
      }

      this.connector().add(props.abilityIcon);
    }

    if (props.wasCrit) {
      this.connector().add(<SVG svg={critIcon} size={40} marginRight={-2} fill={'red'} filters={[blur(0.75)]} />);
    }
    const arrowAspectRatio = 12.845 / 22.59;
    const arrowHeight = 42;
    const arrowWidth = arrowHeight * arrowAspectRatio;
    this.connector().add(<SVG svg={arrow} size={[arrowWidth, arrowHeight]} fill={'white'} shadowColor={'black'} filters={[blur(0.75)]} shadowBlur={5}/>);


    layout.add(
      <Rect layout ref={this.victim} height={64} clip={true} radius={4} paddingRight={18} alignItems={"center"} fill={victimTeamColor.alpha(0.6)}>
        <Rect ref={this.victimLeftBorder} marginLeft={-2} fill={victimTeamColor.alpha(0.95)} width={8} height={64} zIndex={1} />
        <Rect layout fill="#0008" width={96} height={60} marginLeft={-4} radius={4} clip={true} alignSelf={"center"} justifyContent={"center"} alignItems={"center"}>
          <HeroIcon hero={props.victimHero} size={1.5 * 64} isFlat={true} />
        </Rect>
        <Txt fontFamily={"Config Monospace"} fontSize={32} fill="#fff" marginLeft={12} marginTop={6}>{props.victimName.toUpperCase()}</Txt>
      </Rect>
    );

    layout.add(<Rect ref={this.cover} layout={false} size={() => this.layout().size()} fill={'white'}/>);
    this.add(layout);
  }

  public *animateIn() {
    const anchor = this.layout().right();

    this.layout().opacity(1);
    const init_anchorOffset = 200;
    this.position(this.position().addX(-init_anchorOffset));
    this.layout().scale([1, 0.1]);
    this.layout().gap(64);
    this._paddingRight(16);
    this.killer().opacity(0);
    this.victim().opacity(0);
    this.victimLeftBorder().opacity(0);

    this.connector().opacity(0);

    const durationScalar = 1 / 60;
    yield* all(
      // parent
      this.layout().scale([1, 1], durationScalar * 11, easeOutQuad),
      this.position(this.position().addX(init_anchorOffset), durationScalar * 5, easeOutCubic),
      // victim
      delay(durationScalar * 4, this.victim().opacity(1, 0)),
      // cover
      this.cover().opacity(0, durationScalar * 8, easeInCubic),
      // connector
      delay(durationScalar * 5, this.connector().opacity(1, durationScalar * 6, easeOutCirc)),
      // spacings
      delay(durationScalar * 5, this.layout().gap(4, durationScalar * 6, easeOutCubic)),
      delay(durationScalar * 4, this._paddingRight(0, durationScalar * 7, easeOutCubic)),
    );

    const init_killerBgXOffset = 50;
    this._killerBgXOffset(-init_killerBgXOffset);

    yield* all(
      // victim
      this.victimLeftBorder().opacity(1, durationScalar * 4, linear),
      // killer
      this.killer().opacity(0.25).opacity(1, durationScalar * 4, linear),
      this._killerBgXOffset(this._killerBgXOffset() + init_killerBgXOffset, durationScalar * 4, easeOutCubic),
    );
  }

  public *animateOut() {
    const durationScalar = 1 / 60;

    yield* all(
      this.position(this.position().addY(16), durationScalar * 15, linear),
      this.layout().opacity(0, durationScalar * 18, linear),
      this.killer().opacity(0, durationScalar * 15, linear),
    );

    this.remove();
  }
}

export class StandaloneKillfeedEntry extends KillfeedEntry {
  // TODO
}
