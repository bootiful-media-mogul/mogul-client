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

export function dateTimeToString(date: number) {
  if (date && date !== 0) {
    return dateTimeFormat.format(new Date(date))
  }
  return null
}
export function dateToString(date: number) {
  if (date && date !== 0) {
    return dateFormat.format(new Date(date))
  }
  return null
}
