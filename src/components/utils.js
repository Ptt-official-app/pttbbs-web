import moment from 'moment'

export const TSToDateTimeStr = (ts) => {
  return moment.unix(ts).format('YYYY-MM-DD hh:mm:ss')
}