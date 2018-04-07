let restaurants, neighborhoods, cuisines, comoBox;
var map;
var markers = [];


/**
 * Fetch neighborhoods and cuisines as soon as the page is loaded.
 */
document.addEventListener('DOMContentLoaded', (event) => {
  fetchNeighborhoods();
  fetchCuisines();
});



/**
 * Fetch all neighborhoods and set their HTML.
 */
fetchNeighborhoods = () => {
  DBHelper.fetchNeighborhoods((error, neighborhoods, comoBox) => {
    if (error) { // Got an error
      console.error(error);
    } else {
      self.neighborhoods = neighborhoods;
      fillNeighborhoodsHTML();
      // fillNeighborhoodsTestTestHTML();
    // var input = document.getElementById('neighborhood-input');
    // var listbox = document.getElementById('neighborhoods-select-test-listbox');
    // comboBox = new ComboBox(input, listbox);
    // new ComboBox(input, listbox);
    }
  });
};

//TEST REMOVE LATER

// /**
//  * Create all neighborhoods HTML and add them to the webpage.
//  */
// fillNeighborhoodsTestHTML = (neighborhoods = self.neighborhoods) => {
//     const ul = document.getElementById('neighborhoods-select-test');
//     neighborhoods.forEach(neighborhood => {
//         ul.append(createNeighborhoodHTML(neighborhood));
// });
// };
//
//
// /**
//  * Create neighboorhood HTML.
//  */
// createNeighborhoodHTML = (neighborhood) => {
//     console.log('neighborhood');
//     const li = document.createElement('li');
//     // li.className = 'list-item';
//     //Setting a tab index and a role on each list item
//     li.setAttribute("role", "option");
//     li.innerHTML = neighborhood;
//     li.value = neighborhood;
//     li.tabIndex = 0;
//     li.id = neighborhood;
//     li.addEventListener('mouseover', () => {
//         console.log('mouseover');
//     // li.setAttribute('aria-activedescendant', li.id);
// });
//     return li;
// };


// /**
//  * Set neighborhoods HTML.
//  */
// fillNeighborhoodsTestTestHTML = (neighborhoods = self.neighborhoods) => {
//     const ul = document.getElementById('neighborhoods-select-test');
//     neighborhoods.forEach(neighborhood => {
//         const li = document.createElement('li');
//     li.setAttribute("role", "option");
//     li.innerHTML = neighborhood;
//     li.value = neighborhood;
//     console.log(li.value);
//     ul.append(li);
//     });
// };



//TEST REMOVE LATER


/**
 * Set neighborhoods HTML.
 */
fillNeighborhoodsHTML = (neighborhoods = self.neighborhoods) => {
    const select = document.getElementById('neighborhoods-select');
    neighborhoods.forEach(neighborhood => {
        const option = document.createElement('option');
    option.innerHTML = neighborhood;
    option.value = neighborhood;
    select.append(option);
    });
}



/**
 * Fetch all cuisines and set their HTML.
 */
fetchCuisines = () => {
  DBHelper.fetchCuisines((error, cuisines) => {
    if (error) { // Got an error!
      console.error(error);
    } else {
      self.cuisines = cuisines;
      fillCuisinesHTML();
    }
  });
}

/**
 * Set cuisines HTML.
 */
fillCuisinesHTML = (cuisines = self.cuisines) => {
  const select = document.getElementById('cuisines-select');
  cuisines.forEach(cuisine => {
    const option = document.createElement('option');
    option.innerHTML = cuisine;
    option.value = cuisine;
    select.append(option);
  });
}
/**
 * Initialize Google map, called from HTML.
 */
window.initMap = () => {
  let loc = {
    lat: 40.722216,
    lng: -73.987501
  };
  self.map = new google.maps.Map(document.getElementById('map'), {
    zoom: 12,
    center: loc,
    scrollwheel: false,
  });
  updateRestaurants();
}
/**
 * Update page and map for current restaurants.
 */
updateRestaurants = () => {
  const cSelect = document.getElementById('cuisines-select');
  const nSelect = document.getElementById('neighborhoods-select');

  const cIndex = cSelect.selectedIndex;
  const nIndex = nSelect.selectedIndex;

  const cuisine = cSelect[cIndex].value;
  const neighborhood = nSelect[nIndex].value;

  DBHelper.fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, (error, restaurants) => {
    if (error) { // Got an error!
      console.error(error);
    } else {
      resetRestaurants(restaurants);
      fillRestaurantsHTML();
    }
  })
}

/**
 * Clear current restaurants, their HTML and remove their map markers.
 */
resetRestaurants = (restaurants) => {
  // Remove all restaurants
  self.restaurants = [];
  const ul = document.getElementById('restaurants-list');
  ul.innerHTML = '';

  // Remove all map markers
  self.markers.forEach(m => m.setMap(null));
  self.markers = [];
  self.restaurants = restaurants;
}

/**
 * Create all restaurants HTML and add them to the webpage.
 */
fillRestaurantsHTML = (restaurants = self.restaurants) => {
  const ul = document.getElementById('restaurants-list');
  restaurants.forEach(restaurant => {
    ul.append(createRestaurantHTML(restaurant));
  });
  addMarkersToMap();
    //Get count of restaurants returned in the list
    var resultsCount = document.getElementById("restaurants-list").getElementsByClassName('list-item').length;
    console.log(resultsCount);
    var resultHeader = document.getElementById("results-count");
    var resString = setResultString(resultsCount);
    resultHeader.innerHTML = resString;
}

function setResultString(res) {
    var resString;
    if (res) {
        resString = res + ' results';
    } else{
        resString = ' No results';
    }
    return resString;
}

/**
 * Create restaurant HTML.
 */
createRestaurantHTML = (restaurant) => {
  const li = document.createElement('li');
  li.className = 'list-item';
    //Setting a tab index and a role on each list item
    li.setAttribute("role", "option");
    li.tabIndex = 0;


  const image = document.createElement('img');
  image.className = 'restaurant-img';
  image.src = DBHelper.imageUrlForRestaurant(restaurant);
  image.title = restaurant.name;
  image.alt = restaurant.photograph_description;
    image.tabIndex = 0;
  li.append(image);

  const name = document.createElement('h1');
  name.innerHTML = restaurant.name;
    name.tabIndex = 0;
  li.append(name);

  const neighborhood = document.createElement('p');
  neighborhood.innerHTML = restaurant.neighborhood;
  li.append(neighborhood);

  const address = document.createElement('p');
  address.innerHTML = restaurant.address;
  li.append(address);

  const more = document.createElement('a');
  more.innerHTML = 'View Details';
  more.href = DBHelper.urlForRestaurant(restaurant);
  li.append(more);

    //Create button element in list
    // var btn = document.createElement("BUTTON");
    // var t = document.createTextNode("View Details");
    // btn.appendChild(t);
    // li.append(btn);
    // var myLink = DBHelper.urlForRestaurant(restaurant);
    // console.log(myLink);
    // btn.addEventListener('click', () => {
    //     window.location.href = myLink
    // });

  return li
}

/**
 * Add markers for current restaurants to the map.
 */
addMarkersToMap = (restaurants = self.restaurants) => {
  restaurants.forEach(restaurant => {
    // Add marker to the map
    const marker = DBHelper.mapMarkerForRestaurant(restaurant, self.map);
    google.maps.event.addListener(marker, 'click', () => {
      window.location.href = marker.url
    });
    self.markers.push(marker);
  });
}
