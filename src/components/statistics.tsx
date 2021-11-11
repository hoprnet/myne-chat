import type { FunctionComponent } from "react";
import { Box, List, Text, Sidebar, Nav } from "grommet";
import { conversations, Conversation } from "../mocks";
import { useTheme } from "../theme";
import Logo from "./logo";

const Statistics: FunctionComponent = () => {
  const theme = useTheme();

  return (
    <Sidebar
      header={<Box>+</Box>}
      footer={<Logo />}
      background="dark-3"
      pad={theme.global.raw.space.small}
      round={theme.global.raw.radii.default}
      gap={theme.global.raw.space.small}
    >
      <Nav>
        <List
          primaryKey="with"
          data={conversations}
          border={false}
          pad={{
            horizontal: "none",
            bottom: theme.global.raw.space.small,
          }}
        >
          {(conv: Conversation) => {
            return (
              <Box>
                <Text
                  style={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {conv.with}
                </Text>
              </Box>
            );
          }}
        </List>
      </Nav>
    </Sidebar>
  );
};

// const Statistics: FunctionComponent = () => {
//   const theme = useTheme();

//   return (
//     <StyledBox
//       direction="column"
//       justify="between"
//       background="dark-3"
//       gap={theme.global.raw.space.small}
//     >
//       <Box>+</Box>
//       <Box height="100%">
//         <List
//           primaryKey="with"
//           data={conversations}
//           border={false}
//           pad={{
//             horizontal: "none",
//             bottom: theme.global.raw.space.small,
//           }}
//         >
//           {(conv: Conversation) => {
//             return (
//               <Box>
//                 <Text
//                   style={{
//                     overflow: "hidden",
//                     textOverflow: "ellipsis",
//                   }}
//                 >
//                   {conv.with}
//                 </Text>
//               </Box>
//             );
//           }}
//         </List>
//       </Box>
//       <Box>
//         <Logo />
//       </Box>
//     </StyledBox>
//   );
// };

export default Statistics;
