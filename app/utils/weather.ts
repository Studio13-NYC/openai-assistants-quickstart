interface WeatherData {
  location: string;
  temperature: number;
  conditions: "Sunny" | "Cloudy" | "Rainy" | "Snowy" | "Windy";
}

export function getWeather(location: string): WeatherData {
  // Mock weather data - in a real app, this would call a weather API
  const conditions = ["Sunny", "Cloudy", "Rainy", "Snowy", "Windy"] as const;
  const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
  const randomTemp = Math.floor(Math.random() * 50) + 40; // Random temp between 40-90°F

  return {
    location,
    temperature: randomTemp,
    conditions: randomCondition,
  };
}
