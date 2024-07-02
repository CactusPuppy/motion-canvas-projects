import { makeProject } from "@motion-canvas/core";

import what_if from "../../scenes/thank-you-workshop/what-if-overwatch?scene";
import lifted from "../../../audio/thank-you-workshop/Benjamin Squires - Lifted.mp3";

import "../../global.css";

export default makeProject({
  scenes: [what_if],
  audio: lifted
})
