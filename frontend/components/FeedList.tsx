import { useEffect, useState } from "react";
import {
  Center,
  Spinner,
  Link,
  Text,
  Stack,
  Heading,
  Box,
  Card,
} from "@chakra-ui/react";
import type { FeedResult } from "../generated/api";

const feedPath = "feed.json";

export const FeedList = () => {
  const [feed, setFeed] = useState<FeedResult>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(feedPath)
      .then((res) => res.json())
      .then((data) => {
        setFeed(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch feed:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <Box pos="absolute" inset="0">
        <Center h="full">
          <Spinner size="xl" />
        </Center>
      </Box>
    );
  }

  if (!feed) {
    return <div>No data.</div>;
  }

  return (
    <>
      <Stack gap="8" direction="row" wrap="wrap">
        {feed.entries.map((entry, i) => (
          <Box key={i}>
            <Card.Root w="600px" bgColor="gray.50">
              <Card.Header>
                <Heading>
                  <Link href={entry.link} target="_blank" rel="noreferrer">
                    {entry.title}
                  </Link>
                </Heading>
                <Text textStyle="xs">
                  {new Date(entry.published).toLocaleString()} - {entry.source}
                </Text>
              </Card.Header>
              <Card.Body>
                <Text
                  dangerouslySetInnerHTML={{ __html: entry.summary }}
                  className="feedcontent"
                />
              </Card.Body>
            </Card.Root>
          </Box>
        ))}
      </Stack>
      <Text textStyle="xs">
        aggregated at {new Date(feed.generated_at).toLocaleString()}
      </Text>
    </>
  );
};
