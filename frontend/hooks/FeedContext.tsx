import React, { createContext, useContext, useEffect, useState } from "react";
import type { FeedResult } from "../generated/api";

type SiteStates = Record<string, boolean>;

interface FeedContextType {
  feed?: FeedResult;
  siteStates: SiteStates;
  toggleSite: (source: string) => void;
  loading: boolean;
}

const FeedContext = createContext<FeedContextType | undefined>(undefined);

const feedPath = "feed.json";

export const FeedProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [feed, setFeed] = useState<FeedResult>();
  const [loading, setLoading] = useState(true);
  const [siteStates, setSiteStates] = useState<SiteStates>({});

  useEffect(() => {
    fetch(feedPath)
      .then((res) => res.json())
      .then((data: FeedResult) => {
        setFeed(data);
        const states: SiteStates = {};
        data.entries.forEach((e: Entry) => {
          if (!(e.source in states)) states[e.source] = true;
        });
        setSiteStates(states);
      })
      .finally(() => setLoading(false));
  }, []);

  const toggleSite = (source: string) => {
    setSiteStates((prev) => ({ ...prev, [source]: !prev[source] }));
  };

  return (
    <FeedContext.Provider value={{ feed, siteStates, toggleSite, loading }}>
      {children}
    </FeedContext.Provider>
  );
};

export const useFeed = () => {
  const ctx = useContext(FeedContext);
  if (!ctx) throw new Error("useFeed must be inside FeedProvider");
  return ctx;
};
