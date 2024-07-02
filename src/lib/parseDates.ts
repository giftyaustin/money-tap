export const getDateFromDate = (dateTime: string | number | Date): string => {
  const dateObject = new Date(dateTime);

  const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "short", day: "2-digit" };

  const formattedDate = dateObject.toLocaleString("en-US", options);

  return formattedDate;
};

export const getTimeFromDate = (dateTime: string | number | Date): string => {
  const dateObject = new Date(dateTime);

  const timeOptions: Intl.DateTimeFormatOptions = { hour: "numeric", minute: "2-digit", hour12: true };

  const formattedTime = dateObject.toLocaleString("en-US", timeOptions);
  return formattedTime;
};
