import {makeProject} from '@motion-canvas/core';

import respawnTimeline01 from '../../scenes/group-respawn/respawnTimeline01?scene';
import part02 from '../../scenes/group-respawn/part02?scene';
import part03 from '../../scenes/group-respawn/part03?scene';

import narration from "../../../audio/Version02/Version02.wav";

import '../../global.css';

export default makeProject({
  scenes: [respawnTimeline01, part02, part03],
  audio: narration
});
