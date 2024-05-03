import { Rect, RectProps, Txt, Node, initial, signal } from "@motion-canvas/2d";
import { SimpleSignal } from "@motion-canvas/core";

export class LobbySlot extends Rect {
  @initial(1)
  @signal()
  public declare placeholderOpacity: SimpleSignal<number, this>;

  constructor(props: RectProps & { textColor?: string }) {
    super({fill: "#1e2133c0", width: 400, height: 60,
      layout: true, alignItems: "center", justifyContent: "center", ...props});

    this.add(<Node y={3}>
      <Txt fontFamily={"Config"} fontWeight={900} text={"EMPTY"} fontSize={20} opacity={this.placeholderOpacity} fill={() => props.textColor ?? "#9799a0"} />
    </Node>);
  }
}
