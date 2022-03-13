import { useCurrentBalance, useTotalSupply } from "../api/Erc20";
import { DAOS, TOKE_CONTRACT } from "../constants";
import { BigNumber } from "ethers";
import { formatEther } from "ethers/lib/utils";
import { BaseCard } from "./DaoDetailsCard";
import { SimpleGrid, Stat, StatHelpText, StatNumber } from "@chakra-ui/react";
import { TokeChart } from "./TokeChart";
import { Page } from "./Page";
import { formatMoney, formatNumber } from "../util/maths";
import { REACTORS } from "../constants";
import { useTokenPrice } from "../api/coinGecko";
import { parseInt } from "lodash";

export function Home() {
  const { data: tokeTreasury } = useCurrentBalance(
    TOKE_CONTRACT,
    "0x8b4334d4812C530574Bd4F2763FcD22dE94A969B"
  );

  const { data: toke_price } = useTokenPrice("tokemak");

  //TODO: this doesn't match the amount coin gecko says is vesting https://www.coingecko.com/en/coins/tokemak
  const { data: vesting } = useCurrentBalance(
    TOKE_CONTRACT,
    "0x96F98Ed74639689C3A11daf38ef86E59F43417D3"
  );

  const { data: totalSupply } = useTotalSupply(TOKE_CONTRACT);

  let circulating = BigNumber.from(0);

  if (totalSupply && tokeTreasury && vesting) {
    circulating = totalSupply.sub(vesting).sub(tokeTreasury);
  }

  return (
    <Page header="Toke Wars Dashboard">
      <SimpleGrid
        columns={{ base: 1, md: 3 }}
        spacing={{ base: 5, lg: 8 }}
        style={{ alignSelf: "stretch" }}
        px={5}
      >
        <BaseCard title="Total DAO Owned TOKE">
          <Stat>
            <StatNumber>{formatNumber(1000000)}</StatNumber>
            <StatHelpText>{formatMoney(1000000 * toke_price)}</StatHelpText>
          </Stat>
        </BaseCard>

        <BaseCard title="Circulating Supply">
          <Stat>
            <StatNumber>
              {formatNumber(parseInt(formatEther(circulating)))}
            </StatNumber>
            <StatHelpText>
              {formatMoney(parseFloat(formatEther(circulating)) * toke_price)}
            </StatHelpText>
          </Stat>
        </BaseCard>

        <BaseCard title="DAOs Accumulating">
          <Stat>
            <StatNumber>{DAOS.length}</StatNumber>
            <StatHelpText>Total Reactors: {REACTORS.length}</StatHelpText>
          </Stat>
        </BaseCard>
      </SimpleGrid>

      <TokeChart
        addresses={Object.values(DAOS).flatMap((obj) => obj.addresses)}
      />
    </Page>
  );
}
