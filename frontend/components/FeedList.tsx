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
import { useFeed } from "../hooks/FeedContext";

export const FeedList = () => {
  const { feed, siteStates, toggleSite, loading } = useFeed();

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
