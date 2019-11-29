export default async function getWeatherbyLatLng(lat, lng) {
  // Check if lat/lng have been set
  if(lat && lng){

    const time = new Date(new Date().setFullYear(new Date().getFullYear() -1 ));
    let timestamp = Math.round(time/1000);

    // Set API link and infuse with data
    const api = `https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/
${process.env.REACT_APP_DARKSKY_APIKEY}/
${lat},${lng},
${timestamp}?exclude=currently,flags,hourly,alerts`;

    // Get response
    let response = await fetch(api);

    // If the response was successful
    if(response.ok){
      // Get json of response
      let json = await response.json();

      // If there is content to the response json
      if(json){
        if(json.daily){
          let day = json.daily.data[0];
          return {
            status: 200,
            avgTemp: (5/9) * (((day.temperatureHigh + day.temperatureLow) / 2) - 32),
            uvIndex: day.uvIndex,
            humidity: day.humidity,
          }
        }
      }
    } else {
      return {
        status: response.status
      }
    }
  } else {
    return {
      status: 400
    }
  }
}

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019 Werbeagentur Christian Aichner
 */
