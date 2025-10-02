function compareTime(timeString1, timeString2) {
  // Trim extra spaces
  timeString1 = timeString1.trim();
  timeString2 = timeString2.trim();

  // Prepend a fixed dummy date
  const dateTime1 = new Date(`1970-01-01T${timeString1}`);
  const dateTime2 = new Date(`1970-01-01T${timeString2}`);

  return dateTime1.getTime() < dateTime2.getTime();
}


module.exports = {
    compareTime
}