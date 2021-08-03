'use strict';

const popupWrapper = document.querySelector('#popup');
const popupCloseButton = document.querySelector('#btnClosePopup');
const btnBonusForm = document.getElementById('btnBonusForm');
const linkBonusTerms = document.querySelector('#linkBonusTerms');

function openPopup() {
  popupWrapper.style.display = 'block';
}

function closePopup() {
  popupWrapper.style.display = 'none';
}

btnBonusForm.addEventListener("click", openPopup);
linkBonusTerms.addEventListener('click', openPopup);

popupCloseButton.addEventListener('click', closePopup);
popupWrapper.addEventListener('click', function(event) {
  if (event.target == popupWrapper) {
    closePopup();
  }
});

