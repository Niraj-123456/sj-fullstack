export function readFromLocalStorage(key) {
  if (typeof window !== "undefined") return localStorage.getItem(key);
}

export function writeToLocalStorage(key, value) {
  if (typeof window !== "undefined") return localStorage.setItem(key, value);
}

export function removeFromLocalStorage(key) {
  if (typeof window !== "undefined") return localStorage.removeItem(key);
}
