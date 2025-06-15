import { Outlet } from "react-router";
import { Container, Link, Box, Flex, HStack, Heading } from "@chakra-ui/react";
import { FaGithub } from "react-icons/fa";

export const AppLayout = () => {
  return (
    <Box>
      <Flex>
        <HStack>
          <Heading>PLANET</Heading>
        </HStack>
      </Flex>
      <Container w="600px" py={8}>
        <Outlet />
      </Container>
      <Flex>
        <HStack>
          <Link href="https://github.com/kijimaD/planetizer">
            <FaGithub />
          </Link>
        </HStack>
      </Flex>
    </Box>
  );
};
