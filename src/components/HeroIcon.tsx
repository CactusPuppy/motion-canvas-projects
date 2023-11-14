import { Img, ImgProps, signal } from "@motion-canvas/2d";

import Ana3DImage from "../../images/heroes/ana-3d.png";
import AnaFlatImage from "../../images/heroes/ana-flat.png";
import Ashe3DImage from "../../images/heroes/ashe-3d.png";
import AsheFlatImage from "../../images/heroes/ashe-flat.png";
import Baptiste3DImage from "../../images/heroes/baptiste-3d.png";
import BaptisteFlatImage from "../../images/heroes/baptiste-flat.png";
import Bastion3DImage from "../../images/heroes/bastion-3d.png";
import BastionFlatImage from "../../images/heroes/bastion-flat.png";
import Brigitte3DImage from "../../images/heroes/brigitte-3d.png";
import BrigitteFlatImage from "../../images/heroes/brigitte-flat.png";
import Cassidy3DImage from "../../images/heroes/cassidy-3d.png";
import CassidyFlatImage from "../../images/heroes/cassidy-flat.png";
import Dva3DImage from "../../images/heroes/dva-3d.png";
import DvaFlatImage from "../../images/heroes/dva-flat.png";
import Doomfist3DImage from "../../images/heroes/doomfist-3d.png";
import DoomfistFlatImage from "../../images/heroes/doomfist-flat.png";
import Echo3DImage from "../../images/heroes/echo-3d.png";
import EchoFlatImage from "../../images/heroes/echo-flat.png";
import Genji3DImage from "../../images/heroes/genji-3d.png";
import GenjiFlatImage from "../../images/heroes/genji-flat.png";
import Hanzo3DImage from "../../images/heroes/hanzo-3d.png";
import HanzoFlatImage from "../../images/heroes/hanzo-flat.png";
import Illari3DImage from "../../images/heroes/illari-3d.png";
import IllariFlatImage from "../../images/heroes/illari-flat.png";
import JunkerQueen3DImage from "../../images/heroes/junker-queen-3d.png";
import JunkerQueenFlatImage from "../../images/heroes/junker-queen-flat.png";
import Junkrat3DImage from "../../images/heroes/junkrat-3d.png";
import JunkratFlatImage from "../../images/heroes/junkrat-flat.png";
import Kiriko3DImage from "../../images/heroes/kiriko-3d.png";
import KirikoFlatImage from "../../images/heroes/kiriko-flat.png";
import Lifeweaver3DImage from "../../images/heroes/lifeweaver-3d.png";
import LifeweaverFlatImage from "../../images/heroes/lifeweaver-flat.png";
import Lucio3DImage from "../../images/heroes/lucio-3d.png";
import LucioFlatImage from "../../images/heroes/lucio-flat.png";
import Mei3DImage from "../../images/heroes/mei-3d.png";
import MeiFlatImage from "../../images/heroes/mei-flat.png";
import Mercy3DImage from "../../images/heroes/mercy-3d.png";
import MercyFlatImage from "../../images/heroes/mercy-flat.png";
import Moira3DImage from "../../images/heroes/moira-3d.png";
import MoiraFlatImage from "../../images/heroes/moira-flat.png";
import Orisa3DImage from "../../images/heroes/orisa-3d.png";
import OrisaFlatImage from "../../images/heroes/orisa-flat.png";
import Pharah3DImage from "../../images/heroes/pharah-3d.png";
import PharahFlatImage from "../../images/heroes/pharah-flat.png";
import Ramattra3DImage from "../../images/heroes/ramattra-3d.png";
import RamattraFlatImage from "../../images/heroes/ramattra-flat.png";
import Reaper3DImage from "../../images/heroes/reaper-3d.png";
import ReaperFlatImage from "../../images/heroes/reaper-flat.png";
import Reinhardt3DImage from "../../images/heroes/reinhardt-3d.png";
import ReinhardtFlatImage from "../../images/heroes/reinhardt-flat.png";
import Roadhog3DImage from "../../images/heroes/roadhog-3d.png";
import RoadhogFlatImage from "../../images/heroes/roadhog-flat.png";
import Sigma3DImage from "../../images/heroes/sigma-3d.png";
import SigmaFlatImage from "../../images/heroes/sigma-flat.png";
import Sojourn3DImage from "../../images/heroes/sojourn-3d.png";
import SojournFlatImage from "../../images/heroes/sojourn-flat.png";
import Soldier763DImage from "../../images/heroes/soldier-76-3d.png";
import Soldier76FlatImage from "../../images/heroes/soldier-76-flat.png";
import Sombra3DImage from "../../images/heroes/sombra-3d.png";
import SombraFlatImage from "../../images/heroes/sombra-flat.png";
import Symmetra3DImage from "../../images/heroes/symmetra-3d.png";
import SymmetraFlatImage from "../../images/heroes/symmetra-flat.png";
import Torbjorn3DImage from "../../images/heroes/torbjorn-3d.png";
import TorbjornFlatImage from "../../images/heroes/torbjorn-flat.png";
import Tracer3DImage from "../../images/heroes/tracer-3d.png";
import TracerFlatImage from "../../images/heroes/tracer-flat.png";
import Widowmaker3DImage from "../../images/heroes/widowmaker-3d.png";
import WidowmakerFlatImage from "../../images/heroes/widowmaker-flat.png";
import Winston3DImage from "../../images/heroes/winston-3d.png";
import WinstonFlatImage from "../../images/heroes/winston-flat.png";
import WreckingBall3DImage from "../../images/heroes/wrecking-ball-3d.png";
import WreckingBallFlatImage from "../../images/heroes/wrecking-ball-flat.png";
import Zarya3DImage from "../../images/heroes/zarya-3d.png";
import ZaryaFlatImage from "../../images/heroes/zarya-flat.png";
import Zenyatta3DImage from "../../images/heroes/zenyatta-3d.png";
import ZenyattaFlatImage from "../../images/heroes/zenyatta-flat.png";

