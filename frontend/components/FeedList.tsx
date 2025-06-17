import {
  Checkbox,
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

  const entries = feed.entries.filter((e) => siteStates[e.source.name]);

  return (
    <>
      <Stack direction="row" wrap="wrap" mb="6">
        {Object.entries(siteStates).map(([source, isActive]) => (
          <Checkbox.Root
            key={source}
            checked={isActive}
            onCheckedChange={() => toggleSite(source)}
          >
            <Checkbox.HiddenInput />
            <Checkbox.Control />
            <Checkbox.Label>{source}</Checkbox.Label>
          </Checkbox.Root>
        ))}
      </Stack>
      <Stack gap="8" direction="row" wrap="wrap">
        {entries.map((entry, i) => (
          <Box key={i}>
            <Card.Root w="600px" bgColor="gray.50">
              <Card.Header>
                <Heading>
                  <Link href={entry.link} target="_blank" rel="noreferrer">
                    {entry.title}
                  </Link>
                </Heading>
                <Text textStyle="xs">
                  {new Date(entry.published).toLocaleString()} -{" "}
                  {entry.source.name}
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
