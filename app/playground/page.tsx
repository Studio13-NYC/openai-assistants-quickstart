import styles from "./page.module.css";

export default function Playground() {
  return (
    <div className={styles.pageContainer}>
      <div className={styles.content}>
        <h1>API Playground</h1>
        <p className={styles.description}>
          This page will contain API testing and exploration tools.
        </p>
        <div className={styles.features}>
          <div className={styles.feature}>
            <h2>Coming Soon</h2>
            <ul>
              <li>Interactive API testing</li>
              <li>Request/Response inspection</li>
              <li>API documentation</li>
              <li>Response visualization</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 