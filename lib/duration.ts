export const second = 1
export const minute = 60 * second
export const hour = 60 * minute
export const day = 24 * hour
export const year = 365 * day

export function Duration(seconds: number) {
  return {
    get seconds() {
      return seconds
    },
    get milliseconds() {
      return seconds * 1000
    },
  }
}
