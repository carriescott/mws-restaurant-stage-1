
let restaurant;

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
        return tx.complete;
        });
    }



    // static functionTwo(callback) {
    //     const idbKeyval = {
    //         get(key) {
    //             return dbPromise.then(db => {
    //                 return db.transaction('restaurants')
    //                     .objectStore('restaurants').get(key);
    //         });
    //         },
    //         set(key, val) {
    //             return dbPromise.then(db => {
    //                 const tx = db.transaction('restaurants', 'readwrite');
    //             tx.objectStore('restaurants').put(val, key);
    //             return tx.complete;
    //         });
    //         },
    //         delete(key) {
    //             return dbPromise.then(db => {
    //                 const tx = db.transaction('restaurants', 'readwrite');
    //             tx.objectStore('restaurants').delete(key);
    //             return tx.complete;
    //         });
    //         },
    //         clear() {
    //             return dbPromise.then(db => {
    //                 const tx = db.transaction('restaurants', 'readwrite');
    //             tx.objectStore('restaurants').clear();
    //             return tx.complete;
    //         });
    //         },
    //         keys() {
    //             return dbPromise.then(db => {
    //                 const tx = db.transaction('restaurants');
    //             const keys = [];
    //             const store = tx.objectStore('restaurants');
    //
    //             // This would be store.getAllKeys(), but it isn't supported by Edge or Safari.
    //             // openKeyCursor isn't supported by Safari, so we fall back
    //             (store.iterateKeyCursor || store.iterateCursor).call(store, cursor => {
    //                 if (!cursor) return;
    //             keys.push(cursor.key);
    //             cursor.continue();
    //         });
    //
    //             return tx.complete.then(() => keys);
    //         });
    //         }
    //     };
    // }







    // static get DATABASE_URL() {
    //     const port = 8000 // Change this to your server port
    //     return `http://localhost:${port}/data/restaurants.json`;
    // }

    static get DATABASE_URL() {
        const port = 1337; // Change this to your server port
        return `http://localhost:${port}/restaurants`;
    }

    // Full Request Start

    // function handleSuccess () {
    // console.log( this.responseText );
    // // the HTML of https://unsplash.com/
    // }

    // Parse the JSON file
    // function handleSuccess () {
    //     const data = JSON.parse( this.responseText ); // convert data from JSON to a JavaScript object
    //     console.log( data );
    // }


    // function handleError () {
    //     console.log( 'An error occurred \uD83D\uDE1E' );
    // }


    // const asyncRequestObject = new XMLHttpRequest();
    // asyncRequestObject.open('GET', 'http://localhost:1337/restaurants');
    // asyncRequestObject.onload = handleSuccess;
    // asyncRequestObject.onerror = handleError;
    // asyncRequestObject.send();


    // Full Request End

    // let req = new XMLHttpRequest();
    // req.open('GET', DBHelper.DATABASE_URL);
    // req.send();


    // fetch(DATABASE_URL, {
    //     method: 'POST'
    // });
    //
    // fetch('http://localhost:${port}/restaurants');
    //
    // fetch(DATABASE_URL);
    //
    //
    // fetch(`http://localhost:1337/restaurants` {
    // }).then(function(response) {
    // debugger; // work with the returned response
    // });
    //
    //
    //
    // fetch(`http://localhost:1337/restaurants`, {
    //     headers: {
    //         Authorization: 'Client-ID abc123'
    //     }
    // }).then(function(response) {
    //     return response.json();
    // }).then(addImage);
    //
    // function addImage(data) {
    //     debugger;
    // }



    /**
     * Fetch all restaurants from the database and store it in an idb.
     */
    // static fetchRestaurants(callback) {
    //
    //     if (window.indexedDB) {
    //         console.log("IndexedDB is supported.");
    //
    //         DBHelper.fetchRestaurantsFromIDB((error, restaurants) => {
    //             if (error) {
    //                 callback(error, null);
    //             } else {
    //                 const restaurant = restaurants.find(r => r.id == id
    //     )
    //         ;
    //         if (restaurant) { // Got the restaurant
    //             callback(null, restaurant);
    //         } else { // Restaurant does not exist in the database
    //             callback('Restaurant does not exist', null);
    //         }
    //     }
    //     });
    //     } else {
    //         console.log("IndexedDB is not supported.");
    //
    //         DBHelper.fetchRestaurantsFromServer((error, restaurants) => {
    //             if (error) {
    //                 callback(error, null);
    //             } else {
    //                 const restaurant = restaurants.find(r => r.id == id
    //     )
    //         ;
    //         if (restaurant) { // Got the restaurant
    //             callback(null, restaurant);
    //         } else { // Restaurant does not exist in the database
    //             callback('Restaurant does not exist', null);
    //         }
    //     }
    //     });
    //
    //     }
    //
    // }

    static fetchRestaurantsFromIDB(callback) {
        console.log('hello');
        'use strict';

        // If the browser doesn't support service worker,
        // we don't care about having a database
        // if (!navigator.serviceWorker) {
        //     return Promise.resolve();
        // }

        var dbPromise = window.indexedDB.open('restaurants-review-db1', 1, function(upgradeDb) {
            console.log('making a new object store');

            if (!upgradeDb.objectStoreNames.contains('restaurants')) {
                var restaurantReviews = upgradeDb.createObjectStore('restaurants', {
                    keyPath: 'id'
                });

                restaurantReviews.createIndex('by-id', 'id');


                DBHelper.fetchRestaurantsFromServer((error, restaurants) => {
                    if (error) {
                        callback(error, null);
                    } else {
                        const restaurant = restaurants;
                console.log('restaurant', restaurant);
                if (restaurant) { // Got the restaurant
                    callback(null, restaurant);
                } else { // Restaurant does not exist in the database
                    callback('Restaurant does not exist', null);
                }
            }
            });



                //Fetch restaurants from server
                // DBHelper.fetchRestaurantsFromServer((error, restaurants) => {
                //     if (error) {
                //         callback(error, null);
                //     } else {
                //         const restaurant = restaurants;
                //         console.log(restaurant);
                //
                //         if (restaurant) { // Got the restaurant
                //             dbPromise.then(function(db) {
                //                 var tx = db.transaction('restaurants', 'readwrite');
                //                 var store = tx.objectStore('restaurants');
                //                 var item = restaurant;
                //                 store.put(item);
                //                 return tx.complete;
                //             }).then(function() {
                //                 console.log('restaurant item to the store os!');
                //             });
                //             callback(null, restaurant);
                //
                //
                //         } else { // Restaurant does not exist in the database
                //             callback('Restaurant does not exist', null);
                //         }
                //     }
                // });

            }
        });


    }


    static fetchRestaurants(callback) {


        DBHelper.addToIDB('foo', {Hello: 'World'});
        var test = DBHelper.getFromIDB('foo');
        test.then(function(result) {
            restaurant = result;
            console.log(restaurant); // "Stuff worked!"
        }, function(err) {
            console.log(err); // Error: "It broke"
        });


        let xhr = new XMLHttpRequest();
        xhr.open('GET', DBHelper.DATABASE_URL);
        xhr.onload = () =>
        {
            if (xhr.status === 200) { // Got a success response from server!
                const json = JSON.parse(xhr.responseText);
                // console.log(json);
                const restaurants = json;

                //add restaurants to indexedDB
                DBHelper.addToIDB('restaurants', restaurants);




                callback(null, restaurants);
            } else { // Oops!. Got an error from server.
                const error = (`Request failed. Returned status of ${xhr.status}`);
                callback(error, null);
            }
        };
        xhr.send();
    }


    static fetchRestaurantsFromServer(callback) {
        let xhr = new XMLHttpRequest();
        xhr.open('GET', DBHelper.DATABASE_URL);
        xhr.onload = () =>
        {
            if (xhr.status === 200) { // Got a success response from server!
                const json = JSON.parse(xhr.responseText);
                console.log(json);
                const restaurants = json;
                callback(null, restaurants);
            } else { // Oops!. Got an error from server.
                const error = (`Request failed. Returned status of ${xhr.status}`);
                callback(error, null);
            }
        };
        xhr.send();
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
        console.log('restaurant', restaurant);
        return (`./restaurant.html?id=${restaurant.id}`);
    }

    /**
     * Restaurant image URL.
     */
    static imageUrlForRestaurant(restaurant) {
        console.log('restaurant photograph', restaurant.photograph);
        return (`/img/${restaurant.photograph}.jpg`);
    }

    /**
     * Restaurant image srcset.
     */
    static imageSrcsetForRestaurant(restaurant) {
        return (`/img/responsive/800w/${restaurant.photograph}.jpg 800w, /img/responsive/480w/${restaurant.photograph}.jpg 480w, /img/responsive/360w/${restaurant.photograph}.jpg 360w`);
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

}

