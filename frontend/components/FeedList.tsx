import {
  Badge,
  Checkbox,
  Center,
  Spinner,
  Link,
  Text,
  Stack,
  Heading,
  Box,
  Card,
  Table,
} from "@chakra-ui/react";
import { useFeed } from "../hooks/FeedContext";
import { Tooltip } from "./Tooltip";

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

  const entries = feed.entries.filter(
    (e) => siteStates[e.source.name].initial_visible,
  );

  return (
    <>
      <Stack direction="row" wrap="wrap" mb="6">
        <Table.Root size="md">
          <Table.Header>
            <Table.Row></Table.Row>
          </Table.Header>
          <Table.Body>
            {Object.entries(siteStates).map(([sourceName, source]) => (
              <Table.Row key={sourceName}>
                <Table.Cell>
                  <Checkbox.Root
                    key={sourceName}
                    checked={source.initial_visible}
                    onCheckedChange={() => toggleSite(sourceName)}
                  >
                    <Checkbox.HiddenInput />
                    <Checkbox.Control />
                    <Tooltip content={source.desc} showArrow>
                      <Checkbox.Label>{sourceName}</Checkbox.Label>
                    </Tooltip>
                  </Checkbox.Root>
                </Table.Cell>
                <Table.Cell>
                  <Stack direction="row">
                    {source.tags.map((tag) => (
                      <Badge>{tag}</Badge>
                    ))}
                  </Stack>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
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
