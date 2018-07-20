let restaurant;
var map;
var favorite_btn = document.createElement('button');
/**
 * Initialize Google map, called from HTML.
 */
window.initMap = () =>
{
    fetchRestaurantFromURL((error, restaurant) => {
        if (error) { // Got an error!
            console.error(error);
        } else {
            self.map = new google.maps.Map(document.getElementById('map'), {
            zoom: 16,
            center: restaurant.latlng,
            scrollwheel: false
        });
    fillBreadcrumb();
    DBHelper.mapMarkerForRestaurant(self.restaurant, self.map);
}
});
}

/**
 * Get current restaurant from page URL.
 */
fetchRestaurantFromURL = (callback) =>
{
    if (self.restaurant) { // restaurant already fetched!
        callback(null, self.restaurant)
        return;
    }
    const id = getParameterByName('id');
    if (!id) { // no id found in URL
        error = 'No restaurant id in URL'
        callback(error, null);
    } else {
        DBHelper.fetchRestaurantById(id, (error, restaurant) => {
            self.restaurant = restaurant;
        if (!restaurant) {
            console.error(error);
            return;
        }
        fillRestaurantHTML();
        callback(null, restaurant)
    })
        ;
    }
}

/**
 * Create restaurant HTML and add it to the webpage
 */
fillRestaurantHTML = (restaurant = self.restaurant) =>
{


    const name = document.getElementById('restaurant-name');
    name.innerHTML = restaurant.name;
    const id = self.restaurant.id;
    console.log('restaurant id', id);

    // fill favourite restaurant
    // fillFavouriteRestaurantHTML();
    const favorite = document.getElementById('favorite-restaurant');
    // const favorite_btn = document.createElement('button')
    const is_favorite = self.restaurant.is_favorite;

    if (is_favorite === 'true' || is_favorite === true ) {
        favorite_btn.innerHTML = 'Remove from Favorites';
        // favorite_btn.setAttribute('onclick', toggleFavorite(restaurant.id, false));
        favorite_btn.setAttribute('onclick', 'toggleFavorite(self.restaurant.id, false)');

    } else{
        favorite_btn.innerHTML = 'Add to Favorites';
        // favorite_btn.setAttribute('onclick', toggleFavorite(restaurant.id, true));
        favorite_btn.setAttribute('onclick', 'toggleFavorite(self.restaurant.id, true)');
    }

    favorite.appendChild(favorite_btn);


    const address = document.getElementById('restaurant-address');
    address.innerHTML = restaurant.address;

    const image = document.getElementById('restaurant-img');
    image.className = 'restaurant-img';

    const imageSrc = DBHelper.imageUrlForRestaurant(restaurant);

    image.srcset = DBHelper.imageSrcsetForRestaurant(restaurant);
    image.sizes = "30vw";
    image.title = restaurant.name;
    image.alt = 'Image of ' + restaurant.name + ' restaurant';

    const cuisine = document.getElementById('restaurant-cuisine');
    cuisine.innerHTML = restaurant.cuisine_type;

    // fill operating hours
    if (restaurant.operating_hours) {
        fillRestaurantHoursHTML();
    }
    // create review form
    // createReviewFormHTML();
    // fill reviews
    fillReviewsHTML();
}


// fillFavouriteRestaurantHTML = (is_favorite = self.restaurant.is_favorite, id = self.restaurant.id) =>
// {
//     console.log('is favorite', is_favorite);
//     console.log('id', id);
//     const favorite = document.getElementById('favorite-restaurant');
//
//     if (is_favorite === 'true' || is_favorite === true ){
//         favorite_btn.innerHTML = 'Remove from Favorites';
//         // favorite_btn.setAttribute('onclick', DBHelper.toggleFavorite(id, true) );
//         favorite_btn.setAttribute('onclick', toggleFavorite(false, id) );
//
//     } else {
//         favorite_btn.innerHTML = 'Add to Favorites ';
//         // favorite_btn.setAttribute('onclick', DBHelper.toggleFavorite(id, false) );
//         favorite_btn.setAttribute('onclick', toggleFavorite(true, id) );
//     }
//
//     favorite.append(favorite_btn);
// }
//
//
function toggleFavorite(id, status){

    const favorite = status;
    console.log('status', status);
    console.log('id', id);
    console.log('hello');

    if (favorite === false || favorite === 'false') {
        favorite_btn.innerHTML = 'Add to Favorites';
        console.log(favorite_btn.innerHTML);
    } else {
        favorite_btn.innerHTML = 'Remove from Favorites';
        console.log(favorite_btn.innerHTML);
    }

    DBHelper.setFavoriteStatus(id, status);
}


/**
 * Create restaurant operating hours HTML table and add it to the webpage.
 */
fillRestaurantHoursHTML = (operatingHours = self.restaurant.operating_hours) =>
{
    const hours = document.getElementById('restaurant-hours');
    for (let key in operatingHours) {
        const row = document.createElement('tr');

        const day = document.createElement('td');
        day.innerHTML = key;
        row.appendChild(day);

        const time = document.createElement('td');
        time.innerHTML = operatingHours[key];
        row.appendChild(time);

        hours.appendChild(row);
    }
}

// createReviewFormHTML = (id = self.restaurant.restaurant_id){
//
// }



/**
 * Create all reviews HTML and add them to the webpage.
 */
fillReviewsHTML = (reviews = self.restaurant.reviews) =>
{
    const container = document.getElementById('reviews-container');
    const title = document.createElement('h3');
    title.innerHTML = 'Reviews';
    container.appendChild(title);

    if (!reviews) {
        const noReviews = document.createElement('p');
        noReviews.innerHTML = 'No reviews yet!';
        container.appendChild(noReviews);
        return;
    }
    const ul = document.getElementById('reviews-list');
    reviews.forEach(review => {
        ul.appendChild(createReviewHTML(review));
})
    ;
    container.appendChild(ul);
}

/**
 * Create review HTML and add it to the webpage.
 */
createReviewHTML = (review) =>
{
    const li = document.createElement('li');
    li.tabIndex = 0;
    const name = document.createElement('p');
    name.innerHTML = review.name;
    name.id = 'reviewer';
    li.appendChild(name);

    const date = document.createElement('p');
    date.innerHTML = review.date;
    li.appendChild(date);

    const rating = document.createElement('p');
    rating.innerHTML = `Rating: ${review.rating}`;
    li.appendChild(rating);

    const comments = document.createElement('p');
    comments.innerHTML = review.comments;
    li.appendChild(comments);

    return li;
}

/**
 * Add restaurant name to the breadcrumb navigation menu
 */
fillBreadcrumb = (restaurant = self.restaurant) =>
{
    var linkName = document.getElementById('current-page');
    linkString = restaurant.name;
    linkName.innerHTML = linkString;
}

/**
 * Get a parameter by name from page URL.
 */
getParameterByName = (name, url) =>
{
    if (!url)
        url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`),
        results = regex.exec(url);
    if (!results)
        return null;
    if (!results[2])
        return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}
