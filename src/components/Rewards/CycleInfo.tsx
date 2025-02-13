import { useQuery } from "react-query";
import { ManagerContract__factory } from "../../typechain";
import { provider } from "../../util/providers";
import { BaseCard } from "../DaoDetailsCard";
import { Stat, StatHelpText, StatNumber } from "@chakra-ui/react";
import { formatDistanceToNow } from "date-fns";
import { useEffect, useState } from "react";

export function CycleInfo() {
  const { data } = useQuery("managerContract", async () => {
    const contract = ManagerContract__factory.connect(
      "0xA86e412109f77c45a3BC1c5870b880492Fb86A14",
      provider
    );

    const cycleIndex = (await contract.getCurrentCycleIndex()).toNumber();
    const nextCycle = new Date(
      (await contract.nextCycleStartTime()).toNumber() * 1000
    );

    return { cycleIndex, nextCycle };
  });

  const [nextCycle, setNextCycle] = useState("");
  useEffect(() => {
    function updateCycle() {
      setNextCycle(
        formatDistanceToNow(data.nextCycle, { includeSeconds: true })
      );
    }
    if (data) {
      updateCycle();
    }
    const interval = setInterval(updateCycle, 1000 * 60);
    return () => clearInterval(interval);
  }, [data]);

  return (
    <BaseCard title="Current Cycle">
      <Stat>
        <StatNumber>{data?.cycleIndex}</StatNumber>
        {/* calc days until next cycle */}
        <StatHelpText>Next Cycle in {nextCycle}</StatHelpText>
      </Stat>
    </BaseCard>
  );
}
