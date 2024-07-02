/**
 * Original code by jaonhax via the SCP wiki.
 * Adapted to work within Motion Canvas by CactusPuppy.
 *
 * Original code from https://scp-sandbox-3.wikidot.com/jaonhax:obfuscator-demos-and-source
 */

import { Txt, TxtProps, initial, signal } from "@motion-canvas/2d";
import { Random, SimpleSignal, usePlayback, useRandom, waitFor } from "@motion-canvas/core";

export interface TextScrambleProps extends TxtProps {
  obfuscationCharacters?: string;
}

interface TextScrambleCharacterInfo {
  previousCharacter: string;
  targetCharacter: string;
  beginScramble: number;
  endScramble: number;
  char?: string;
}

export default class TextScramble extends Txt {
  @initial(0.28)
  @signal()
  public declare readonly characterRerollProbability: SimpleSignal<number, this>;

  obfuscationChars: string;
  characterInfoQueue: TextScrambleCharacterInfo[];
  rng: Random;

  constructor(props?: TextScrambleProps) {
    super({
      ...props
    });
    this.obfuscationChars = props.obfuscationCharacters ?? '0123456789█!<>-_\\/[]{}—=+*^?#________';
    this.rng = useRandom();
  }

  public setObfuscationChars(obfuscationCharacters: string) {
    this.obfuscationChars = obfuscationCharacters;
  }

  public *updateText(newText: string, start: number, end: number) {
    // Construct the character information queue
    this.characterInfoQueue = [];
    const length = Math.max(this.text().length, newText.length);
    for (let i = 0; i < length; ++i) {
      this.characterInfoQueue.push({
        previousCharacter: this.text()[i] ?? "",
        targetCharacter: newText[i] ?? "",
        beginScramble: this.rng.nextInt(0, usePlayback().secondsToFrames(start)),
        endScramble: start + this.rng.nextInt(0, usePlayback().secondsToFrames(end)),
        char: undefined
      });
    }

    const frameDuration = usePlayback().framesToSeconds(1);
    const startFrame = usePlayback().frame;
    while (true) {
      let completedItems = 0;
      let output = "";
      const animationFrameCount = usePlayback().frame - startFrame;
      for (let i = 0; i < length; ++i) {
        let charInfo = this.characterInfoQueue[i];
        if (animationFrameCount >= charInfo.endScramble) {
          ++completedItems;
          output += charInfo.targetCharacter;
        } else if (animationFrameCount >= charInfo.beginScramble) {
          if (charInfo.char == undefined || this.rng.nextFloat() < this.characterRerollProbability()) {
            charInfo.char = this.randomChar();
          }
          output += charInfo.char;
        } else {
          output += charInfo.previousCharacter;
        }
      }
      yield this.text(output);
      if (completedItems == this.characterInfoQueue.length) break;
      yield* waitFor(frameDuration);
    }
  }

  private randomChar() {
    return this.obfuscationChars[this.rng.nextInt(0, this.obfuscationChars.length)];
  }
}
