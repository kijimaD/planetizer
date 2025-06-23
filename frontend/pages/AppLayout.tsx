import { Outlet } from "react-router";
import {
  Center,
  Container,
  Link,
  Box,
  Flex,
  HStack,
  Heading,
} from "@chakra-ui/react";
import { FaGithub } from "react-icons/fa6";

export const AppLayout = () => {
  return (
    <Box>
      <Flex>
        <HStack>
          <Heading>PLANET</Heading>
        </HStack>
      </Flex>
      <Container w="600px" minHeight="90vh" py={8}>
        <Outlet />
      </Container>
      <Center>
        <HStack>
          <Link href="https://github.com/kijimaD/planetizer">
            <FaGithub />
          </Link>
        </HStack>
      </Center>
    </Box>
  );
};
