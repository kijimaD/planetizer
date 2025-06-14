import { Outlet } from "react-router";
import { Link, Box, Flex, HStack, Heading } from "@chakra-ui/react";
import { FaGithub } from "react-icons/fa";

export const AppLayout = () => {
  return (
    <>
      <Box>
        <Flex>
          <HStack>
            <Heading></Heading>
            <HStack>
              <Link href="https://github.com/kijimaD/planetize">
                <FaGithub />
              </Link>
            </HStack>
          </HStack>
        </Flex>
      </Box>
      <Outlet />
    </>
  );
};
