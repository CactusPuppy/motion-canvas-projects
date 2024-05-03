import { makeProject } from "@motion-canvas/core";

import ch07_01_comeback from "../../scenes/demon-lord/chapter07/ch07_01_comeback?scene";
import ch07_02 from "../../scenes/demon-lord/chapter07/ch07_02_focusing?scene";
import ch07_03_rein_buffs from "../../scenes/demon-lord/chapter07/ch07_03_rein_buffs?scene";
import ch07_04_optimizing_out_fun from "../../scenes/demon-lord/chapter07/ch07_04_optimizing_out_fun?scene";

import ch07_audio from "../../../audio/demon-lord/chapter07_VO.wav";

import "../../global.css";

export default makeProject({
  scenes: [ch07_01_comeback, ch07_02, ch07_03_rein_buffs, ch07_04_optimizing_out_fun],
  audio: ch07_audio
});
