import './style.css';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { getRefs } from './js/getRefs';
import { PixabayAPI } from './js/fetchPixabay';
import { galleryMarkup } from './js/cardsMarkup';
import { Notify } from 'notiflix';
import SimpleLightbox from 'simplelightbox';

const pixabayApi = new PixabayAPI();
const refs = getRefs();
const lightbox = new SimpleLightbox('.gallery a');

refs.form.addEventListener('submit', onSubmit);

async function onSubmit(event) {
  event.preventDefault();
  const searchQuery = refs.form.searchQuery.value.trim();

  if (searchQuery) {
    pixabayApi.query = searchQuery;
    pixabayApi.resetPage();
    refs.endNote.classList.remove('active');
    const response = await pixabayApi.getPictures();
    pixabayApi.total = response.data.total;

    if (!pixabayApi.total) {
      refs.galleryEl.innerHTML = '';
      refs.loadMoreBtn.classList.remove('active');
      refs.loadMoreBtn.removeEventListener('click', onLoadMore);
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }

    const pictureSet = response.data.hits;
    Notify.success(`Hooray! We found ${response.data.total} images.`);
    const markup = galleryMarkup(pictureSet);
    refs.galleryEl.innerHTML = markup;
    lightbox.refresh();

    if (!pixabayApi.hasMoreContent()) {
      endOfContent();
    } else {
      refs.loadMoreBtn.classList.add('active');
      refs.loadMoreBtn.addEventListener('click', onLoadMore);
    }
  } else {
    Notify.warning('Please enter your search query.');
  }
}

async function onLoadMore() {
  pixabayApi.incrementPage();
  const response = await pixabayApi.getPictures();
  const pictureSet = response.data.hits;
  const markup = galleryMarkup(pictureSet);
  refs.galleryEl.insertAdjacentHTML('beforeend', markup);
  lightbox.refresh();
  addSmoothScroll();

  if (!pixabayApi.hasMoreContent()) {
    endOfContent();
  }
}

function endOfContent() {
  refs.loadMoreBtn.classList.remove('active');
  refs.loadMoreBtn.removeEventListener('click', onLoadMore);
  refs.endNote.classList.add('active');
  return;
}

function addSmoothScroll() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
