'use strict';

const inputElement = document.querySelector('.js-input');
const buttonElement = document.querySelector('.js-button');
const moviesContainer = document.querySelector('.js-show-container');
const formElement = document.querySelector('.js-form');
const favoriteContainer = document.querySelector('.js-favorite-container');

let resultMovies = [];
let favoriteMovies = [];

//get data from api

function searchMovies() {
  const userInput = inputElement.value.toUpperCase();
  fetch(
    'https://api.themoviedb.org/3/search/movie?api_key=a080d9fc2acc9d5bcc1ed3c2ce071049&query=' +
      userInput
  )
    .then((response) => response.json())
    .then((data) => {
      resultMovies = data.results;
      paintMovies();
    });
}

//paint search result

function paintMovies() {
  let htmlCode = '';
  for (const movies of resultMovies) {
    const movieID = movies.id;
    const movieName = movies.title.toUpperCase().substring(0, 50);
    const movieDescription = movies.overview.substring(0, 200) + '...';
    const movieImage = movies.poster_path;
    let isFavoriteClass;
    if (isFavoriteMovie(movies)) {
      isFavoriteClass = 'container__list--favorite';
    } else {
      isFavoriteClass = '';
    }
    htmlCode += `<li class="container__list js-container ${isFavoriteClass}" id="${movieID}">`;
    let source;
    if (movieImage === null) {
      source = 'https://via.placeholder.com/210x295/ffffff/666666/?text=Peli';
    } else {
      source =
        'https://www.themoviedb.org/t/p/w600_and_h900_bestv2/' + movieImage;
    }
    htmlCode += `<img class="container__list--image" src="${source}" alt="poster of pelis" />`;
    htmlCode += `<h2 class="container__list--title ${isFavoriteClass}">${movieName}</h2>`;
    htmlCode += `<h3 class="container__list--description ${isFavoriteClass}">${movieDescription}</h3>`;
    htmlCode += '</li>';
  }
  moviesContainer.innerHTML = htmlCode;
  listenContainerElement();
}

//favorite movies

function isFavoriteMovie(movies) {
  const favoriteFound = favoriteMovies.find(function (favoriteMovie) {
    return favoriteMovie.id === movies.id;
  });
  if (favoriteFound === undefined) {
    return false;
  } else {
    return true;
  }
}

buttonElement.addEventListener('click', searchMovies);

//listen containerElements

function listenContainerElement() {
  //listen click container div, listen to events after they have been created (after innerHTML)
  const containerElements = document.querySelectorAll('.js-container');
  //to every containerElement add addEventListener
  for (const containerElement of containerElements) {
    containerElement.addEventListener('click', handleMovie);
  }
}

function handleMovie(ev) {
  const clickedmovieID = parseInt(ev.currentTarget.id);
  const favoritesFound = favoriteMovies.find(function (favoriteMovie) {
    const favoritemovieID = favoriteMovie.id;
    return favoritemovieID === clickedmovieID;
  });
  if (favoritesFound === undefined) {
    const movieFound = resultMovies.find(function (movies) {
      const movieID = movies.id;
      return movieID === clickedmovieID;
    });
    favoriteMovies.push(movieFound);
    console.log(favoriteMovies);
  } else {
    //splice
    const favFoundIndex = favoriteMovies.findIndex(function (favoriteMovie) {
      const favoritemovieID = favoriteMovie.id;
      return favoritemovieID === clickedmovieID;
    });
    favoriteMovies.splice(favFoundIndex, 1);
  }
  paintMovies();
  paintfavorites();
}

//paint favorite series

function paintfavorites() {
  let htmlCode = '';

  let topFive = favoriteMovies.slice(Math.max(favoriteMovies.length - 5, 1));

  for (const favoriteMovie of topFive) {
    const favmovieName = favoriteMovie.title.substring(0, 25);
    const favmovieImage = favoriteMovie.poster_path;
    const favmovieID = favoriteMovie.id;
    const favmovieDescription =
      favoriteMovie.overview.substring(0, 200) + '...';
    htmlCode += `<li class="favorites__list">`;
    let source;
    if (favmovieImage === null) {
      source = 'https://via.placeholder.com/210x295/ffffff/666666/?text=Peli';
    } else {
      source =
        'https://www.themoviedb.org/t/p/w600_and_h900_bestv2/' + favmovieImage;
    }
    htmlCode += `<img class="favorites__list--image" src="${source}" alt="poster of favorite pelis"/>`;
    htmlCode += `<h4 class="favorites__list--title">${favmovieName}</h4>`;
    htmlCode += '</li>';
    htmlCode += `<div class="favorites__list--x js-x" id="${favmovieID}">x`;
    htmlCode += `</div>`;
  }
  favoriteContainer.innerHTML = htmlCode;
  storeLocalStorage();
  listenContainerElementX();
}

//submit form

function handleForm(ev) {
  ev.preventDefault();
}

formElement.addEventListener('submit', handleForm);

//local storage

function storeLocalStorage() {
  const stringfavoriteMovies = JSON.stringify(favoriteMovies);
  localStorage.setItem('favoriteMoviesSaved', stringfavoriteMovies);
}

function getLocalStorageMovies() {
  const localStorageMovies = localStorage.getItem('favoriteMoviesSaved');
  if (localStorageMovies !== null) {
    const arrayMovies = JSON.parse(localStorageMovies);
    favoriteMovies = arrayMovies;
    paintfavorites();
  }
}

getLocalStorageMovies();

//reset all

const resetButton = document.querySelector('.js-reset-button');

function resetAll() {
  localStorage.removeItem('favoriteMoviesSaved');
  favoriteMovies = [];
  paintfavorites();
  paintMovies();
}

resetButton.addEventListener('click', resetAll);

// click x

function handleX(ev) {
  const xfavoriteElementId = parseInt(ev.currentTarget.id);
  const favoriteX = favoriteMovies.findIndex(function (favoriteMovie) {
    const favoritemovieID = favoriteMovie.id;
    return favoritemovieID === xfavoriteElementId;
  });
  if (favoriteX !== -1) {
    //splice
    favoriteMovies.splice(favoriteX, 1);
    paintfavorites();
    paintMovies();
  }
}

function listenContainerElementX() {
  const xElements = document.querySelectorAll('.js-x');
  for (const xElement of xElements) {
    xElement.addEventListener('click', handleX);
  }
}
