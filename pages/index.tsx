import type { FunctionComponent } from "react";
import type { Message } from "../src/mocks";
import { Grid, Box } from "grommet";
import Statistics from "../src/components/statistics";
import ChatView from "../src/components/chat-view";
import ChatInput from "../src/components/chat-input";
import Chat from "../src/components/chat";

const HomePage: FunctionComponent = () => {
  return <Chat />;
};

// const HomePage: FunctionComponent = () => {
//   return (
//     <Box direction="row" height="100%">
//       <Box height="100%">
//         <Statistics />
//       </Box>
//       <Box height="100%" width="100%" justify="around">
//         <Box>
//           <ChatView messages={messages} />
//         </Box>
//         <Box>
//           <ChatInput onSend={async (e) => console.log(e)} />
//         </Box>
//       </Box>
//     </Box>
//   );
// };

// const HomePage: FunctionComponent = () => {
//   return (
//     <Grid
//       columns={["medium", "medium"]}
//       rows={["medium", "medium", "medium"]}
//       gap="xxsmall"
//       areas={[
//         { name: "statistics", start: [0, 0], end: [1, 1] },
//         { name: "chat-view", start: [1, 0], end: [1, 2] },
//         { name: "chat-input", start: [2, 0], end: [1, 2] },
//       ]}
//     >
//       <Box gridArea="statistics">
//         <Statistics />
//       </Box>
//       <Box gridArea="chat-view">
//         <ChatView messages={messages} />
//       </Box>
//       <Box gridArea="chat-input">
//         <ChatInput onSend={async (e) => console.log(e)} />
//       </Box>
//     </Grid>
//   );
// };

export default HomePage;
