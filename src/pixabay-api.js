import axios from 'axios';
const BASE_KEY = '38629837-4b093c7ad7251561bb866f5c2';
const BASE_URL = 'https://pixabay.com/api/';

export function requestToTheServer(request,value) {
    const options = {
      params: {
        key: BASE_KEY,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page: value,
        per_page: 40,
        q: request,
      },
    }

    return axios.get(
      `${BASE_URL}`, options
    ).then(response => response.data)
}
