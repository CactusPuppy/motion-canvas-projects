import { Layout, Node } from "@motion-canvas/2d";
import { Direction, Origin, Vector2, all, easeInCubic, easeOutCubic, useLogger } from "@motion-canvas/core";

export function* slideFadeIn(object: Layout, duration = 0.75, direction = Direction.Bottom, initialDisplacement = 0.25, timingFunction = easeOutCubic) {
  object.save();

  yield* all(object.position(object.position().add(object.size().getOriginOffset(direction).scale(initialDisplacement)), 0), object.opacity(0, 0));

  yield* object.restore(duration, timingFunction);
}

export function* slideFadeOut(object: Layout, duration = 0.75, direction = Direction.Bottom, initialDisplacement = 0.25, timingFunction = easeInCubic) {
  const logger = useLogger();
  logger.debug(object.position().add(object.size().getOriginOffset(direction).scale(initialDisplacement)).toString());

  yield* all(
    object.position(object.position().add(object.size().getOriginOffset(direction).scale(initialDisplacement)), duration, timingFunction),
    object.opacity(0, duration, timingFunction)
  );
}
