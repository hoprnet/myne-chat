import type { FunctionComponent } from "react";
import { Box, List, Text, Sidebar, Nav } from "grommet";
import { conversations, Conversation } from "../mocks";
import Logo from "./logo";

const Statistics: FunctionComponent = () => {
  return (
    <Sidebar
      header={<Box>+</Box>}
      footer={<Logo />}
      round
      pad="small"
      gap="small"
      background="dark-3"
      // @ts-ignore
      shadow
    >
      <Nav>
        <List
          primaryKey="with"
          data={conversations}
          border={false}
          pad={{
            horizontal: "none",
            bottom: "small",
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
