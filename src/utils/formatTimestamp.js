export default function formatTimestamp(timeInMilliSeconds) {
  if (!timeInMilliSeconds) {
    return '';
  }

  const currentTimeInSeconds = Math.round(Date.now() / 1000);
  const timeDiffInSeconds = currentTimeInSeconds - timeInMilliSeconds / 1000;
  const minute = 60;
  const hour = minute * 60;
  const day = hour * 24;
  const month = day * 30;
  const year = month * 12;
  let formattedTimestamp;

  switch (true) {
    case timeDiffInSeconds < minute:
      formattedTimestamp = 'sec ago';
      break;
    case timeDiffInSeconds < minute * 2:
      formattedTimestamp = 'min ago';
      break;
    case timeDiffInSeconds < hour:
      formattedTimestamp = `${(timeDiffInSeconds / minute).toFixed(
        0,
      )} mins ago`;
      break;
    case timeDiffInSeconds < hour * 2:
      formattedTimestamp = 'hour ago';
      break;
    case timeDiffInSeconds < day:
      formattedTimestamp = `${(timeDiffInSeconds / hour).toFixed(0)} hours ago`;
      break;
    case timeDiffInSeconds < day * 2:
      formattedTimestamp = 'day ago';
      break;
    case timeDiffInSeconds < month:
      formattedTimestamp = `${(timeDiffInSeconds / day).toFixed(0)} days ago`;
      break;
    case timeDiffInSeconds < month * 2:
      formattedTimestamp = 'month ago';
      break;
    case timeDiffInSeconds < year:
      formattedTimestamp = `${(timeDiffInSeconds / month).toFixed(
        0,
      )} months ago`;
      break;
    case timeDiffInSeconds < year * 2:
      formattedTimestamp = 'year';
      break;
    default:
      formattedTimestamp = `${(timeDiffInSeconds / year).toFixed(0)} years ago`;
      break;
  }

  return formattedTimestamp;
}
