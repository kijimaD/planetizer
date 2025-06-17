import { createContext, useContext } from "react";
import type { FeedResult } from "../generated/api";
import type { SiteRecord, TagRecord } from "./FeedProvider";

interface FeedContextType {
  feed?: FeedResult;
  siteRecord: SiteRecord;
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
