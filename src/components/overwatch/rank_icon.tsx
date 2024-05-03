import bronze_no_border from "../../../images/icons/overwatch/RankedIcons/Bronze.png";
import silver_no_border from "../../../images/icons/overwatch/RankedIcons/Silver.png";
import gold_no_border from "../../../images/icons/overwatch/RankedIcons/Gold.png";
import platinum_no_border from "../../../images/icons/overwatch/RankedIcons/Platinum.png";
import diamond_no_border from "../../../images/icons/overwatch/RankedIcons/Diamond.png";
import masters_no_border from "../../../images/icons/overwatch/RankedIcons/Masters.png";
import grandmaster_no_border from "../../../images/icons/overwatch/RankedIcons/Grandmaster.png";
import top500_no_border from "../../../images/icons/overwatch/RankedIcons/Top 500.png";
import { Img, ImgProps } from "@motion-canvas/2d";

export enum Rank {
  Bronze = "Bronze",
  Silver = "Silver",
  Gold = "Gold",
  Platinum = "Platinum",
  Diamond = "Diamond",
  Master = "Master",
  Grandmaster = "Grandmaster",
  Top500 = "Top500",
}

export interface RankIconProps extends ImgProps {
  rank: Rank;
}

export class RankIcon extends Img {
  constructor(props: RankIconProps) {
    super({...props, src: RankIcon.getSrc(props.rank)});
  }

  private static getSrc(rank: Rank) {
    switch (rank) {
      case Rank.Bronze:
        return bronze_no_border;
      case Rank.Silver:
        return silver_no_border;
      case Rank.Gold:
        return gold_no_border;
      case Rank.Platinum:
        return platinum_no_border;
      case Rank.Diamond:
        return diamond_no_border;
      case Rank.Master:
        return masters_no_border;
      case Rank.Grandmaster:
        return grandmaster_no_border;
      case Rank.Top500:
        return top500_no_border;
    }
  }
}
