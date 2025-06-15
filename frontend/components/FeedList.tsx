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

type FeedItem = {
  title: string;
  link: string;
  published: string;
  summary: string;
  source: string;
};

const feedPath = "feed.json"

export const FeedList = () => {
  const [items, setItems] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(feedPath)
      .then((res) => res.json())
      .then((data) => {
        setItems(data);
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

  if (!items) {
    return <div>No data.</div>;
  }

  return (
    <Stack gap="8" direction="row" wrap="wrap">
      {items.map((item, i) => (
        <Box key={i}>
          <Card.Root w="600px" bgColor="gray.50">
            <Card.Header>
              <Heading>
                <Link href={item.link} target="_blank" rel="noreferrer">
                  {item.title}
                </Link>
              </Heading>
              <Text textStyle="xs">
                {new Date(item.published).toLocaleString()} - {item.source}
              </Text>
            </Card.Header>
            <Card.Body>
              <Text
                dangerouslySetInnerHTML={{ __html: item.summary }}
                className="feedcontent"
              />
            </Card.Body>
          </Card.Root>
        </Box>
      ))}
    </Stack>
  );
};
