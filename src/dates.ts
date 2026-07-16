export const dateFormat = new Intl.DateTimeFormat('en-US', {
  year: '2-digit',
  month: '2-digit',
  day: '2-digit'
} as Intl.DateTimeFormatOptions)

export const dateTimeFormat = new Intl.DateTimeFormat('en-US', {
  minute: '2-digit',
  hour: '2-digit',
  year: '2-digit',
  month: '2-digit',
  day: '2-digit'
} as Intl.DateTimeFormatOptions)

export function dateTimeToString(date: null | string | number): string | null {
  if (date && date !== 0) {
    return dateTimeFormat.format(new Date(date))
  }
  return null
}

export function dateToString(date: string | number) {
  if (date && date !== 0) {
    return dateFormat.format(new Date(date))
  }
  return null
}

// Formats a duration given in (possibly fractional) seconds as hh:mm:ss.
export function durationToString(seconds: null | undefined | number): string | null {
  if (seconds === null || seconds === undefined || isNaN(seconds) || seconds < 0) {
    return null
  }
  const totalSeconds = Math.floor(seconds / 1000) // the value comes as milliseconds
  const hh = Math.floor(totalSeconds / 3600)
  const mm = Math.floor((totalSeconds % 3600) / 60)
  const ss = totalSeconds % 60
  const pad = (n: number) => n.toString().padStart(2, '0')
  return `${pad(hh)}:${pad(mm)}:${pad(ss)}`
}
