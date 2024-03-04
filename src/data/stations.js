// Fetch data from the URL
fetch('https://data.ny.gov/resource/wujg-7c2s.json?$query=SELECT%0A%20%20%60transit_timestamp%60%2C%0A%20%20%60transit_mode%60%2C%0A%20%20%60station_complex_id%60%2C%0A%20%20%60station_complex%60%2C%0A%20%20%60borough%60%2C%0A%20%20%60payment_method%60%2C%0A%20%20%60fare_class_category%60%2C%0A%20%20%60ridership%60%2C%0A%20%20%60transfers%60%2C%0A%20%20%60latitude%60%2C%0A%20%20%60longitude%60%2C%0A%20%20%60georeference%60%2C%0A%20%20%60%3A%40computed_region_kjdx_g34t%60%2C%0A%20%20%60%3A%40computed_region_yamh_8v7k%60%2C%0A%20%20%60%3A%40computed_region_wbg7_3whc%60%0AWHERE%0A%20%20%60transit_timestamp%60%0A%20%20%20%20BETWEEN%20%222024-02-01T00%3A00%3A00%22%20%3A%3A%20floating_timestamp%0A%20%20%20%20AND%20%222024-02-01T23%3A45%3A00%22%20%3A%3A%20floating_timestamp%0AORDER%20BY%20%60transit_timestamp%60%20ASC%20NULL%20LAST')
  .then(response => response.json())
  .then(data => {
    // Initialize new cities object
    const newCities = {
      type: "FeatureCollection",
      features: []
    };

    // Iterate over data and transform
    data.forEach(entry => {
      // Extract coordinates
      const coordinates = [parseFloat(entry.longitude), parseFloat(entry.latitude)];

      // Create new feature object
      const feature = {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: coordinates
        },
        properties: {
          city: entry.station_complex // Assuming 'station_complex' holds city names
        }
      };

      // Add feature to features array
      newCities.features.push(feature);
    });

    // Replace existing cities object with newCities
    // Here, you would assign newCities to the appropriate variable or constant
    console.log(newCities);
  })
  .catch(error => {
    console.error('Error fetching data:', error);
  });