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
  httpEndpoint,
  securityToken,
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
          `${httpEndpoint}/api/v2/tickets/statistics${
            securityToken ? `?apiToken=${securityToken}` : ""
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
  }, [httpEndpoint, securityToken]);
}

export function useBalanceListener({ httpEndpoint, securityToken }: Settings) {
  const [hoprBalance, updateHoprBalance] = useState("0");

  useEffect(() => {
    const getHoprBalance = async () => {
      try {
        const { data } = await axios.get<{ hopr: string }>(
          `${httpEndpoint}/api/v2/account/balances${
            securityToken ? `?apiToken=${securityToken}` : ""
          }`
        );
        updateHoprBalance(fromWei(data.hopr));
      } catch (error) {
        console.log(error);
      }
    };

    getHoprBalance();
    // to make coins feel more organic interval will have 20% variance
    const interval = setInterval(() => getHoprBalance(), 10000);

    return () => clearInterval(interval);
  }, [httpEndpoint, securityToken]);

  return { hoprBalance };
}
