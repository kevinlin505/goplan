export default function getTravelDates(tripDetail) {
  return tripDetail.destinations.reduce((dates, destination) => {
    if (!dates.startAt || dates.startAt > destination.startAt) {
      dates.startAt = destination.startAt;
    }

    if (!dates.endAt || dates.endAt < destination.endAt) {
      dates.endAt = destination.endAt;
    }

    return dates;
  }, {});
}
