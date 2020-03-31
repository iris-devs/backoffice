export const formatFirebaseDate = (date) => {
  return new Date(date.seconds ? date.seconds * 1000 : date)
    .toLocaleString()
}