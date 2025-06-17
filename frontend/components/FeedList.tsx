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
  Table,
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
        <Table.Root variant="simple" size="md">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader>表示</Table.ColumnHeader>
              <Table.ColumnHeader>サイト名</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {Object.entries(siteStates).map(([source, isActive]) => (
              <Table.Row key={source}>
                <Table.Cell>
                  <Checkbox.Root
                    key={source}
                    checked={isActive}
                    onCheckedChange={() => toggleSite(source)}
                  >
                    <Checkbox.HiddenInput />
                    <Checkbox.Control />
                    <Checkbox.Label>{source}</Checkbox.Label>
                  </Checkbox.Root>
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
