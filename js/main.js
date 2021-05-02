'use strict'


//Генерация случайного массива данных
var photosNumber = 25;
var commentsText = [
    "Всё отлично!",
    "В целом все неплохо. Но не всё.",
    "Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.",
    "Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.",
    "Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.",
    "Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!"
];
var names = [
    "Vlad",
    "Vadim",
    "Arthur",
    "Nikita",
    "Valeria",
    "Alena",
    "Valya",
    "Sveta",
    "Artyem",
    "Amina",
    "Anton",
    "David",
    "Alex",
    "Alexander",
    "Evgeniy",
    "Yana",
    "Arseniy",
    "Elizaveta",
    "Maksim",
    "Kristina",
    "Yarik",
    "Alina",
    "Roman"
];

var photos = [];

for(var i = 0; i < photosNumber; i++) {
    var randomComments = [];
    var randomName = names[getRandomNumber(0, names.length - 1)];
    for(var j = 0; j < getRandomNumber(2, 10); j++) {
        randomComments[j] = commentsText[getRandomNumber(0, commentsText.length - 1)];
    }
    var urlOfTheImage = i + 1;
    photos[i] = {
        url: "photos/" + urlOfTheImage + ".jpg",
        likes: getRandomNumber(15, 200),
        comments: randomComments,
        name: randomName
    };
}

console.log(photos);

// Генерация DOM-элементов на основе данных из массива



// Другие полезные функции
function getRandomNumber(minNumber, maxNumber) {
    var min = Math.ceil(minNumber);
    var max = Math.floor(maxNumber);
    return Math.floor(Math.random() * (max - min)) + min;
}