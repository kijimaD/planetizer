import { createContext, useContext } from "react";
import type { FeedResult } from "../generated/api";
import type { SiteStates, TagRecord } from "./FeedProvider";

interface FeedContextType {
  feed?: FeedResult;
  siteStates: SiteStates;
  tagRecord: TagRecord;
  toggleSite: (source: string) => void;
  loading: boolean;
}

export const FeedContext = createContext<FeedContextType | undefined>(
  undefined,
);

export const useFeed = () => {
  const ctx = useContext(FeedContext);
  if (!ctx) throw new Error("useFeed must be inside FeedProvider");
  return ctx;
};
