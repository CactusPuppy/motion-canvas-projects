import { Layout, Node } from "@motion-canvas/2d";
import { ThreadGenerator, createSignal, easeInCubic, easeInOutCubic, easeOutCubic, loopFor, useLogger } from "@motion-canvas/core";

export default function* emphasisShake(object: Node, duration = 0.6, maxAngle = 7, numShakes = 4, timingFunction = easeInOutCubic): ThreadGenerator {
  const logger = useLogger();
  const singleShakeDuration = duration / numShakes;
  const initialRotation = object.rotation();
  const shakeStrength = createSignal(0);
  yield shakeStrength(1, duration / 2).to(0, duration / 2);
  yield* loopFor(singleShakeDuration * (numShakes - 1), function* () {
    // logger.info(`currentShakeStrength: ${shakeStrength()}`);
    yield* object.rotation(initialRotation - maxAngle * shakeStrength(), singleShakeDuration / 2, timingFunction);
    // logger.info(`currentShakeStrength: ${shakeStrength()}`);
    yield* object.rotation(initialRotation + maxAngle * shakeStrength(), singleShakeDuration / 2, timingFunction);
  }
  );
  yield* object.rotation(initialRotation, singleShakeDuration / 2);
}
