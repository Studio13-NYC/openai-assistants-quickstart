"use client";

import React from "react";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.pageContainer}>
      <div className={styles.content}>
        <h1>Welcome to OpenAI Assistant</h1>
        <p>Select a tab above to get started.</p>
        <div className={styles.features}>
          <div className={styles.feature}>
            <h2>Chat</h2>
            <p>Interact with the AI assistant and get real-time responses.</p>
          </div>
          <div className={styles.feature}>
            <h2>API Playground</h2>
            <p>Test and explore the OpenAI API capabilities.</p>
          </div>
          <div className={styles.feature}>
            <h2>Settings</h2>
            <p>Configure your assistant and API preferences.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
