const rp = require('request-promise');
const util = require('util');

const config = {
    apiKey: '56cbd399e334616a2bb4',
    tsCode: 'fdb21',
    locale: 'en', //Default locale for Wego
    url: 'http://api.wego.com/hotels/api',
    flightURL: 'http://api.wego.com/flights/api/k/2/',
    airlineLogo: 'http://0.omg.io/wego/image/upload/c_fit,w_200,h_70/flights/airlines_rectangular/',
    airportCodeURL: (locale, query) => `https://srv.wego.com/places/search?query=${query}&language=${locale}&min_airports=1`,
    autocompleteURL: 'http://www.wego.co.in/%s/hotels/api/autocomplete/locations/%s.js',
    //autocompleteURL : 'https://www.wego.co.in/en/flights/api/autocomplete/16/locations/6/%s.js',
    headers: {
        'cache-control': 'no-cache',
        'accept': 'application/json',
        'content-type': 'application/json'
    }
};

const locationSearch = (name) => {
    var optionsLocationSearch = {
        method: 'GET',
        url: config.url + '/locations/search',
        qs: {
            q: name,
            api_key: config.apiKey,
            ts_code: config.tsCode
        },
        headers: config.headers
    };
    return rp(optionsLocationSearch).then(data => Promise.resolve(JSON.parse(data)));
}

const getSearchId = (params) => {
    var optionsGetSearch = {
        method: 'GET',
        url: config.url + '/search/new',
        qs: {
            location_id: params.locationId,
            check_in: params.checkIn,
            check_out: params.checkOut,
            rooms: params.rooms || 1,
            guests: params.guests || 1,
            user_ip: 'direct',
            api_key: config.apiKey,
            ts_code: config.tsCode
        },
        headers: config.headers
    };

    return rp(optionsGetSearch).then(data => Promise.resolve({
        "searchId": JSON.parse(data)["search_id"]
    }));
}

const getSearchResults = (params) => {
    console.log('in getSearchResults::::::::::::::::::::::::::',params);
    var optionsHotelDetails = {
        method: 'GET',
        url: config.url + '/search/' + params.searchId,
        qs: {
            api_key: config.apiKey,
            ts_code: config.tsCode,
            sort: (params.sort) ? 'stars[]=' + params.sort.star : 'stars',
            order: 'desc',
            text_filter: params.textFilter || '',
            locale: params.locale || config.locale
        },
        headers: config.headers
    };

    return rp(optionsHotelDetails).then(data => {
        var result = JSON.parse(data);
        result.searchId = params.searchId;
        return Promise.resolve(result)
    });
}

const getHotelDetails = (params) => {
    var optionsSearchResults = {
        method: 'GET',
        url: config.url + '/search/show/' + params.searchId,
        qs: {
            hotel_id: params.hotelId,
            api_key: config.apiKey,
            ts_code: config.tsCode,
            locale: params.locale || config.locale
        },
        headers: config.headers
    };

    return rp(optionsSearchResults).then(data => Promise.resolve(JSON.parse(data)));

}

const getRedirect = (params) => {
    var optionsSpecificHotelDetails = {
        method: 'GET',
        url: config.url + '/search/redirect/' + params.searchId,
        qs: {
            hotel_id: params.hotelId,
            room_rate_id: params.roomRateId,
            api_key: config.apiKey,
            ts_code: config.tsCode
        },
        headers: config.headers
    };

    return rp(optionsSpecificHotelDetails).then(data => Promise.resolve(JSON.parse(data)));
}

const hotelSearch = (params) => {
    console.log('in commmmmm:::::hotelSearch',params);
    if (params.sort) {
        var sort = params.sort;
    }
    
    return getSearchId(params).then(searchId => {
        return new Promise((resolve, reject) => {
            return setTimeout(() => {
                searchId.locale = params.locale || config.locale;
                if (params.sort) {
                    searchId.sort = sort;
                }
                resolve(searchId);
            }, 11000);
        });
    }).then(searchId => getSearchResults(searchId)).then(searchResults => Promise.resolve(searchResults));
};

const autocomplete = (cityName, locale) => {
    locale = locale || config.locale;
    if(locale === 'en') {
        cityName = cityName.toString().trim().replace(/(,\s|\s|,|\s,|\s,\s)/g,'_');
    } else {
        cityName = encodeURIComponent(cityName);
    }
    const autoCompleteParams = {
        method: 'GET',
        url: util.format(config.autocompleteURL, locale || config.locale, cityName),
        headers: config.headers
    };

    return rp(autoCompleteParams)
        .then(data => {
            // const jsonData = JSON.parse(data)["r"];
            // if(jsonData.length > 0){
            //     return Promise.resolve(JSON.parse(data)['r']);
            if(JSON.parse(data)[0].n !== 'No matching locations'){
                return Promise.resolve(JSON.parse(data));
            } else {
                return Promise.resolve(null);
            }
        });
};

module.exports = {
    locationSearch: locationSearch,
    hotelSearch: hotelSearch,
    getSearchResults: getSearchResults,
    getHotelDetails: getHotelDetails,
    getRedirect: getRedirect,
    autocomplete : autocomplete
};