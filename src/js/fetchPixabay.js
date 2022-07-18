import axios from 'axios';

export class PixabayAPI {
  #API_KEY = '28534250-bbba7677f72b19e29ec2a8926';
  #BASE_URL = `https://pixabay.com/api/`;
  #OPT = new URLSearchParams({
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
  });
  #page;
  #perPage;
  #searchQuery;
  #total;
  #limit;

  constructor() {
    this.#page = 1;
    this.#perPage = 40;
    this.#searchQuery = '';
    this.#total = 0;
    this.#limit = 0;
  }

  async getPictures() {
    try {
      const url = `${this.#BASE_URL}?key=${
        this.#API_KEY
      }&q=${encodeURIComponent(`${this.#searchQuery}`)}&${this.#OPT}&page=${
        this.#page
      }&per_page=${this.#perPage}`;
      console.log(url);

      const response = await axios.get(url);
      return response;
    } catch (error) {
      console.error(error);
    }
  }

  get query() {
    return this.#searchQuery;
  }

  set query(newQuery) {
    this.#searchQuery = newQuery;
  }

  get page() {
    return this.#page;
  }

  get perPage() {
    return this.#perPage;
  }

  get total() {
    return this.#total;
  }

  set total(newTotal) {
    this.#total = newTotal;
  }

  incrementPage() {
    this.#page += 1;
  }

  resetPage() {
    this.#page = 1;
  }

  hasMoreContent() {
    this.#limit = this.#total / this.#perPage;
    const limit = Math.ceil(this.#limit);
    return limit > this.#page;
  }
}
