import Keys from '@constants/Keys';

export default function weatherApi(
  locationCoord = { latitude: 0, longitude: 0 },
) {
  return fetch(
    `http://api.openweathermap.org/data/2.5/weather?lat=${locationCoord.latitude}&lon=${locationCoord.longitude}&units=imperial&appid=${Keys.OPENWEATHER.apiKey}`,
  ).then(resp => resp.json());
}
