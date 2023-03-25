import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce';
import { fetchCountries } from './js/fetchContries';

const DEBOUNCE_DELAY = 300;

const listCountry = document.querySelector('.country-list');
const infoCountry = document.querySelector('.country-info');
const boxSearch = document.querySelector('#search-box');

boxSearch.addEventListener('input', debounce(onInputSearch, DEBOUNCE_DELAY));

function onInputSearch(event) {
    event.preventDefault();
    
    boxSearch.style.color = 'black';
    
    const searchCountries = event.target.value.trim();
    
    if (!searchCountries) {
        listCountry.style.visibility = "hidden";
        infoCountry.style.visibility = "hidden";
        listCountry.innerHTML = '';
        infoCountry.innerHTML = '';
    return;
    }
    
    fetchCountries(searchCountries)
    .then(result => {
        if (result.length > 10) {
            Notify.info('Too many matches found. Please, enter a more specific name.');
            return;
        }
        renderedCountries(result);
    })
        .catch(error => {
            listCountry.innerHTML = '';
            infoCountry.innerHTML = '';
            boxSearch.style.color = 'tomato';
            Notify.failure('Oops, there is no country with that name');
        })
};
    
function renderedCountries(result) {
    const inputLetters = result.length;
    
    if (inputLetters === 1) {
        listCountry.innerHTML = '';
        listCountry.style.visibility = "hidden";
        infoCountry.style.visibility = "visible";
        countryCardMarkup(result);
    }
    
    if (inputLetters > 1 && inputLetters <= 10) {
        infoCountry.innerHTML = '';
        infoCountry.style.visibility = "hidden";
        listCountry.style.visibility = "visible";
        countriesListMarkup(result);
    }
}
    
function countriesListMarkup(result) {
    const listMarkup = result.map((({ name, flags }) => {
        return  `<li>
            <img src="${flags.svg}" alt="${name}" width="60" height="auto">
            <span>${name.official}</span>
            </li>`;
    })).join('');
    listCountry.innerHTML = listMarkup;
    return listMarkup;
}
    
function countryCardMarkup(result) {
    const cardMarkup = result.map(({ flags, name, capital, population, languages }) => {
        languages = Object.values(languages).join(", ");
        return  `<img src="${flags.svg}" alt="${name}" width="320" height="auto">
            <p> ${name.official}</p>
            <p>Capital: <span> ${capital}</span></p>
            <p>Population: <span> ${population}</span></p>
            <p>Languages: <span> ${languages}</span></p>`;
    }).join('');
    infoCountry.innerHTML = cardMarkup;
    return cardMarkup;
}
