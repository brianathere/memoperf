import { useMemo } from "react";

export const BenchmarkNoopMemo = ({ level, prime, updateCount }: {level: number; prime: number; updateCount: number}) => {
  const primeCopy = useMemo(() => prime, [prime]);
  return <div>Benchmark noop with memo level: {primeCopy} {updateCount}</div>;
};

export const BenchmarkNoop = ({ level, prime, updateCount }: {level: number; prime: number; updateCount: number}) => {
  return <div>Benchmark noop prime: {prime} {updateCount}</div>;
};
