/**
 * ! NOTE: Rendering this scene in Chromium-based browsers results in jittering offsets between various text elements.
 * ! The commented out code near the infinite loop resolves this issue by replacing the default interpolation with a loop
 * ! that moves the text up by 1 pixel every so often instead. However, this is not as smooth as the default interpolation.
 * ! Therefore, it is recommended that you render the scene in Firefox.
 */

import {Circle, Img, Layout, LayoutProps, Line, makeScene2D, Node, Rect, SVG, Txt} from '@motion-canvas/2d';
import {all, chain, createRef, createSignal, delay, easeInCubic, linear, loop, PlaybackState, useDuration, useLogger, usePlayback, useScene, waitFor, waitUntil} from '@motion-canvas/core';

import resolveLogo from "../../../../images/icons/DaVinci-Resolve-Logo-220x220.png";
import resolveLogo2 from "../../../../images/icons/DAVINCIRESOLVE18.svg?raw";
import audacityLogo from "../../../../images/icons/Audacity_Logo.png";
import motionCanvasLogo from "../../../../images/icons/motion_canvas_(dark).svg";
import blenderLogo from "../../../../images/icons/blender_logo_socket.svg";

import powerups_image from "../../../../images/demon_lord/credits/powerups_2.20.1.png";
import shatter_360 from "../../../../images/demon_lord/credits/rein_360_shatter_1.1.2.png";
import keyart_01 from "../../../../images/demon_lord/credits/OW2_S5_Team_Illustration_png_jpgcopy.jpg";
import devil_pharah from "../../../../images/demon_lord/credits/pharah_devil_skin.png";
import lifeweaver_pull from "../../../../images/demon_lord/credits/lifeweaver_pull_queen_away_from_rein_1.1.1.png";
import keyart_02 from "../../../../images/demon_lord/credits/OW2_S5_Campfire_png_jpgcopy.jpg";
import development_timer from '../../../../images/demon_lord/credits/delivery_deadline_timer_2.40.1.png';
import flats_orsia_pull from "../../../../images/demon_lord/credits/flats_orisa_pull.png";
import aloy_and_angry_elephant from "../../../../images/demon_lord/credits/aloy_and_angry_elephant_1.1.4.png";
import cat_001 from '../../../../images/demon_lord/credits/cat_001.jpg';
import cat_002 from '../../../../images/demon_lord/credits/cat_002.jpg';

import hero_lineup from "../../../../images/demon_lord/credits/lineup_04.webp";

import creditsRaw from "./credits.md?raw";

