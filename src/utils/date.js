export const dateFromFirebase = (date) => new Date(date.seconds ? date.seconds * 1000 : date);