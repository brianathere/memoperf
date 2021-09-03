import React from "react";
import { eratosthenesSieve } from "./eratosthenes";
const BenchmarkNormal = ({ level, updateCount }: {level: number; updateCount: number}) => {
    const next = eratosthenesSieve();
    for (let i = 0; i < level; ++i) {
        next();
      }
      const prime = next();
  return <div>Benchmark level: {prime} ${updateCount}</div>;
};
export default BenchmarkNormal;
