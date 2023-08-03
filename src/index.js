import Notiflix from 'notiflix';
import Counter from './counter';
const counterPage = new Counter();
import { requestToTheServer } from './pixabay-api';


const refs = {
  form: document.querySelector('#search-form'),
  gallery: document.querySelector('.gallery'),
  btnMore: document.querySelector('.load-more'),
};
hidden(refs.btnMore)

refs.form.addEventListener('submit', onSubmitForm);

async function onSubmitForm(e) {
   e.preventDefault();
    clearGallery();
    hidden(refs.btnMore);
   counterPage.request = e.currentTarget.elements.searchQuery.value;
   counterPage.cValue = 1;
    const response = await requestToTheServer(
      counterPage.request,
      counterPage.cValue
    );
    if (response.hits.length > 0) {
        counterPage.increment();
        refs.gallery.insertAdjacentHTML('beforeend', addGalleryCards(response.hits));
        rmHidden(refs.btnMore)
        Notiflix.Notify.success(
          `✅ Hooray! We found ${response.totalHits} images.`
        );
        return
    }
    Notiflix.Notify.failure(
      `❌ Sorry, there are no images matching your search query. Please try again.`
    );
};

refs.btnMore.addEventListener('click', onClickBtnMore);

async function onClickBtnMore() {
    const response = await requestToTheServer(
      counterPage.request,
      counterPage.cValue
    );
    if (response.hits.length > 0) {
       counterPage.increment();
       refs.gallery.insertAdjacentHTML('beforeend', addGalleryCards(response.hits));
       rmHidden(refs.btnMore);
       return;
    }
    hidden(refs.btnMore)
    Notiflix.Notify.info(
      ` ❕ We're sorry, but you've reached the end of search results.`
    );
}


function hidden(el){
    el.classList.add('hidden')
}

function rmHidden(el){
    el.classList.remove('hidden')
}

function clearGallery() {
    refs.gallery.innerHTML = '';
}

function addGalleryCards(response) {
    return response.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) =>
     `<div class="photo-card">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes :</b>${likes}
    </p>
    <p class="info-item">
      <b>Views :</b>${views}
    </p>
    <p class="info-item">
      <b>Comments :</b>${comments}
    </p>
    <p class="info-item">
      <b>Downloads :</b>${downloads}
    </p>
  </div>
</div>`).join('')
}





