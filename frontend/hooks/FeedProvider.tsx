import React, { useEffect, useState } from "react";
import { FeedContext } from "./FeedContext";
import type { FeedResult, FeedEntry, ConfigTag } from "../generated/api";

// サイトごとに可視判定する
export type SiteRecord = Record<string, boolean>;
export type TagRecord = Record<string, ConfigTag>;

const feedPath = "feed.json";

export const FeedProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [feed, setFeed] = useState<FeedResult>();
  const [loading, setLoading] = useState(true);
  const [siteRecord, setSiteRecord] = useState<SiteRecord>({});
  const [tagRecord, setTagRecord] = useState<TagRecord>({});

  useEffect(() => {
    fetch(feedPath)
      .then((res) => res.json())
      .then((data: FeedResult) => {
        setFeed(data);
      })
      .finally(() => setLoading(false));
  }, []);

  const toggleSite = (source: string) => {
    setSiteRecord((prev) => ({ ...prev, [source]: !prev[source] }));
  };

  useEffect(() => {
    if (!feed) return;
    const states: SiteRecord = {};
    feed.entries.forEach((e: FeedEntry) => {
      states[e.config_source] =
        feed.source_map[e.config_source].config_source.initial_visible;
    });
    setSiteRecord(states);
  }, [feed]);

  useEffect(() => {
    if (!feed) return;
    const record: Record<string, ConfigTag> = {};

    feed.config.tags.forEach((tag) => {
      record[tag.name] = tag;
    });

    setTagRecord(record);
  }, [feed]);

  return (
    <FeedContext.Provider
      value={{ tagRecord, feed, siteRecord, toggleSite, loading }}
    >
      {children}
    </FeedContext.Provider>
  );
};
