export const getRefs = () => {
  return {
    form: document.querySelector('#search-form'),
    galleryEl: document.querySelector('.gallery'),
    loadMoreBtn: document.querySelector('.load-more'),
    endNote: document.querySelector('.end-of-content'),
  };
};
