"use client";

import React from "react";

import { LanguageProvider } from '../junkyard/useTranslation';
import { Home } from "@/components/Home";

const App = () => (
  <LanguageProvider>
    <Home />
  </LanguageProvider>
);

export default App;
