export function groupByKey<T>(list: T[], key: (item: T) => number): [number, T[]][] {
  const map = new Map<number, T[]>();
  for (const item of list) {
    const k = key(item);
    const bucket = map.get(k);
    if (bucket) bucket.push(item);
    else map.set(k, [item]);
  }
  return [...map.entries()].sort((a, b) => a[0] - b[0]);
}
