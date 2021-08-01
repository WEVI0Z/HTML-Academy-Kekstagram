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

var decscriptionList = [
    "Тестим новую камеру!",
    "Затусили с друзьями на море",
    "Как же круто тут кормят",
    "Отдыхаем...",
    "Цените каждое мгновенье. Цените тех, кто рядом с вами",
    "и отгоняйте все сомненья. Не обижайте всех словами......",
    "Вот это тачка!"
];

var picturesData = [];

for(var i = 0; i < photosNumber; i++) {
    var randomComments = [];
    var randomName = names[getRandomNumber(0, names.length - 1)];
    var randomNumberForCycle = getRandomNumber(2, 10);
    var randomDescription = decscriptionList[getRandomNumber(0, decscriptionList.length - 1)]
    for(var j = 0; j < randomNumberForCycle; j++) {
        randomComments[j] = commentsText[getRandomNumber(0, commentsText.length - 1)];
    }
    var urlOfTheImage = i + 1;
    picturesData[i] = {
        url: "../photos/" + urlOfTheImage + ".jpg",
        likes: getRandomNumber(15, 200),
        comments: randomComments,
        name: randomName,
        description: randomDescription
    };
}

console.log(picturesData);

// Генерация DOM-элементов на основе данных из массива



// Другие полезные функции
function getRandomNumber(minNumber, maxNumber) {
    var min = Math.ceil(minNumber);
    var max = Math.floor(maxNumber);
    return Math.floor(Math.random() * (max - min)) + min;
}

// const userPictures = [];
// const picturesFragment = document.createDocumentFragment();
// const pictureWrap = document.querySelector('.pictures');

// function drawPictures() {
//     function getImg(url) {
//         const img = document.createElement('img');
//         img.classList.add('picture__img');

//         img.src = url;
//     }
//     function getParagraph() {}

//     picturesData.forEach(function(itPicture) {
//         const picture = document.createElement('a');
        
//         const p = document.createElement('p');

//         const likes = document.createElement('span');
//         const comments = document.createElement('span');

//         picture.classList.add('picture');
//         p.classList.add('picture__info');
//         likes.classList.add('picture__likes');
//         comments.classList.add('picture__comments');

//         likes.innerHTML = itPicture.likes;
//         comments.innerHTML = itPicture.comments.length;

//         p.appendChild(likes);
//         p.appendChild(comments);

//         picture.appendChild(getImg(itPicture.url));
//         picture.appendChild(getParagraph());
//         picturesFragment.appendChild(picture);


//         userPictures[i] = picture;

//     });

//     for(let i = 0; i < picturesData.length; i++){
//             }

//     pictureWrap.appendChild(picturesFragment);
//     console.log(userPictures);
// }

var userPictures = [];
var picturesFragment = document.createDocumentFragment();
var pictureWrap = document.querySelector('.pictures');

function drawPictures() {
    var template = document.getElementById('picture');
    var templateContent = template.content.querySelector('.picture');
    
    function getImg(src, alt) {
        var img = template.content.querySelector('.picture__img').cloneNode();

        img.src = src;
        img.alt = alt;

        return img;
    }

    function getParagraph(commentsNumber, likesNumber){
        var p = template.content.querySelector('.picture__info').cloneNode();
        var commentsSpan = template.content.querySelector('.picture__comments').cloneNode();
        var likesSpan = template.content.querySelector('.picture__likes').cloneNode();

        commentsSpan.innerHTML = commentsNumber;
        likesSpan.innerHTML = likesNumber;

        p.appendChild(commentsSpan);
        p.appendChild(likesSpan);

        return p;
    }
    
    picturesData.forEach(function(itPicture) {
        var newPicture = templateContent.cloneNode();

        newPicture.appendChild(getImg(itPicture.url, itPicture.description));
        newPicture.appendChild(getParagraph(itPicture.likes, itPicture.comments.length));

        picturesFragment.appendChild(newPicture);
    });

    pictureWrap.appendChild(picturesFragment);
}

drawPictures();