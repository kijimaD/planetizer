import React, { useEffect, useState } from "react";
import { FeedContext } from "./FeedContext";
import type { FeedResult, FeedEntry, ConfigSource } from "../generated/api";

export type SiteStates = Record<string, ConfigSource>;

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
        data.entries.forEach((e: FeedEntry) => {
          states[e.source.name] = e.source;
        });
        setSiteStates(states);
      })
      .finally(() => setLoading(false));
  }, []);

  const toggleSite = (source: string) => {
    setSiteStates((prev) => ({
      ...prev,
      [source]: {
        ...prev[source],
        initial_visible: !prev[source].initial_visible,
      },
    }));
  };

  return (
    <FeedContext.Provider value={{ feed, siteStates, toggleSite, loading }}>
      {children}
    </FeedContext.Provider>
  );
};
