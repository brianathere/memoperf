import React, { useMemo } from "react";
import  { eratosthenesSieve } from "./eratosthenes";
const BenchmarkMemo = ({ level, updateCount }: {level: number; updateCount: number}) => {
  const prime = useMemo(() => {
    const next = eratosthenesSieve();
    for (let i = 0; i < level; ++i) {
      next();
    }
    return next();
  }, [level]);
  return <div>Benchmark with memo level: {prime} ${updateCount}</div>;
};
export default BenchmarkMemo;
