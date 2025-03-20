export const saveToLocalStorage = (key, value) => {
  localStorage.setItem(key, value);
};

export const loadFromLocalStorage = (key) => {
  return localStorage.getItem(key);
};

export const removeFromLocalStorage = (key) => {
  localStorage.removeItem(key);
};

export const clearLocalStorage = () => {
  localStorage.clear();
};
