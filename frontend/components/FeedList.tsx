import { IoMdSettings } from "react-icons/io";
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
  Accordion,
  Icon,
} from "@chakra-ui/react";
import { useFeed } from "../hooks/FeedContext";
import { Tooltip } from "./Tooltip";

export const FeedList = () => {
  const { tagRecord, feed, siteRecord, toggleSite, loading } = useFeed();

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
    (e) => siteRecord[e.config_source.name].initial_visible,
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
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {Object.entries(siteRecord).map(([sourceName, source]) => (
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
                          <Text>{source.desc}</Text>
                        </Table.Cell>
                        <Table.Cell>
                          <Stack direction="row">
                            {source.tags.map((tagName) => (
                              <Tooltip
                                key={tagName}
                                content={tagRecord[tagName]?.desc}
                                showArrow
                              >
                                <Badge>{tagName}</Badge>
                              </Tooltip>
                            ))}
                          </Stack>
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
          <Link
            href={entry.link}
            target="_blank"
            rel="noreferrer"
            _hover={{ textDecoration: "none", bg: "none" }}
          >
            <Card.Root w="600px" bgColor="gray.50">
              <Card.Header>
                <Heading>{entry.title}</Heading>
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
          </Link>
        ))}
      </Stack>
      <Text textStyle="xs">
        aggregated at {new Date(feed.generated_at).toLocaleString()}
      </Text>
    </>
  );
};
