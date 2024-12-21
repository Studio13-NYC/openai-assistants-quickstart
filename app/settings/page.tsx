import styles from "./page.module.css";

export default function Settings() {
  return (
    <div className={styles.pageContainer}>
      <div className={styles.content}>
        <h1>Settings</h1>
        <p className={styles.description}>
          Configure your application settings and preferences.
        </p>
        <div className={styles.features}>
          <div className={styles.feature}>
            <h2>Coming Soon</h2>
            <ul>
              <li>API Configuration</li>
              <li>Theme Preferences</li>
              <li>Language Settings</li>
              <li>Notification Controls</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 