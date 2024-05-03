import { makeProject } from "@motion-canvas/core";

import credits_scene from "../../scenes/demon-lord/credits/credits?scene";

import credits_music from "../../../audio/demon-lord/well_meet_again_abridged.wav";

import "../../global.css";

export default makeProject({
  scenes: [credits_scene],
  audio: credits_music
})
