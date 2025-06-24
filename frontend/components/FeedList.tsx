import {
  Flex,
  Button,
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
  Accordion,
  Icon,
} from "@chakra-ui/react";
import { IoMdSettings } from "react-icons/io";
import { FcCheckmark } from "react-icons/fc";
import { useFeed } from "../hooks/FeedContext";
import { Tooltip } from "./Tooltip";
import { useState, useEffect } from "react";

export const FeedList = () => {
  const { tagRecord, feed, siteRecord, toggleSite, loading } = useFeed();
  const [readEntries, setReadEntries] = useState<Set<string>>(new Set());
  const localStorageKey = "readEntries";

  // localStorage から既読データを読み込む
  useEffect(() => {
    const data = localStorage.getItem(localStorageKey);
    if (data) {
      try {
        setReadEntries(new Set(JSON.parse(data)));
      } catch (e) {
        console.error("Failed to parse readEntries", e);
      }
    }
  }, []);

  const markAsRead = (url: string) => {
    const newSet = new Set(readEntries);
    newSet.add(url);
    setReadEntries(newSet);
    localStorage.setItem(localStorageKey, JSON.stringify([...newSet]));
  };

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
    (e) => siteRecord[e.config_source] && !readEntries.has(e.link),
  );

  return (
    <>
      <Stack direction="row" wrap="wrap">
        <Accordion.Root collapsible variant="plain">
          <Accordion.Item value="value">
            <Accordion.ItemTrigger>
              <Icon fontSize="lg">
                <IoMdSettings />
              </Icon>
              <Text>Settings</Text>
            </Accordion.ItemTrigger>
            <Accordion.ItemContent>
              <Accordion.ItemBody>
                <Table.Root size="md">
                  <Table.Header>
                    <Table.Row>
                      <Table.ColumnHeader>名前</Table.ColumnHeader>
                      <Table.ColumnHeader>概要</Table.ColumnHeader>
                      <Table.ColumnHeader>タグ</Table.ColumnHeader>
                      <Table.ColumnHeader>数</Table.ColumnHeader>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {Object.entries(siteRecord).map(([sourceName, visible]) => (
                      <Table.Row key={sourceName}>
                        <Table.Cell>
                          <Checkbox.Root
                            key={sourceName}
                            checked={visible}
                            onCheckedChange={() => toggleSite(sourceName)}
                          >
                            <Checkbox.HiddenInput />
                            <Checkbox.Control />
                            <Tooltip
                              content={
                                feed.source_map[sourceName].config_source.desc
                              }
                              showArrow
                            >
                              <Checkbox.Label>
                                <Link
                                  href={
                                    feed.source_map[sourceName].config_source
                                      .rss_url
                                  }
                                  target="_blank"
                                  rel="noreferrer"
                                  key={sourceName}
                                  _hover={{ textDecoration: "none" }}
                                >
                                  {sourceName}
                                </Link>
                              </Checkbox.Label>
                            </Tooltip>
                          </Checkbox.Root>
                        </Table.Cell>
                        <Table.Cell>
                          <Text>
                            {feed.source_map[sourceName].config_source.desc}
                          </Text>
                        </Table.Cell>
                        <Table.Cell>
                          <Stack direction="row">
                            {feed.source_map[sourceName].config_source.tags.map(
                              (tagName) => (
                                <Tooltip
                                  key={tagName}
                                  content={tagRecord[tagName]?.desc}
                                  showArrow
                                >
                                  <Badge>{tagName}</Badge>
                                </Tooltip>
                              ),
                            )}
                          </Stack>
                        </Table.Cell>
                        <Table.Cell>
                          <Text>{feed.source_map[sourceName].entry_count}</Text>
                        </Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table.Root>
              </Accordion.ItemBody>
            </Accordion.ItemContent>
          </Accordion.Item>
        </Accordion.Root>
      </Stack>
      <Stack gap="8" direction="row" wrap="wrap">
        {entries.map((entry, i) => (
          <Card.Root w="600px" bgColor="gray.50">
            <Card.Header>
              <Link
                href={entry.link}
                target="_blank"
                rel="noreferrer"
                key={i}
                _hover={{ textDecoration: "none" }}
              >
                <Box>
                  <Heading>{entry.title}</Heading>
                  <Text textStyle="xs">
                    {new Date(entry.published).toLocaleString()} -{" "}
                    {entry.feed_source}
                  </Text>
                </Box>
              </Link>
            </Card.Header>
            <Card.Body>
              <Link
                href={entry.link}
                target="_blank"
                rel="noreferrer"
                key={i}
                _hover={{ textDecoration: "none" }}
              >
                <Text
                  dangerouslySetInnerHTML={{ __html: entry.summary }}
                  className="feedcontent"
                />
              </Link>
              <Flex justify="flex-end" ml="auto">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => markAsRead(entry.link)}
                >
                  <FcCheckmark />
                </Button>
              </Flex>
            </Card.Body>
          </Card.Root>
        ))}
      </Stack>
      <Text textStyle="xs">
        aggregated at {new Date(feed.generated_at).toLocaleString()}
      </Text>
    </>
  );
};
