import { useEffect, useState } from "react";
import { Settings } from ".";
import { utils } from "ethers";

type TicketStatisticsResponse = {
  pending: number;
  unredeemed: number;
  redeemed: number;
};

export function useCoinsListener(
  settings: Settings,
  headers: Headers,
  rainCoins: () => any
) {
  useEffect(() => {
    let stats: TicketStatisticsResponse = {
      pending: 0,
      unredeemed: 0,
      redeemed: 0,
    };

    const sumTickets = (stats: TicketStatisticsResponse) =>
      stats.pending + stats.unredeemed + stats.redeemed;

    const getTicketsStatistics = async (skipCoinTrigger?: boolean) => {
      try {
        const fetchedStats: TicketStatisticsResponse = await fetch(
          `${settings.apiEndpoint}/api/v2/tickets/statistics`,
          {
            method: "GET",
            headers,
          }
        ).then((res) => res.json());

        if (!skipCoinTrigger && sumTickets(fetchedStats) > sumTickets(stats)) {
          rainCoins();
        }
        stats = fetchedStats;
      } catch (error) {
        console.log(error);
      }
    };

    // first fetch without triggering coins to fetch the initial statistics
    getTicketsStatistics(true);

    // to make coins feel more organic interval will have 20% variance
    const randomMultiplier = (5 - Math.random()) / 5;
    const interval = setInterval(
      () => getTicketsStatistics(),
      30000 * randomMultiplier
    );

    return () => clearInterval(interval);
  }, [settings.apiEndpoint, settings.apiToken]);
}

export function useBalanceListener(
  { apiEndpoint, apiToken }: Settings,
  headers: Headers
) {
  const [hoprBalance, updateHoprBalance] = useState("0");

  useEffect(() => {
    const getHoprBalance = async () => {
      try {
        const data = await fetch(`${apiEndpoint}/api/v2/account/balances`, {
          method: "GET",
          headers,
        }).then((res) => res.json());
        updateHoprBalance(utils.parseEther(data.hopr).toString());
      } catch (error) {
        console.log(error);
      }
    };

    getHoprBalance();
    const interval = setInterval(() => getHoprBalance(), 10000);

    return () => clearInterval(interval);
  }, [apiEndpoint, apiToken]);

  return { hoprBalance };
}
