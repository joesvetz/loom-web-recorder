"use client";

import { createContext } from 'react';

export const LoomContext = createContext(null);

export function LoomProvider({ children }) {
  return (
    <LoomContext.Provider value={{}}>
      {children}
    </LoomContext.Provider>
  );
}