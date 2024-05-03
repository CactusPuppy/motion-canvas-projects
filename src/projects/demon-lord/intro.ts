import { makeProject } from "@motion-canvas/core";

import ch01_01_intro_context from "../../scenes/demon-lord/chapter01/ch01_01_intro_context?scene";

import intro_context_audio from "../../../audio/demon-lord/intro_context_final_VO_001.wav";

import "../../global.css";

export default makeProject({
  scenes: [ch01_01_intro_context],
  audio: intro_context_audio
})
