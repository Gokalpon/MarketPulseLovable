import { Asset } from "@/data/assets";

export interface Comment {
  id: string;
  assetId: string;
  timeframe: string;
  chartIndex: number;
  price: number;
  text: string;
  sentiment: string;
  timestamp: string;
  user: string;
  likes: number;
}

export interface ExternalComment {
  user: string;
  text: string;
  sentiment: string;
  likes: number;
}

export interface UserReply {
  text: string;
  user: string;
  timestamp: string;
}

export interface MarketPoint {
  idx: number;
  type: "news" | "comment";
  impact: "major" | "minor";
  translation: string;
  sentiment: string;
  newsUrl?: string;
  comments: ExternalComment[];
}

export type Timeframe = "1H" | "1D" | "1W" | "1M" | "1Y" | "ALL";

export interface SentimentCluster {
  comments: Comment[];
  avgPrice: number;
  avgIdx: number;
  sentiment: string;
  count: number;
}
