"use client";

import { useState } from "react";

export const Component = () => {
  const [state, setState] = useState(0);

  return (
    <div>
      {state}
      <button type="button" onClick={() => setState(state + 1)}>
        Increment
      </button>
    </div>
  );
};
