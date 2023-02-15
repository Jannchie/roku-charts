export function getMinDifference<D> (arr: D[], visitor: (d: D) => number): number {
  arr.sort((a, b) => visitor(a) - visitor(b)) // sort the array in ascending order
  let minDifference = Number.MAX_VALUE
  for (let i = 0; i < arr.length - 1; i++) {
    const difference = visitor(arr[i + 1]) - visitor(arr[i])
    if (difference < minDifference) {
      minDifference = difference
    }
  }

  return minDifference
}