export enum Hero {
  Ana = "ana",
  Ashe = "ashe",
  Baptiste = "baptiste",
  Bastion = "bastion",
  Brigitte = "brigitte",
  Cassidy = "cassidy",
  Dva = "dva",
  Doomfist = "doomfist",
  Echo = "echo",
  Genji = "genji",
  Hanzo = "hanzo",
  Illari = "illari",
  JunkerQueen = "junker-queen",
  Junkrat = "junkrat",
  Kiriko = "kiriko",
  Lifeweaver = "lifeweaver",
  Lucio = "lucio",
  Mei = "mei",
  Mercy = "mercy",
  Moira = "moira",
  Orisa = "orisa",
  Pharah = "pharah",
  Ramattra = "ramattra",
  Reaper = "reaper",
  Reinhardt = "reinhardt",
  Roadhog = "roadhog",
  Sigma = "sigma",
  Sojourn = "sojourn",
  Soldier76 = "soldier-76",
  Sombra = "sombra",
  Symmetra = "symmetra",
  Torbjorn = "torbjorn",
  Tracer = "tracer",
  Widowmaker = "widowmaker",
  Winston = "winston",
  WreckingBall = "wrecking-ball",
  Zarya = "zarya",
  Zenyatta = "zenyatta"
}

export const HeroImages = {
  ana: {
    flat: AnaFlatImage,
    threeD: Ana3DImage
  },
  ashe: {
    flat: AsheFlatImage,
    threeD: Ashe3DImage
  },
  baptiste: {
    flat: BaptisteFlatImage,
    threeD: Baptiste3DImage
  },
  bastion: {
    flat: BastionFlatImage,
    threeD: Bastion3DImage
  },
  brigitte: {
    flat: BrigitteFlatImage,
    threeD: Brigitte3DImage
  },
  cassidy: {
    flat: CassidyFlatImage,
    threeD: Cassidy3DImage
  },
  dva: {
    flat: DvaFlatImage,
    threeD: Dva3DImage
  },
  doomfist: {
    flat: DoomfistFlatImage,
    threeD: Doomfist3DImage
  },
  echo: {
    flat: EchoFlatImage,
    threeD: Echo3DImage
  },
  genji: {
    flat: GenjiFlatImage,
    threeD: Genji3DImage
  },
  hanzo: {
    flat: HanzoFlatImage,
    threeD: Hanzo3DImage
  },
  illari: {
    flat: IllariFlatImage,
    threeD: Illari3DImage
  },
  "junker-queen": {
    flat: JunkerQueenFlatImage,
    threeD: JunkerQueen3DImage
  },
  junkrat: {
    flat: JunkratFlatImage,
    threeD: Junkrat3DImage
  },
  kiriko: {
    flat: KirikoFlatImage,
    threeD: Kiriko3DImage
  },
  lifeweaver: {
    flat: LifeweaverFlatImage,
    threeD: Lifeweaver3DImage
  },
  lucio: {
    flat: LucioFlatImage,
    threeD: Lucio3DImage
  },
  mei: {
    flat: MeiFlatImage,
    threeD: Mei3DImage
  },
  mercy: {
    flat: MercyFlatImage,
    threeD: Mercy3DImage
  },
  moira: {
    flat: MoiraFlatImage,
    threeD: Moira3DImage
  },
  orisa: {
    flat: OrisaFlatImage,
    threeD: Orisa3DImage
  },
  pharah: {
    flat: PharahFlatImage,
    threeD: Pharah3DImage
  },
  ramattra: {
    flat: RamattraFlatImage,
    threeD: Ramattra3DImage
  },
  reaper: {
    flat: ReaperFlatImage,
    threeD: Reaper3DImage
  },
  reinhardt: {
    flat: ReinhardtFlatImage,
    threeD: Reinhardt3DImage
  },
  roadhog: {
    flat: RoadhogFlatImage,
    threeD: Roadhog3DImage
  },
  sigma: {
    flat: SigmaFlatImage,
    threeD: Sigma3DImage
  },
  sojourn: {
    flat: SojournFlatImage,
    threeD: Sojourn3DImage
  },
  "soldier-76": {
    flat: Soldier76FlatImage,
    threeD: Soldier763DImage
  },
  sombra: {
    flat: SombraFlatImage,
    threeD: Sombra3DImage
  },
  symmetra: {
    flat: SymmetraFlatImage,
    threeD: Symmetra3DImage
  },
  torbjorn: {
    flat: TorbjornFlatImage,
    threeD: Torbjorn3DImage
  },
  tracer: {
    flat: TracerFlatImage,
    threeD: Tracer3DImage
  },
  widowmaker: {
    flat: WidowmakerFlatImage,
    threeD: Widowmaker3DImage
  },
  winston: {
    flat: WinstonFlatImage,
    threeD: Winston3DImage
  },
  "wrecking-ball": {
    flat: WreckingBallFlatImage,
    threeD: WreckingBall3DImage
  },
  zarya: {
    flat: ZaryaFlatImage,
    threeD: Zarya3DImage
  },
  zenyatta: {
    flat: ZenyattaFlatImage,
    threeD: Zenyatta3DImage
  }
}

export interface HeroIconProps extends ImgProps {
  hero: Hero;
  size?: number;
  isFlat?: boolean;
}

export class HeroIcon extends Img {

  constructor(props: HeroIconProps) {
    super({
      src: HeroImages[props.hero][props.isFlat ? "flat" : "threeD"],
      width: props.size ?? 64, height: props.size ?? 64,
      ...props});
  }
}
