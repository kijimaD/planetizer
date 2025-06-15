import { useEffect, useState } from "react";
import { Link, Text, Stack, Heading, Box, Card } from "@chakra-ui/react";

type FeedItem = {
  title: string;
  link: string;
  published: string;
  summary: string;
  source: string;
};

export const FeedList = () => {
  const [items, setItems] = useState<FeedItem[]>([]);

  useEffect(() => {
    fetch("feed.json")
      .then((res) => res.json())
      .then(setItems);
  }, []);

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
              <small>
                {new Date(item.published).toLocaleString()} - {item.source}
              </small>
            </Card.Header>
            <Card.Body>
              <Text dangerouslySetInnerHTML={{ __html: item.summary }} className="feedcontent" />
            </Card.Body>
          </Card.Root>
        </Box>
      ))}
    </Stack>
  );
};
