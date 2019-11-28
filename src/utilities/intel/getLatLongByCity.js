export default async function getLatLongByCityname(city, country) {
  // Check if city has been set
  if(city && country){
    // Remove spaces from strings
    city = city.trim();
    country = country.trim();

    // Set API link and infuse city and API key
    const api = `https://api.opencagedata.com/geocode/v1/json?q=${city}
&key=${process.env.REACT_APP_LATLONG_APIKEY}
&language=en`;

    // Get response
    let response = await fetch(api);

    // If the response was successful
    if(response.ok){
      // Get json of response
      let json = await response.json();

      // If there is content to the response json
      if(json){
        if(json.results){
          let results = json.results;

          // Init variables
          let geometry = undefined;

          // Go through every result and check the confidence
          results.map((result, i) => {
            console.log(result);
            if(result.components["ISO_3166-1_alpha-2"] === country){
              if(!geometry){
                geometry = {
                  status: response.status,
                  confidence: result.confidence,
                  lat: result.geometry.lat,
                  lng: result.geometry.lng
                };
              } else {
                if(result.confidence > geometry.confidence){
                  geometry = {
                    status: response.status,
                    confidence: result.confidence,
                    lat: result.geometry.lat,
                    lng: result.geometry.lng
                  };
                }
              }
            }
          });
          // Return final result
          return geometry;
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
