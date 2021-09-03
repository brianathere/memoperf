import React, { Profiler, useCallback, useEffect, useMemo, useRef, useState } from "react";
import BenchmarkNormal from "./BenchmarkNormal";
import BenchmarkMemo from "./BenchmarkMemo";
import { BenchmarkNoop, BenchmarkNoopMemo } from "./BenchmarkNoop";
import { eratosthenesSieve } from "./eratosthenes";

function Benchmark({ level, prime, runName, setResults }: { level: number; prime: number; runName: "noop" | "noopMemo" | "normal" | "memo"; setResults:  React.Dispatch<React.SetStateAction<number[]>> }) {
  const timesToUpdate = 100;
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
    results.current.push(args[2]);
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
            <BenchmarkNoop level={level} updateCount={updateCount} prime={prime} />
          </div>
        ) : runName === "noopMemo" ? (
          <div key={`${runName}`} >
            <BenchmarkNoopMemo level={level} updateCount={updateCount} prime={prime}/>
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
  const [noopMemoResults, setNoopMemoResults] = useState<number[]>([]);
  const [normalResults, setNormalResults] = useState<number[]>([]);
  const [memoResults, setMemoResults] = useState<number[]>([]);
  const primeTime = useRef<number>(0);
  const level = 500000;
  // Run this once before starting to let the JIT get a shot
  const prime = useMemo(() => {
    const start = performance.now();
    const next = eratosthenesSieve();
    for (let i = 0; i < level; ++i) {
      next();
    }
    const stop = performance.now();
    primeTime.current = stop - start;

    return next();
  }, [level]);


  return (
    <div>
      {`Prime: ${prime} ${primeTime.current} ms`}
      <div>
        {`Noop results = ${noopResults.length > 0 ? noopResults.reduce((a, b) => a + b) : "NA"} ms`}
      </div>
      <div>
        {`NoopMemo results = ${noopMemoResults.length > 0 ? noopMemoResults.reduce((a, b) => a + b) : "NA"} ms`}
      </div>
      <div>
        {`Normal results = ${normalResults.length > 0 ? normalResults.reduce((a, b) => a + b) : "NA"} ms`}
      </div>
      <div>
        {`Memo results = ${memoResults.length > 0 ? memoResults.reduce((a, b) => a + b) : "NA"} ms`}
      </div>

      <div style={{ display: "inline"}}>
        <Benchmark key={"noop"} level={level} prime={prime} setResults={setNoopResults} runName={"noop"} />
        <Benchmark key={"noopMemo"} level={level} prime={prime} setResults={setNoopMemoResults} runName={"noopMemo"} />
        <Benchmark key={"memo"} level={level} prime={prime} setResults={setMemoResults} runName={"memo"} />
        <Benchmark key={"normal"} level={level} prime={prime} setResults={setNormalResults} runName={"normal"} />
      </div>
    </div>
  );
}
