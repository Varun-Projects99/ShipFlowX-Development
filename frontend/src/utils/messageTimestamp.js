/**
 * Formats a Date object or timestamp string into a 12-hour format string (e.g., 04:30 PM).
 * 
 * @param {Date|string|number} date The date input
 * @returns {string} The formatted timestamp string
 */
export const formatTimestamp = (date) => {
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';

  let hours = d.getHours();
  const minutes = d.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  
  hours = hours % 12;
  hours = hours ? hours : 12; // The hour '0' should be '12'
  const minutesStr = minutes < 10 ? '0' + minutes : minutes;

  return `${hours}:${minutesStr} ${ampm}`;
};