export default makeScene2D(function* (view) {
  const logger = useLogger();
  const creditsX = createSignal(-450);
  const creditsY = createSignal(0);

  if (usePlayback().state !== PlaybackState.Rendering) {
    view.fill("#000000aa");
  }

  yield* waitUntil("credit01");
  const credit01 = createRef<Layout>();
  view.add(<Layout ref={credit01} layout direction={"column"} alignItems={"center"} scale={1.25}>
    <Txt fill="white" fontFamily={"Config"} fontSize={36} text={"Written and Directed By"}/>
    <Txt fill="white" fontFamily={"Config Monospace"} fontSize={66} text={"CactusPuppy"}/>
  </Layout>);

  yield* waitUntil("credit02");
  credit01().removeChildren();
  credit01().add(<>
    <Txt fill="white" fontFamily={"Config"} fontSize={36} text={"Script Edited By"}/>
    <Txt fill="white" fontFamily={"Config Monospace"} fontSize={66} text={"hiya"}/>
  </>);

  /** Left-side column content */

  const creditsContainer = createRef<Layout>();
  view.add(<Layout x={() => creditsX()} y={() => creditsY()}>
    <Layout ref={creditsContainer} layout direction={"column"} alignItems={"center"} width={850} gap={32}/>
  </Layout>);

  const credits = creditsRaw.split("\n");
  credits.forEach((credit) =>  {
    creditsContainer().add(convertCreditToJSX(credit));
  });

  const resolveLogoRef = createRef<Img>();
  const audacityIconRef = createRef<Img>();
  creditsContainer().add(<>
    <Txt fill="white" fontFamily={"Config Monospace"} fontSize={26}>
      THIS PRODUCTION WAS MADE POSSIBLE WITH
    </Txt>
    <Layout layout direction="row" gap={16} width="100%">
      <Layout direction={"column"} alignItems={"center"} grow={1}>
        <Node cache>
          <Img src={audacityLogo} ref={audacityIconRef} width={220} height={220} marginTop={20} />
        </Node>
        <Txt fill="white" fontFamily={"Open Sans"} fontWeight={500} textAlign={"center"}>Audacity</Txt>
      </Layout>
      <Layout direction={"column"} alignItems={"center"} grow={1} gap={8}>
        <Img src={resolveLogo} ref={resolveLogoRef} width={220} height={220} marginTop={20} />
        <SVG svg={resolveLogo2} width={183.403} height={15.84} scale={1.5} marginTop={20} />
      </Layout>
    </Layout>
    <Layout layout direction="row" gap={16} width="100%">
      <Layout direction={"column"} alignItems={"center"} grow={1.5}>
        <Img src={motionCanvasLogo} width={240} height={240} />
        <Txt fill="white" fontFamily={"Fira Code"} fontWeight={600} fontSize={36} textAlign={"center"}>Motion Canvas</Txt>
        <Txt fill="white" fontFamily={"Fira Code"} fontWeight={300} fontSize={26} textAlign={"center"}>motioncanvas.io</Txt>
      </Layout>
      <Layout direction={"column"} alignItems={"center"} grow={1}>
        <Img src={blenderLogo} width={350} height={107} marginTop={80} />
        <Rect height={52} />
        <Txt fill="white" fontFamily={"Fira Code"} fontWeight={600} fontSize={36} textAlign={"center"}>Blender</Txt>
        <Txt fill="white" fontFamily={"Fira Code"} fontWeight={300} fontSize={26} textAlign={"center"}>blender.org</Txt>
      </Layout>
    </Layout>
  </>);
  audacityIconRef().filters.contrast(0.9);

  /** Right-side column content */

  const bonusContentContainer = createRef<Layout>();
  view.add(<Layout ref={bonusContentContainer} paddingLeft={60} paddingBottom={72} layout direction={"column"} justifyContent={"space-between"} width={850} height={() => creditsContainer().height()} topLeft={() => creditsContainer().topRight().transformAsPoint(creditsContainer().parent().localToParent())}>
    <Layout direction={"column"} gap={16}>
      <Txt fontFamily={"Config Monospace"} fontWeight={200} fontSize={64} fill={"white"} textAlign={"center"} text={"FAQs + Bonus Content"} />
      <FAQ question={"I found the gamemode boring/unfun!"} answer={"That’s valid! I had to strike a balance between making the mode too complex for all players to pick up and being too simple to be interesting. I also had to land somewhere in terms of Rein’s power level in relation to the heroes while preventing the mode from becoming hide and seek as Rein skipped from one power-up to the next, avoiding engagements. Whether or not I hit the right balance is something I continue to think about. That being said, I also think some players don’t like the concept of a kill-based objective or needing to remain guarded against potential threats at all times, and that’s okay!"} />
    </Layout>

    <Layout direction={"column"}>
      <Layout>
        <Node x={-70} y={-20}>
          <Img src={powerups_image} width={850} height={478} scale={0.67} stroke="white" lineWidth={24} radius={8} rotation={-7} />
        </Node>
        <Layout x={175} y={175} layout={false}>
          <Img src={shatter_360} width={850} height={478} scale={0.67} stroke="white" lineWidth={24} radius={8} rotation={3} />
        </Layout>
      </Layout>
      <Rect height={130} />
      <Txt fill="white" textWrap={true} fontFamily={"Industry"} fontSize={24} text={"The visuals received a relatively large portion of attention; since I didn't include any written instructions on how to play the mode in-game, it was crucial players understood what was happening via visuals alone."} />
      <Txt fill="white" textWrap={true} fontFamily={"Industry"} fontSize={24} text={"The decision to avoid written instructions was driven by both Workshop limitations and inspiration from the design of games such as Journey and ABZU, which never prompt the player with text instructions."} />
    </Layout>

    <Layout direction="column">
      <Layout>
        <Node x={-20}>
          <Img src={keyart_01} width={850} height={478} scale={0.67} stroke="white" lineWidth={24} radius={8} />
        </Node>
        <Layout layout={false}>
          <Node x={290} y={70}>
            <Img src={devil_pharah} width={758 * 0.3} height={1219 * 0.3} scale={0.67} stroke="white" lineWidth={24} radius={8} />
          </Node>
        </Layout>
      </Layout>
      <Txt fill="white" textWrap={true} marginTop={-16} fontFamily={"Industry"} fontSize={26} text={"Very early alpha versions of this mode had Pharah as a playable character on the side of the heroes, though this idea was quickly scrapped for reasons that should be obvious. Fortunately this also helped the mode remain thematically consistent, as Pharah's Season 5 skin turned out to be a Devil skin."} />
    </Layout>

    <FAQ question={"Were you paid to work on this project?"} answer={"Yes, for around 40 hours of work, I got paid $1500, which works out to around $37 per hour. For what this project was, I’m personally quite happy with that rate."} />

    <Layout direction="column">
      <Layout>
        <Node >
          <Img src={aloy_and_angry_elephant} width={1409 * 0.6} height={832 * 0.6} scale={0.8} stroke="white" lineWidth={24} radius={8} rotation={6} />
        </Node>
      </Layout>
      <Rect height={30} />
      <Txt fill="white" textWrap={true} marginTop={-16} fontFamily={"Industry"} fontSize={26} text={"Horizon's movement system for combat, especially in Forbidden West, is very fluid and satisfying to master. Since mobility abilities in Overwatch are similarly satisfying to use, the connection was obvious (to me)."} />
    </Layout>

    <Img src={development_timer} width={850} height={478} scale={0.85} stroke="white" lineWidth={24} radius={8} rotation={-2} />

    <Layout direction="column">
      <Img src={flats_orsia_pull} width={850} height={478} scale={0.85} stroke="white" lineWidth={24} radius={8} rotation={4} />
      <Rect height={30} />
      <Txt fill="white" textWrap={true} marginTop={-16} fontFamily={"Industry"} fontSize={26} text={"As a precaution against putting the Demon Lord at too great a disadvantage, I added a system that counted environmental eliminations as damage instead of a full kill, which turned out to be a good bit of foresight, as demonstrated here. However, some players found this mechanic was confusing and/or not properly communicated, which I agree with."} />
    </Layout>

    <FAQ question={"The gamemode was alright, but I feel like it was kind of underwhelming for a featured mode…"} answer={"That’s fair! One thing I will note is that I was very hesitant to add any kind of text to the mode, as text would require translation. I wish I had had more time to deliver a more ambitious experience, but since I didn’t have as much time as Blizzard and I had originally hoped, I chose to focus on delivering something that was polished enough to be a good experience as opposed to an ambitious vision that was too unpolished to be enjoyable or something that took so much dev time that it would never see the light of day."} />

    <Img src={lifeweaver_pull} width={850} height={478} scale={0.85} stroke="white" lineWidth={24} radius={8} rotation={-3} />

    <Img src={keyart_02} width={850} height={478} scale={0.9} stroke="white" lineWidth={24} radius={8} rotation={0} />

    <Layout direction="column">
      <Node x={-30}><Img src={cat_001} width={605} height={454} scale={0.85} stroke="white" lineWidth={24} radius={8} rotation={-4} /></Node>
      <Layout x={270} y={0} layout={false}>
        <Img src={cat_002} width={454} height={605} scale={0.65} stroke="white" lineWidth={24} radius={8} rotation={4} />
      </Layout>
      <Rect height={30} />
      <Txt fill="white" textWrap={true} marginTop={-16} fontFamily={"Industry"} fontSize={26} text={"Bug - hiya's cat"} textAlign={"center"} />
    </Layout>
  </Layout>)

  /** Final content */

  const theEnd = createRef<Rect>();
  const theEndTitle_bg = createRef<Layout>();
  const theEnd_img_scale = 0.6;
  view.add(<Rect layout direction={"column"} ref={theEnd} height="100%" width="100%" justifyContent="center" alignItems="center"
    top={() => [0, Math.max(-useScene().getSize().y * 0.5, creditsY() + creditsContainer().size().y / 2 + 350)]}>
    <Img src={hero_lineup} width={2438 * theEnd_img_scale} height={1463 * theEnd_img_scale} marginTop={-50} />
    <Layout ref={theEndTitle_bg} layout={false}>
      <Txt fontSize={500} fontWeight={800} y={300} fontFamily={"Config"} fill="white">
        The End
      </Txt>
    </Layout>
  </Rect>);

  yield creditsY(Math.floor(useScene().getSize().height / 2 + creditsContainer().size().y / 2));
  yield* waitUntil("startCredits");
  yield function* () {
    yield* credit01().opacity(0, 0.25);
    credit01().remove();
  }();
  // yield* creditsContainer().bottom([0, -useScene().getSize().height / 2], useDuration("creditsScroll"), linear);
  const targetDuration = usePlayback().secondsToFrames(useDuration("creditsScroll"));
  const distance = Math.ceil(-useScene().getSize().height / 2 - creditsContainer().size().y / 2) - creditsY();
  const waitDuration = usePlayback().framesToSeconds(Math.abs(targetDuration / distance));
  // logger.info(`targetDuration: ${targetDuration}, distance: ${distance}, waitDuration: ${waitDuration}`);
  yield loop(Infinity, function* () {
    // creditsY(creditsY() - 1);
    // yield* waitFor(waitDuration);
    yield* creditsY(creditsY() + distance, usePlayback().framesToSeconds(targetDuration), linear);
  });
  yield* waitFor(targetDuration / usePlayback().fps);
  yield* waitUntil("fadeThanks");
  const fadeDuration = useDuration("thanksFade");
  yield all(
    theEnd().opacity(0, fadeDuration, easeInCubic),
    theEnd().filters.blur(8, fadeDuration, linear)
  );

  yield* waitUntil("endScreen01");
  view.removeChildren();
  const outerVerticalPadding = 140;
  const outerHorizontalPadding = 42;
  const recVideo01 = createRef<Rect>();
  view.add(<Rect
    ref={recVideo01}
    position={[-450, 160]}
    width={622}
    height={351}
    stroke="white"
    lineWidth={8}
    // end={recVideo01Open}
    lineDash={[16,32]}
    lineCap="round"
    radius={20}
    opacity={0} />);
  yield recVideo01().opacity(1, 0.05);
  yield* waitUntil("endScreen02");
  const recVideo02 = createRef<Rect>();
  view.add(<Rect
    ref={recVideo02}
    position={[450, 160]}
    width={622}
    height={351}
    stroke="white"
    lineWidth={8}
    // end={recVideo02Open}
    lineDash={[16,32]}
    lineCap="round"
    radius={20}
    opacity={0} />);
  yield recVideo02().opacity(1, 0.05);
  yield* waitUntil("endScreen03");
  const recChannel = createRef<Circle>();
  view.add(<Circle
    ref={recChannel}
    position={[0, -220]}
    size={298}
    stroke="white"
    lineWidth={16}
    lineCap="round"
    opacity={0} />);
  yield recChannel().opacity(1, 0.05);

  yield* waitUntil("endScene");
});

