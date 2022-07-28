import {
  cloneElement,
  createElement,
  FunctionComponent,
  useCallback,
  useContext,
  useEffect,
  useRef,
} from "react";
import type { ConnectionStatus, Settings as TSettings } from "../state";
import { useState } from "react";
import { Box, List, Text, Layer, ResponsiveContext } from "grommet";
import { Add, SettingsOption, BarChart } from "grommet-icons";
import IconButton from "./icon-button";
import Settings from "./settings";
import Analytics from "./analytics";
import NewConversation from "./new-conversation";
import Logo from "./logo";
import useAppState from "../state";
import styled from "styled-components";
import theme from "../theme";
import Image from "next/image";
import Measure, { BoundingRect } from "react-measure";

const Notifications = styled(Box)`
  width: 10px;
  height: 10px;
  background-color: ${(props) => props.color};
  content: " ";
  border-radius: 50%;
  position: absolute;
  right: 5px;
`;

// const FallingCoin = styled("div")`
//   animation: falling 1s ease-in infinite;

//   @keyframes falling {
//     from {
//       transform: translateY(0px);
//     }

//     to {
//       transform: translateY(500px);
//     }
//   }
// `;

const CoinCanvas = styled("canvas")`
  position: absolute;
  object-fit: contain;
`;

const ConversationsPanel: FunctionComponent<{
  status: ConnectionStatus;
  myPeerId?: string;
  // settings
  settings: TSettings;
  updateSettings: (o: TSettings) => void;
  // selection
  selection?: string;
  setSelection: (p: string) => void;
  // conversations
  counterparties: string[];
  addNewConversation: (p: string) => void;
  hoprBalance: string;
}> = ({
  status,
  myPeerId,
  settings,
  updateSettings,
  selection,
  setSelection,
  counterparties,
  addNewConversation,
  hoprBalance,
}) => {
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [showAnalytics, setShowAnalytics] = useState<boolean>(false);
  const [showAddNewConv, setShowAddNewConv] = useState<boolean>(false);
  const [hasUpdatedSettings, setHasUpdatedSettings] = useState<boolean>(false);
  const [isMaybeOnline, setMaybeOnline] = useState<boolean>(false);
  const [isReallyOnline, setReallyOnline] = useState<boolean>(false);
  const { version, hash, environment } = useAppState();

  const coinCanvas = useRef<HTMLCanvasElement>(null);
  const coinImg = useRef<HTMLImageElement>(null);
  const defaultCanvasDimentions = {
    top: 0,
    bottom: 0,
    height: 0,
    left: 0,
    right: 0,
    width: 0,
  };
  const [canvasDimentions, setCanvasDimentions] = useState<BoundingRect>(
    defaultCanvasDimentions
  );

  const screenSize = useContext(ResponsiveContext);
  const isMobile = screenSize === "small";

  useEffect(() => {
    setReallyOnline(isMaybeOnline && status === "CONNECTED");
  }, [isMaybeOnline]);

  useEffect(() => {
    // NB: Status gets called multiple times when `apiToken` is wrong. If that's the case, we make sure
    // to reset the value of `isReallyOnline` by triggering `setMaybeOnline` to `false` whenever
    // we see `status` === 'DISCONNECTED`. We use `hasUpdatedSettings` to tell the <Settings> component
    // that we have updated the Settings at least once.
    if (isMaybeOnline && status === "CONNECTED") {
      setReallyOnline(true);
      // NB: If settings are passed via query param or loaded via mocks, then the connection is successful
      // This only happens if the settings have not been updated ie during first load.
    } else if (!hasUpdatedSettings && status === "CONNECTED") {
      setReallyOnline(true);
    } else {
      setMaybeOnline(false);
      setReallyOnline(false);
    }
  }, [status]);

  // TODO: GET A HOLD OF THIS BLOKE https://stackoverflow.com/questions/9791904/animating-images-in-html5-and-canvas
  const huje = () => {
    const refImg = coinImg.current;
    const canvas = coinCanvas.current;

    console.log(canvas, refImg);
    if (!canvas || !refImg) return;

    // const coin = document.createElement("img");
    // coin.src = "https://hoprnet.org/assets/icons/hopr_icon.svg";
    // coin.src = "http://i.imgur.com/5ZW2MT3.png";
    const coin = refImg.cloneNode() as HTMLImageElement;
    const ctx = coinCanvas.current.getContext("2d");

    console.log(coin, ctx);
    coin.onload = () => {
      console.log("HUUUUGHH?");
      ctx?.drawImage(coin, 0, 0, 40, 40);
    };

    // 440 wide, 40 high, 10 states
    // coin.onload = function () {
    //   element.appendChild(canvas);
    //   focused = true;
    //   drawloop();
    // };
    // var coins = [];

    // function drawloop() {
    //   if (focused) {
    //     requestAnimationFrame(drawloop);
    //   }

    //   ctx.clearRect(0, 0, canvas.width, canvas.height);

    //   if (Math.random() < 0.3) {
    //     coins.push({
    //       x: (Math.random() * canvas.width) | 0,
    //       y: -50,
    //       dy: 3,
    //       s: 0.5 + Math.random(),
    //       state: (Math.random() * 10) | 0,
    //     });
    //   }
    //   var i = coins.length;
    //   while (i--) {
    //     var x = coins[i].x;
    //     var y = coins[i].y;
    //     var s = coins[i].s;
    //     var state = coins[i].state;
    //     coins[i].state = state > 9 ? 0 : state + 0.1;
    //     coins[i].dy += 0.3;
    //     coins[i].y += coins[i].dy;

    //     ctx.drawImage(
    //       coin,
    //       44 * Math.floor(state),
    //       0,
    //       44,
    //       40,
    //       x,
    //       y,
    //       44 * s,
    //       40 * s
    //     );

    //     if (y > canvas.height) {
    //       coins.splice(i, 1);
    //     }
    //   }
    // }
  };

  return (
    <>
      <Box
        fill="vertical"
        justify="between"
        pad="none"
        gap="small"
        background="dark-3"
        round
        shadow
      >
        <button onClick={() => huje()}>HUJE</button>
        {/* header */}
        <Box
          pad="small"
          justify="between"
          direction="row"
          align="center"
          height={{
            min: "min-content",
          }}
          wrap={true}
        >
          <Box direction="row">
            <IconButton
              pad="small"
              alignSelf="end"
              round
              onClick={() => setShowSettings(true)}
              margin="0"
              style={{ position: "relative" }}
            >
              <Notifications
                color={
                  !isReallyOnline
                    ? theme.global.colors["fatal-error"]
                    : theme.global.colors["status-success"]
                }
              />
              <SettingsOption color="light-1" />
            </IconButton>
            <IconButton
              pad="small"
              alignSelf="end"
              round
              disabled={!isReallyOnline}
              onClick={() => setShowAnalytics(true)}
              margin="0"
            >
              <BarChart color="light-1" />
            </IconButton>
          </Box>
          <Box>
            <IconButton
              aria-label="Add Peer Id"
              pad="small"
              alignSelf="end"
              round
              disabled={!isReallyOnline}
              onClick={() => setShowAddNewConv(true)}
              margin="0"
            >
              <Add color="light-1" />
            </IconButton>
          </Box>
        </Box>
        {/* conversations */}
        <Measure
          bounds
          onResize={(contentRect) => {
            setCanvasDimentions(contentRect.bounds || defaultCanvasDimentions);
          }}
        >
          {({ measureRef }) => (
            <Box
              ref={measureRef}
              fill="vertical"
              style={{ position: "relative" }}
            >
              <CoinCanvas
                ref={coinCanvas}
                height={canvasDimentions.height}
                width={canvasDimentions.width}
              ></CoinCanvas>
              {/* <img src={"/HOPR_Token_Icon.svg"}></img> */}
              {/* <div>
              <Box width={{ min: "22px" }} height={{ min: "22px" }}>
              <Image
              src="/HOPR_Token_Icon.svg"
              alt="Hopr Token Icon"
                  layout="fixed"
                  width="22px"
                  height="22px"
                  />
                  </Box>
                </div> */}
              <List
                data={counterparties}
                border={false}
                pad={{
                  horizontal: "none",
                }}
                // removes focus indicator
                style={{
                  outline: 0,
                }}
                onClickItem={(props: any) => setSelection(props.item)}
              >
                {(
                  counterparty: string,
                  _index: any,
                  { active: isHovered }: { active: boolean }
                ) => {
                  const isSelected = counterparty === selection;
                  const highlight = isHovered || isSelected;

                  return (
                    <Box
                      pad="small"
                      background={highlight ? "dark-4" : undefined}
                    >
                      <Text
                        style={{
                          direction: "rtl",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {counterparty}
                      </Text>
                    </Box>
                  );
                }}
              </List>
            </Box>
          )}
        </Measure>
        {/* footer */}
        <Box pad="small" height={{ min: "min-content" }}>
          <Logo isOnline={isReallyOnline} />
          <Box
            pad={{ vertical: "medium" }}
            flex
            direction="row"
            align="center"
            gap="5px"
          >
            <Box width={{ min: "22px" }} height={{ min: "22px" }}>
              <img
                ref={coinImg}
                src="/HOPR_Token_Icon.png"
                alt="Hopr Token Icon"
                // layout="fixed"
                width="22px"
                height="22px"
              />
            </Box>
            <Text size="medium" weight={"bold"}>
              Hopr Balance: {hoprBalance}
            </Text>
          </Box>
          <Text style={{ margin: "5px 0 0" }} size="xs">
            Version: {version}
          </Text>
          {environment != "production" && (
            <Text style={{ margin: "5px 0 0" }} size="xs">
              Hash: {hash}
            </Text>
          )}
        </Box>
      </Box>
      {showSettings ? (
        <Layer
          onEsc={() => setShowSettings(false)}
          onClickOutside={() => setShowSettings(false)}
          background="none"
        >
          <Settings
            settings={settings}
            updateSettings={(s) => {
              setShowSettings(false);
              updateSettings(s);
            }}
            setHasUpdatedSettings={setHasUpdatedSettings}
            setMaybeOnline={setMaybeOnline}
            isReallyOnline={isReallyOnline}
            hasUpdatedSettings={hasUpdatedSettings}
          />
        </Layer>
      ) : showAnalytics ? (
        <Layer
          onEsc={() => setShowAnalytics(false)}
          onClickOutside={() => setShowAnalytics(false)}
          background="none"
        >
          <Analytics myPeerId={myPeerId} />
        </Layer>
      ) : showAddNewConv ? (
        <Layer
          onEsc={() => setShowAddNewConv(false)}
          onClickOutside={() => setShowAddNewConv(false)}
          background="none"
        >
          <NewConversation
            myPeerId={myPeerId}
            counterparties={counterparties}
            addNewConversation={(p) => {
              addNewConversation(p);
              setShowAddNewConv(false);
            }}
          />
        </Layer>
      ) : null}
    </>
  );
};

export default ConversationsPanel;
