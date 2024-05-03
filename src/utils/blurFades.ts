import { Node } from "@motion-canvas/2d";
import { easeOutCubic, all } from "@motion-canvas/core";

export function* blurFadeIn(object: Node, duration = 1, maxBlur = 8, finalOpacity = 1, initialScale = 0.8, finalScale = 1, timingFunction = easeOutCubic) {
  object.filters.blur(maxBlur);
  object.opacity(0);
  object.scale(initialScale);

  yield* all(
    object.filters.blur(0, duration, timingFunction),
    object.opacity(finalOpacity, duration, timingFunction),
    object.scale(finalScale, duration, timingFunction)
  );
}

export function* blurFadeOut(object: Node, duration = 1, maxBlur = 8, finalScale = 0.8, timingFunction = easeOutCubic) {
  yield* all(
    object.filters.blur(maxBlur, duration, timingFunction),
    object.opacity(0, duration, timingFunction),
    object.scale(finalScale, duration, timingFunction)
  );
}