function convertCreditToJSX(credit: string) {
  const logger = useLogger();
  credit = credit.trim();
  const creditDisplay = credit.replace(/\\n/g, "\n");
  const containsNewlines = creditDisplay.includes("\n");

  // Separator line
  if (credit.match(/^-{3,}$/)) {
    // logger.info("Separator line");
    return (<Rect width="80%" height={4} fill="white" marginTop={16} marginBottom={16}/>);
  }

  // TITLE
  if (credit.startsWith("# ")) {
    return (<Txt fill="white" fontFamily={"Config Monospace"} fontWeight={200} fontSize={60} textWrap={containsNewlines ? "pre" : true} textAlign={"center"}>
      {creditDisplay.slice(2)}
    </Txt>);
  }
  // HEADING
  if (credit.startsWith("## ")) {
    return (<Txt fill="white" fontFamily={"Config"} fontWeight={600} fontSize={36} marginBottom={-16} textWrap={containsNewlines ? "pre" : true} textAlign={"center"} >
      {creditDisplay.slice(3)}
    </Txt>);
  }
  // Main credit
  if (credit.startsWith("* ")) {
    return (<Txt fill="white" fontFamily={"Industry"} fontWeight={600} fontSize={26} textWrap={containsNewlines ? "pre" : true} textAlign={"center"}>
      {creditDisplay.slice(2)}
    </Txt>);
  }

  // GRID
  if (credit.match(/^\\ (.*?) \| (.*)$/)) {
    const match = credit.match(/^\\ (.*?) \| (.*)$/);

    const creditGrid = createRef<Layout>();
    const creditTitleAnchor = createRef<Layout>();
    const creditTitle = createRef<Layout>();
    const creditContentAnchor = createRef<Layout>();
    const creditContent = createRef<Layout>();
    const height = createSignal(0);

    const result = (<Layout layout direction="row" width="100%" height={() => height()} ref={creditGrid} gap={16}>
      <Layout ref={creditTitleAnchor} grow={1} />
      <Layout layout={false} ref={creditTitle} height={() => height()}>
        <Txt fill="white" topRight={() => [creditTitle().size().x / 2, -creditTitle().size().y / 2]} fontFamily={"Industry"} fontWeight={600} fontSize={26} textAlign={"right"} textWrap={"pre"}>{match[1].replace("\\n", "\n")}</Txt>
      </Layout>
      <Layout ref={creditContentAnchor} grow={1} />
      <Layout layout={false} ref={creditContent} height={() => height()}>
        <Node y={1}>
          <Txt fill="white" topLeft={() => [-creditContent().size().x / 2, -creditContent().size().y / 2]} fontSize={26} textAlign={"left"} fontFamily={"Barlow"} textWrap={"pre"} fontWeight={300}>{match[2].split(", ").join("\n")}</Txt>
        </Node>
      </Layout>
    </Layout>);

    height(() => Math.max(creditTitle().findFirst<Txt>(node => node instanceof Txt).size().y, creditContent().findFirst<Txt>(node => node instanceof Txt).size().y));

    creditTitle().bottomRight(() => creditTitleAnchor().bottomRight());
    creditContent().bottomLeft(() => creditContentAnchor().bottomLeft());

    return result;
  }

  // GRID 3 COLUMN
  if (credit.startsWith("||| ")) {
    const allNames = creditDisplay.slice(4).split(", ");
    const columnLength = Math.ceil(allNames.length / 3);
    const column1 = allNames.slice(0, columnLength);
    const column2 = allNames.slice(columnLength, columnLength * 2);
    const column3 = allNames.slice(columnLength * 2);

    return (<Layout layout direction="row" marginTop={-24} width={850}>
      <Layout direction="column" gap={4} grow={1}>
        {column1.map((name) => <Txt fill="white" fontFamily={"Barlow"} fontWeight={300} fontSize={20} text={name} textAlign={"left"} />)}
      </Layout>
      <Layout direction="column" gap={4} grow={1}>
        {column2.map((name) => <Txt fill="white" fontFamily={"Barlow"} fontWeight={300} fontSize={20} text={name} textAlign={"left"} />)}
      </Layout>
      <Layout direction="column" gap={4} grow={1}>
        {column3.map((name) => <Txt fill="white" fontFamily={"Barlow"} fontWeight={300} fontSize={20} text={name} textAlign={"left"} />)}
      </Layout>
    </Layout>);
  }

  // Normal
  if (credit.trim() != "") {
    return (<Txt fill="white" fontFamily={"Barlow"} fontWeight={300} fontSize={26} marginTop={-32} textWrap={containsNewlines ? "pre" : true} textAlign={"center"}>
      {creditDisplay}
    </Txt>);
  }

  return (<></>);
}

interface FAQProps extends LayoutProps {
  question: string;
  answer: string;
}

class FAQ extends Layout {
  constructor(props: FAQProps) {
    super({layout: true, direction: "column", gap: 8,...props});

    this.add(<>
      <Txt fill="white" fontFamily={"Config"} textWrap={true} fontWeight={300} fontSize={36} text={`Q: ${props.question}`} />
      <Txt fill="white" fontFamily={"Barlow"} textWrap={true} fontWeight={300} fontSize={26} text={`A: ${props.answer}`} />
    </>)
  }
}
