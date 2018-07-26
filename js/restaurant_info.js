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

    fetchReviewFromURL((error, review) => {
        if (error) { // Got an error!
            console.error(error);
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
    console.log('restaurant id', id);
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

fetchReviewFromURL = (callback) =>
{
    if (self.review) { // restaurant already fetched!
        callback(null, self.review)
        return;
        console.log('self', self);
    }
    const id = getParameterByName('id');
    console.log('review id', id);
    if (!id) { // no id found in URL
        error = 'No restaurant id in URL'
        callback(error, null);
    } else {
        DBHelper.fetchReviewById(id, (error, review) => {
            console.log('fetchReviewFromURL', review);
        if (!review) {
            console.error(error);
            return;
        }
        fillReviewsHTML(review);
        callback(null, review)
    })
        ;
    }
}


/**
 * Create all reviews HTML and add them to the webpage.
 */
// fillReviewsHTML = (reviews = self.reviews) =>
// {
//     const container = document.getElementById('reviews-container');
//     const title = document.createElement('h3');
//     title.innerHTML = 'Reviews';
//     container.appendChild(title);
//
//     if (!reviews) {
//         const noReviews = document.createElement('p');
//         noReviews.innerHTML = 'No reviews yet!';
//         container.appendChild(noReviews);
//         return;
//     }
//     const ul = document.getElementById('reviews-list');
//     reviews.forEach(review => {
//         ul.appendChild(createReviewHTML(review));
// })
//     ;
//     container.appendChild(ul);
// }

fillReviewsHTML = (reviews) =>
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
 * Create restaurant HTML and add it to the webpage
 */
fillRestaurantHTML = (restaurant = self.restaurant) =>
{

    const name = document.getElementById('restaurant-name');
    name.innerHTML = restaurant.name;
    const id = self.restaurant.id;
    console.log('restaurant id', id);

    const favorite = document.getElementById('favorite-restaurant');
    fillFavouriteRestaurantHTML();

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
    createReviewFormHTML();
    // fill reviews
    fillReviewsHTML();
}


fillFavouriteRestaurantHTML = (is_favorite = self.restaurant.is_favorite, id = self.restaurant.id) =>
{
    console.log('is favorite', is_favorite);
    console.log('id', id);

    if (is_favorite === 'true' || is_favorite === true ) {
        favorite_btn.innerHTML = 'Remove from Favorites';
        favorite_btn.setAttribute('onclick', 'toggleFavorite(self.restaurant.id, false)');

    } else{
        favorite_btn.innerHTML = 'Add to Favorites';
        favorite_btn.setAttribute('onclick', 'toggleFavorite(self.restaurant.id, true)');
    }

}

function toggleFavorite(id, status){

    DBHelper.setFavoriteStatus (id, status)
        .then(function(response) {
            const data = response;
            console.log('data', data);
            console.log('is favorite', data.is_favorite);
            fillFavouriteRestaurantHTML (data.is_favorite, data.id);

            if(data.is_favorite === 'true' || data.is_favorite === true) {
                DBHelper.addToIDB(id, data, 'favorite-restaurants');
            } else {
                // DBHelper.addToIDB(id, data, 'favorite-restaurants');
                DBHelper.deleteFromIDB(id, 'favorite-restaurants');
            }
        });
}

// function postReviewToDatabase(event, form){
//
//     event.preventDefault();
//
//     console.log('form', form);
//
//     const formObject = {
//         "restaurant_id": form.id.value,
//         "name": form.name.value,
//         "comments": form.comments.value,
//     };
//
//     DBHelper.addToIDB(formObject.id.value, formObject, 'restaurant-reviews');
//
//
//     // DBHelper.postReviewToDatabase(formObject);
//     //     .then(function(response) {
//     //         const data = response;
//     //         console.log('formObject', data);
//     //         DBHelper.addToIDB(formObject.id.value, formObject, 'restaurant-reviews');
//     //     // fillFavouriteRestaurantHTML (data.is_favorite, data.id);
//     //
//     //     });
// }






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
* Create review HTML and add it to the webpage.
*/

createReviewFormHTML = (id = self.restaurant.id) =>
{
    console.log (id);

    const form = document.getElementById('review-form');
    const reviewForm = document.createElement('form');

    // reviewForm.setAttribute("action", "http://localhost:1337/reviews/");
    // reviewForm.setAttribute("method", "post");
    reviewForm.setAttribute('onSubmit', 'DBHelper.saveOffline(event,this)');
    // reviewForm.setAttribute('onSubmit', 'DBHelper.postReviewToDatabase(event,this)');
    // reviewForm.setAttribute('onSubmit', 'postReviewToDatabase(event,this)');
    form.appendChild(reviewForm);

    const title = document.createElement('h2'); // Heading of Form
    title.innerHTML = "Add a Review?";
    reviewForm.appendChild(title);

    const nameLabel = document.createElement('label'); // Create Label for Name Field
    nameLabel.innerHTML = "Name : "; // Set Field Labels
    reviewForm.appendChild(nameLabel);

    const restaurantID = document.createElement('input');
    restaurantID.setAttribute("type", "hidden");
    restaurantID.setAttribute("name", "id");
    restaurantID.setAttribute("value", `${id}`);
    reviewForm.appendChild(restaurantID);


    // const ratingSelect = document.createElement("select");
    // ratingSelect.setAttribute("id", "ratingSelect");
    // document.body.appendChild(ratingSelect);
    //
    // const selectOption = document.createElement("option");
    // selectOption.setAttribute("value", "1");
    // const selectText = document.createTextNode("1");
    // selectOption.appendChild(selectText);
    // document.getElementById("ratingSelect").appendChild(selectOption);
    //
    // reviewForm.appendChild(ratingSelect);

    // var x = document.createElement("SELECT");
    // x.setAttribute("id", "mySelect");
    // document.body.appendChild(x);
    //
    // var z = document.createElement("option");
    // z.setAttribute("value", "volvocar");
    // var t = document.createTextNode("Volvo");
    // z.appendChild(t);
    // document.getElementById("mySelect").appendChild(z);
    //
    // reviewForm.appendChild(x);


    const name = document.createElement('input'); // Create Input Field for Name
    name.setAttribute("type", "text");
    name.setAttribute("name", "name");
    reviewForm.appendChild(name);

    const comments = document.createElement('textarea');
    comments.setAttribute("name", "comments");
    reviewForm.appendChild(comments);

    const submit = document.createElement('input'); // Append Submit Button
    submit.setAttribute("type", "submit");
    submit.setAttribute("name", "dsubmit");
    submit.setAttribute("value", "Submit");
    reviewForm.appendChild(submit);


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
