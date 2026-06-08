import { useEffect, useRef } from "react";

function useInitialLoad(load) {
  const initialLoadRef = useRef(load);

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      initialLoadRef.current();
    }, 0);

    return () => window.clearTimeout(timerId);
  }, []);
}

export default useInitialLoad;
