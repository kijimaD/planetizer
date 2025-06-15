import { Flex, Box } from "@chakra-ui/react";
import { FeedList } from "../components/FeedList";

export function TopPage() {
  return (
    <>
      <Flex>
        <Box>
          <FeedList />
        </Box>
      </Flex>
    </>
  );
}
