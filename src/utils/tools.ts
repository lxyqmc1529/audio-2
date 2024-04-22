export function parseJSONWithCatch(str: string, defaultValue?: any) {
  try {
    return JSON.parse(str);
  } catch (err) {
    return defaultValue;
  }
}
