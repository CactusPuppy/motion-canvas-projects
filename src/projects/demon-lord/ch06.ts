import {makeProject} from '@motion-canvas/core';

import ch06_tdm_scoreboard from '../../scenes/demon-lord/chapter06/ch06_tdm_scoreboard?scene';
import ch06_orisa_intro from '../../scenes/demon-lord/chapter06/ch06_orisa_intro?scene';
import ch06_lobby_slots from '../../scenes/demon-lord/chapter06/ch06_lobby_slots?scene';

import ch06_audio from "../../../audio/ch06_VO.wav";

export default makeProject({
  scenes: [ch06_tdm_scoreboard, ch06_orisa_intro, ch06_lobby_slots],
  audio: ch06_audio
});
