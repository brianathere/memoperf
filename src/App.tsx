import React, { Profiler, useCallback, useEffect, useMemo, useRef, useState } from "react";
import BenchmarkNormal from "./BenchmarkNormal";
import BenchmarkMemo from "./BenchmarkMemo";
import BenchmarkNoop from "./BenchmarkNoop";
import { eratosthenesSieve } from "./eratosthenes";

function Benchmark({ level, runName, setResults }: { level: number; runName: "noop" | "normal" | "memo"; setResults:  React.Dispatch<React.SetStateAction<number[]>> }) {
  const timesToUpdate = 10;
  const results = useRef<number[]>([]);
  const [updateCount, setUpdateCount] = useState<number>(0);
  
  useEffect(() => {
    if(updateCount < timesToUpdate) {
      setTimeout(() => {
        setUpdateCount(count => ++count);
      }, 0);
    } else {
      setResults(r => [...r, ...results.current]);
    }
  }, [setResults, updateCount]);
  // Callback for our profiler
  const renderProfiler: React.ProfilerOnRenderCallback = useCallback((...args) => {
    results.current.push(args[3]);
  }, []);

  return (
    <Profiler
      id={`${runName}`}
      onRender={renderProfiler}
    >
      <> 
        {runName ==="normal" ? (
          <div key={`${runName}`} >
            <BenchmarkNormal level={level} updateCount={updateCount} />
          </div>
        ) : runName === "noop" ? (
          <div key={`${runName}`} >
            <BenchmarkNoop level={level} updateCount={updateCount} />
          </div>
        ) : (
          <div  key={`${runName}`}>
            <BenchmarkMemo level={level} updateCount={updateCount} />
          </div>
        )}
      </>   
    </Profiler>
  );
}
export function App() {
  const [noopResults, setNoopResults] = useState<number[]>([]);
  const [normalResults, setNormalResults] = useState<number[]>([]);
  const [memoResults, setMemoResults] = useState<number[]>([]);
  const level = 500000;
  // Run this once before starting to let the JIT get a shot
  const prime = useMemo(() => {
    const next = eratosthenesSieve();
    for (let i = 0; i < level; ++i) {
      next();
    }
    return next();
  }, [level]);


  return (
    <div>
      {`Prime: ${prime}`}
      <div>
        {`Noop results = ${noopResults.length > 0 ? noopResults.reduce((a, b) => a + b) / noopResults.length : "NA"} ms`}
      </div>
      <div>
        {`Normal results = ${normalResults.length > 0 ? normalResults.reduce((a, b) => a + b) / normalResults.length : "NA"} ms`}
      </div>
      <div>
        {`Memo results = ${memoResults.length > 0 ? memoResults.reduce((a, b) => a + b) / memoResults.length : "NA"} ms`}
      </div>

      <div style={{ display: "inline"}}>
        <Benchmark key={"memo"} level={level} setResults={setMemoResults} runName={"memo"} />
        <Benchmark key={"noop"} level={level} setResults={setNoopResults} runName={"noop"} />
        <Benchmark key={"normal"} level={level} setResults={setNormalResults} runName={"normal"} />
      </div>
    </div>
  );
}
