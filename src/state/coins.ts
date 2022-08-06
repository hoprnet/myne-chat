import { useEffect, useState } from "react";
import axios from "axios";
import { Settings } from ".";
import { fromWei } from "web3-utils";

type TicketStatisticsResponse = {
  pending: number;
  unredeemed: number;
  redeemed: number;
};

export function useCoinsListener({
  apiEndpoint,
  apiToken,
  rainCoins,
}: Settings & { rainCoins: () => any }) {
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
        const fetchedStats = await axios.get<TicketStatisticsResponse>(
          `${apiEndpoint}/api/v2/tickets/statistics${
            apiToken ? `?apiToken=${apiToken}` : ""
          }`
        );

        if (
          !skipCoinTrigger &&
          sumTickets(fetchedStats.data) > sumTickets(stats)
        ) {
          rainCoins();
        }
        stats = fetchedStats.data;
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
  }, [apiEndpoint, apiToken]);
}

export function useBalanceListener({ apiEndpoint, apiToken }: Settings) {
  const [hoprBalance, updateHoprBalance] = useState("0");

  useEffect(() => {
    const getHoprBalance = async () => {
      try {
        const { data } = await axios.get<{ hopr: string }>(
          `${apiEndpoint}/api/v2/account/balances${
            apiToken ? `?apiToken=${apiToken}` : ""
          }`
        );
        updateHoprBalance(fromWei(data.hopr));
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
