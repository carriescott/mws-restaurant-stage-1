const dbPromise = idb.open('restaurant-details', 1, upgradeDB => {
    upgradeDB.createObjectStore('restaurants');
});

/**
 * Common database helper functions.
 */

class DBHelper {

    /**
     * Database URL.
     * Change this to restaurants.json file location on your server.
     */

    static getFromIDB(key){
        return dbPromise.then(db => {
            return db.transaction('restaurants')
                .objectStore('restaurants').get(key);
        });
    }

    static addToIDB(key, val) {
        return dbPromise.then(db => {
            const tx = db.transaction('restaurants', 'readwrite');
        tx.objectStore('restaurants').put(val, key);
        console.log('finished adding data');
        return tx.complete;
        });
    }

    static get DATABASE_URL() {
        const port = 1337; // Change this to your server port
        return `http://localhost:${port}/restaurants`;
    }

    /**
     * Fetch all restaurants from the database and store it in an idb.
     */

    static fetchRestaurants(callback) {

        fetch(DBHelper.DATABASE_URL)

            .then(function(response) {
                console.log('response', response);
                // Read the response as json.
                return response.json();
            })
            .then(function(responseAsJson) {
                const restaurants = responseAsJson;
                console.log('restaurants', restaurants);
                callback(null, restaurants);
                //Add data to indexedBD
                DBHelper.addToIDB('restaurant', restaurants);
            })
            .catch(function(error) {
                var IDB = DBHelper.getFromIDB('restaurant');
                console.log('Looks like there was a problem: \n', error);
                IDB.then(function(result) {
                    const myRestaurant = result;
                    callback(null, myRestaurant);
                    console.log(myRestaurant);
                }, function(err) {
                    console.log(err);
                });

            });
    }

    /**
     * Fetch a restaurant by its ID.
     */
    static fetchRestaurantById(id, callback) {
        // fetch all restaurants with proper error handling.
        DBHelper.fetchRestaurants((error, restaurants) => {
            if (error) {
                callback(error, null);
            } else {
                const restaurant = restaurants.find(r => r.id == id
    )
        ;
        if (restaurant) { // Got the restaurant
            callback(null, restaurant);
        } else { // Restaurant does not exist in the database
            callback('Restaurant does not exist', null);
        }
    }
    })
        ;
    }

    /**
     * Fetch restaurants by a cuisine type with proper error handling.
     */
    static fetchRestaurantByCuisine(cuisine, callback) {
        // Fetch all restaurants  with proper error handling
        DBHelper.fetchRestaurants((error, restaurants) => {
            if (error) {
                callback(error, null);
            } else {
                // Filter restaurants to have only given cuisine type
                const results = restaurants.filter(r => r.cuisine_type == cuisine
    )
        ;
        callback(null, results);
    }
    })
        ;
    }

    /**
     * Fetch restaurants by a neighborhood with proper error handling.
     */
    static fetchRestaurantByNeighborhood(neighborhood, callback) {
        // Fetch all restaurants
        DBHelper.fetchRestaurants((error, restaurants) => {
            if (error) {
                callback(error, null);
            } else {
                // Filter restaurants to have only given neighborhood
                const results = restaurants.filter(r => r.neighborhood == neighborhood
    )
        ;
        callback(null, results);
    }
    })
        ;
    }

    /**
     * Fetch restaurants by a cuisine and a neighborhood with proper error handling.
     */
    static fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, callback) {
        // Fetch all restaurants
        DBHelper.fetchRestaurants((error, restaurants) => {
            if (error) {
                callback(error, null);
            } else {
                let results = restaurants
                if (cuisine != 'all'
    )
        { // filter by cuisine
            results = results.filter(r => r.cuisine_type == cuisine
        )
            ;
        }
        if (neighborhood != 'all') { // filter by neighborhood
            results = results.filter(r => r.neighborhood == neighborhood
        )
            ;
        }
        callback(null, results);
    }
    })
        ;
    }

    /**
     * Fetch all neighborhoods with proper error handling.
     */
    static fetchNeighborhoods(callback) {
        // Fetch all restaurants
        DBHelper.fetchRestaurants((error, restaurants) => {
            if (error) {
                callback(error, null);
            } else {
                // Get all neighborhoods from all restaurants
                const neighborhoods = restaurants.map((v, i) => restaurants[i].neighborhood)
        // Remove duplicates from neighborhoods
        const uniqueNeighborhoods = neighborhoods.filter((v, i) => neighborhoods.indexOf(v) == i
    )
        callback(null, uniqueNeighborhoods);
    }
    })
        ;
    }

    /**
     * Fetch all cuisines with proper error handling.
     */
    static fetchCuisines(callback) {
        // Fetch all restaurants
        DBHelper.fetchRestaurants((error, restaurants) => {
            if (error) {
                callback(error, null);
            } else {
                // Get all cuisines from all restaurants
                const cuisines = restaurants.map((v, i) => restaurants[i].cuisine_type
    )
        // Remove duplicates from cuisines
        const uniqueCuisines = cuisines.filter((v, i) => cuisines.indexOf(v) == i
    )
        callback(null, uniqueCuisines);
    }
    })
        ;
    }

    /**
     * Restaurant page URL.
     */
    static urlForRestaurant(restaurant) {
        return (`./restaurant.html?id=${restaurant.id}`);
    }

    /**
     * Restaurant image URL.
     */
    static imageUrlForRestaurant(restaurant) {
        console.log('imageUrlForRestaurant', restaurant);
        console.log('restaurantPhoto', restaurant.photograph);

        if (restaurant.photograph === undefined) {
            return (`/img/default.jpg`);
        } else {
            return (`/img/${restaurant.photograph}.jpg`);
        }
    }

    /**
     * Restaurant image srcset.
     */
    static imageSrcsetForRestaurant(restaurant) {

        if (restaurant.photograph === undefined){
            return (`/img/responsive/800w/default.jpg 800w, /img/responsive/480w/default.jpg 480w, /img/responsive/360w/default.jpg 360w`);
        } else {
            return (`/img/responsive/800w/${restaurant.photograph}.jpg 800w, /img/responsive/480w/${restaurant.photograph}.jpg 480w, /img/responsive/360w/${restaurant.photograph}.jpg 360w`);
        }
    }

    /**
     * Map marker for a restaurant.
     */
    static mapMarkerForRestaurant(restaurant, map) {
        const marker = new google.maps.Marker({
                position: restaurant.latlng,
                title: restaurant.name,
                url: DBHelper.urlForRestaurant(restaurant),
                map: map,
                animation: google.maps.Animation.DROP
            }
        );
        return marker;
    }
    
    /**
     * Set Favorite Status
     */

    static setFavoriteStatus(id, status) {
                console.log('set id', id);
                console.log('set status', status);
                fetch(`http://localhost:1337/restaurants/${id}/?is_favorite=${status}`, {method: 'PUT'})
            }
}

