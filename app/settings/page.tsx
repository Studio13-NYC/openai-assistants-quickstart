"use client";

import { useState, useEffect } from "react";
import styles from "./page.module.css";

interface EnvVar {
  key: string;
  value: string;
  description?: string;
}

const ENV_DESCRIPTIONS: Record<string, string> = {
  OPENAI_API_KEY: "OpenAI API Key for accessing their services",
  NEO4J_URI: "URI for connecting to Neo4j database",
  NEO4J_USER: "Neo4j database username",
  NEO4J_PASSWORD: "Neo4j database password",
  CHROMA_HOST: "Chroma database host",
  CHROMA_PORT: "Chroma database port",
  SOURCE_FILE_PATH: "Path to source files",
  OPENAI_ASSISTANT_ID: "OpenAI Assistant ID",
  NEXT_PUBLIC_BRANCH_NAME: "Current branch name displayed in the UI",
};

const SettingsPage = () => {
  const [envVars, setEnvVars] = useState<EnvVar[]>([]);
  const [isEditing, setIsEditing] = useState<Record<string, boolean>>({});
  const [editValues, setEditValues] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEnvVars = async () => {
      try {
        const response = await fetch('/api/settings/env');
        if (!response.ok) {
          throw new Error('Failed to fetch environment variables');
        }
        const data = await response.json();
        
        // Convert to array format with descriptions
        const vars = Object.entries(data).map(([key, value]) => ({
          key,
          value: value as string,
          description: ENV_DESCRIPTIONS[key]
        }));
        
        setEnvVars(vars);
        
        // Initialize edit values
        const initialEditValues = vars.reduce((acc, { key, value }) => ({
          ...acc,
          [key]: value
        }), {});
        setEditValues(initialEditValues);
        setError(null);
      } catch (err) {
        console.error('Error fetching environment variables:', err);
        setError('Failed to load environment variables');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEnvVars();
  }, []);

  const handleEdit = (key: string) => {
    setIsEditing(prev => ({ ...prev, [key]: true }));
  };

  const handleSave = async (key: string) => {
    try {
      const response = await fetch('/api/settings/env', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          key,
          value: editValues[key]
        }),
      });

      if (response.ok) {
        setEnvVars(prev => 
          prev.map(v => v.key === key ? { ...v, value: editValues[key] } : v)
        );
        setIsEditing(prev => ({ ...prev, [key]: false }));
      } else {
        alert('Failed to update environment variable');
      }
    } catch (error) {
      console.error('Error updating environment variable:', error);
      alert('Error updating environment variable');
    }
  };

  const handleCancel = (key: string) => {
    setIsEditing(prev => ({ ...prev, [key]: false }));
    setEditValues(prev => ({
      ...prev,
      [key]: envVars.find(v => v.key === key)?.value || ""
    }));
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.content}>
        <h1>Settings</h1>
        <p>Configure your assistant and API preferences.</p>

        <section className={styles.section}>
          <h2>Environment Variables</h2>
          <div className={styles.envVars}>
            {isLoading ? (
              <div className={styles.loading}>Loading environment variables...</div>
            ) : error ? (
              <div className={styles.error}>{error}</div>
            ) : envVars.length === 0 ? (
              <div className={styles.empty}>No environment variables found</div>
            ) : (
              envVars.map(({ key, value, description }) => (
                <div key={key} className={styles.envVar}>
                  <div className={styles.envVarHeader}>
                    <span className={styles.envVarKey}>{key}</span>
                    {description && (
                      <span className={styles.envVarDescription}>{description}</span>
                    )}
                  </div>
                  <div className={styles.envVarContent}>
                    {isEditing[key] ? (
                      <div className={styles.envVarEdit}>
                        <input
                          type="text"
                          value={editValues[key] || ""}
                          onChange={(e) => setEditValues(prev => ({
                            ...prev,
                            [key]: e.target.value
                          }))}
                          className={styles.envVarInput}
                          title={`Edit ${key}`}
                          placeholder={`Enter value for ${key}`}
                          aria-label={`Edit ${key}`}
                        />
                        <div className={styles.envVarActions}>
                          <button 
                            onClick={() => handleSave(key)}
                            className={styles.saveButton}
                          >
                            Save
                          </button>
                          <button 
                            onClick={() => handleCancel(key)}
                            className={styles.cancelButton}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className={styles.envVarDisplay}>
                        <span className={styles.envVarValue}>{value}</span>
                        <button 
                          onClick={() => handleEdit(key)}
                          className={styles.editButton}
                        >
                          Edit
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        <section className={styles.section}>
          <h2>Coming Soon</h2>
          <div className={styles.features}>
            <div className={styles.feature}>
              <h3>API Configuration</h3>
              <p>Set your OpenAI API key and other API-related settings.</p>
            </div>
            <div className={styles.feature}>
              <h3>Assistant Preferences</h3>
              <p>Customize the behavior and appearance of your AI assistant.</p>
            </div>
            <div className={styles.feature}>
              <h3>Usage Statistics</h3>
              <p>View your API usage and conversation history.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default SettingsPage; 