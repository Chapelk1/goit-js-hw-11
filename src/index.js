import Notiflix from 'notiflix';
import Counter from './counter';
const dataStorage = new Counter();
import { requestToTheServer } from './pixabay-api';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
const lightbox = new SimpleLightbox('.gallery a');
const refs = {
  form: document.querySelector('#search-form'),
  gallery: document.querySelector('.gallery'),
  btnMore: document.querySelector('.load-more'),
  btnUp: document.querySelector('.up'),
};
hidden(refs.btnMore);
hidden(refs.btnUp);
refs.form.addEventListener('submit', onSubmitForm);

async function onSubmitForm(e) {
  e.preventDefault();
  clearGallery();
  hidden(refs.btnMore);
  basicDataValues();
  const request = e.currentTarget.elements.searchQuery.value;
  if (request) {
    dataStorage.request = request;

    const { arrayOfPhoto, lengthArray, totalHits } = await fetchApiServer();

    if (lengthArray === 0) {
      Notiflix.Notify.failure(
        `❌ Sorry, there are no images matching your search query. Please try again.`
      );
      return;
    }
    updateDataValues(lengthArray);
    contentFilling(arrayOfPhoto);
    Notiflix.Notify.success(`✅ Hooray! We found ${totalHits} images.`);
    lightbox.refresh();
    scrollTop(0.2);
    if (totalHits !== dataStorage.number) {
      rmHidden(refs.btnMore);
    }
    rmHidden(refs.btnUp);
  }
}

refs.btnMore.addEventListener('click', onClickBtnMore);

async function onClickBtnMore() {
  hidden(refs.btnMore);

  const { arrayOfPhoto, lengthArray, totalHits } = await fetchApiServer();

  updateDataValues(lengthArray);
  contentFilling(arrayOfPhoto);
  Notiflix.Notify.success(`✅ Loaded 40 more images.`);
  lightbox.refresh();
  scrollTop(2);
  if (totalHits !== dataStorage.number && dataStorage.number < totalHits) {
      rmHidden(refs.btnMore);
      rmHidden(refs.btnUp);
    return;
  }
  setTimeout(() => {
    Notiflix.Notify.info(
      ` ❕ We're sorry, but you've reached the end of search results.`
    );
  }, 1000);
}

function basicDataValues() {
  dataStorage.number = 0;
  dataStorage.cValue = 1;
}

function contentFilling(arrayOfPhoto) {
  refs.gallery.insertAdjacentHTML('beforeend', addGalleryCards(arrayOfPhoto));
}

function updateDataValues(lengthArray) {
  dataStorage.editNumber(lengthArray);
  dataStorage.increment();
}

async function fetchApiServer() {
  const response = await requestToTheServer(
    dataStorage.request,
    dataStorage.cValue
  );
  const totalHits = response.totalHits;
  const arrayOfPhoto = response.hits;
  const lengthArray = arrayOfPhoto.length;
  return { arrayOfPhoto, lengthArray, totalHits };
}

function hidden(el) {
  el.classList.add('hidden');
}

function rmHidden(el) {
  el.classList.remove('hidden');
}

function clearGallery() {
  refs.gallery.innerHTML = '';
}

function addGalleryCards(response) {
  return response
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) =>
        `<li class="photo-card">
           <a href="${largeImageURL}">
                <div class="tumb">
                    <img src="${webformatURL}" alt="${tags}" loading="lazy" />
                </div>
                <div class="info">
                    <p class="info-item">
                    <b>Likes</b> ${likes}
                    </p>
                    <p class="info-item">
                    <b>Views</b> ${views}
                    </p>
                    <p class="info-item">
                    <b>Comments</b> ${comments}
                    </p>
                    <p class="info-item">
                    <b>Downloads</b> ${downloads}
                    </p>
                </div>
            </a>
        </li>`
    )
    .join('');
}

function scrollTop(el) {
  const { height: cardHeight } =
    refs.gallery.firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * el,
    behavior: 'smooth',
  });
}

refs.btnUp.addEventListener('click', onClickBtnUp);

function onClickBtnUp() {
  window.scrollBy({
    top: -99999999999,
    behavior: 'smooth',
  });
  hidden(refs.btnUp);
}
