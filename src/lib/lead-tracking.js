const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"];

export const getLeadAttribution = () => {
  const params = new URLSearchParams(window.location.search);
  return UTM_KEYS.reduce(
    (acc, key) => {
      const value = params.get(key);
      if (value) acc[key] = value.slice(0, 120);
      return acc;
    },
    { page_path: window.location.pathname }
  );
};
