// place files you want to import through the `$lib` alias in this folder.

export function debounce<T extends unknown[]>(callback: (...args: T) => void, wait = 300): (...args: T) => void {
  let timeout: ReturnType<typeof setTimeout>;

  return (...args: T): void => {
    clearTimeout(timeout);
    timeout = setTimeout(() => callback(...args), wait);
  };
}
