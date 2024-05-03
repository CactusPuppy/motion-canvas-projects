import { makeProject } from "@motion-canvas/core";

import ch08_01 from "../../scenes/demon-lord/chapter08/ch08_01_playtesting?scene";
import ch08_02 from "../../scenes/demon-lord/chapter08/ch08_02_patch_flow?scene";
import ch08_03 from "../../scenes/demon-lord/chapter08/ch08_03_clear_vision?scene";

import ch08_audio from "../../../audio/demon-lord/chapter08_VO.mp3";

import "../../global.css";

export default makeProject({
  scenes: [ch08_01, ch08_02, ch08_03],
  audio: ch08_audio
})
