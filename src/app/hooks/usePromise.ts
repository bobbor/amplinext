import { useCallback, useRef, useState } from "react";

export type State = {
  pending: boolean,
  completed: boolean,
  succeeded: boolean,
  failed: boolean
}

type Output<T> = State & {
  result: T | undefined
}

export const usePromise = <T, K>(fn: (...args: K[]) => Promise<T>): [Output<T>, (...args: K[]) => void] => {
  const fnRef = useRef<(...args: K[]) => Promise<T>>(fn);
  const [status, setStatus] = useState<'idle' | 'pending' | 'succeeded' | 'failed'>()
  const [result, setResult] = useState<T>()

  const runner = useCallback(async (...args: K[]) => {
    setResult(undefined)
    setStatus('pending');
    try {
      const output = await fnRef.current(...args)
      setResult(output)
      setStatus('succeeded');
    } catch {
      setStatus('failed');
    }
  }, [setStatus, setResult]);

  return [{
    pending: status === 'pending',
    completed: status === 'succeeded' || status === 'failed',
    succeeded: status === 'succeeded',
    failed: status === 'failed',
    result
  }, runner]
}