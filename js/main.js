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

function getPicturesData() {
    for(var i = 0; i < photosNumber; i++) {
        var randomComments = [];
        var randomName = names[getRandomNumber(0, names.length - 1)];
        var randomNumberForCycle = getRandomNumber(2, 10);
        var randomDescription = decscriptionList[getRandomNumber(0, decscriptionList.length - 1)]
        
        for(var j = 0; j < randomNumberForCycle; j++) {
            randomComments[j] = {
                avatar: "../img/avatar-" + getRandomNumber(1, 6) + ".svg",
                text: commentsText[getRandomNumber(0, commentsText.length - 1)]
            }
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
}

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

        p.appendChild(likesSpan);
        p.appendChild(commentsSpan);

        return p;
    }
    
    picturesData.forEach(function(itPicture) {
        var newPicture = templateContent.cloneNode();

        newPicture.appendChild(getImg(itPicture.url, itPicture.description));
        newPicture.appendChild(getParagraph(itPicture.comments.length, itPicture.likes));
        newPicture.addEventListener('click', function(evt){
            evt.preventDefault();

            showBigPicture(itPicture);
        });

        picturesFragment.appendChild(newPicture);
    });

    pictureWrap.appendChild(picturesFragment);
}

function showBigPicture(pictureData) {
    function constructTheComment(commentData) {
        var li = document.createElement("li");
        var img = document.createElement("img");
        var p = document.createElement("p");

        li.classList.add("social__comment");

        img.classList.add("social__picture");
        img.src = commentData.avatar;
        img.alt = "Аватар комментатора фотографии";
        img.width = 35;
        img.height = 35;

        p.classList.add("social__text");
        p.innerHTML = commentData.text;

        li.appendChild(img);
        li.appendChild(p);

        return li;
    }

    function hide(element) {
        element.classList.add("hidden");
    }

    function show(element) {
        element.classList.remove("hidden");
    }

    function modalOpen() {
        document.querySelector("body").classList.add("modalOpen");
    }

    function modalClose() {
        document.querySelector("body").classList.remove("modalOpen");
    }

    function cleanBlock(block) {
        block.innerHTML = "";
    }
    
    var bigPicture = document.querySelector(".big-picture");
    var picture = document.querySelector(".big-picture__img img");
    var likesNumber = document.querySelector(".big-picture .likes-count");
    var commentsNumber = document.querySelector(".big-picture .comments-count");
    var socialComments = document.querySelector(".big-picture .social__comments");
    var closeButton = document.getElementById("picture-cancel");
    var commentsCountBlock = document.querySelector(".big-picture .social__comment-count");
    var commentsLoaderButton = document.querySelector(".social__comments-loader");
    var pictureDescription = document.querySelector(".big-picture .social__caption");
    
    picture.src = pictureData.url;
    likesNumber.innerHTML = pictureData.likes;
    commentsNumber.innerHTML = pictureData.comments.length;
    pictureDescription.innerHTML = pictureData.description;

    show(bigPicture);
    modalOpen();

    if(pictureData.comments.length <= 5) {
        commentsCountBlock.classList.add("visually-hidden");
        commentsLoaderButton.classList.add("visually-hidden");
    }

    for(var i = 0; i < pictureData.comments.length; i++) {
        socialComments.appendChild(constructTheComment(pictureData.comments[i]));

        if(i == 5) {
            break;
        }
    }

    function closeBigPicture(evt){
        hide(bigPicture);
        modalClose();
        cleanBlock(socialComments);
        commentsCountBlock.classList.remove("visually-hidden");
        commentsLoaderButton.classList.remove("visually-hidden");
        document.removeEventListener('keyup', escapeButtonHandler)
    }

    function escapeButtonHandler(e){
        e.preventDefault();
        if(e.key === "Escape"){
            closeBigPicture();
        }
    }

    closeButton.addEventListener('click', function(evt){
        evt.preventDefault();
        closeBigPicture();
    });
    document.addEventListener('keyup', escapeButtonHandler);
}

function showEditForm(){
    var uploadPhotosInput = document.querySelector("#upload-file");
    var editFormOverlay = document.querySelector(".img-upload__overlay");
    var closeButton = document.querySelector(".img-upload__overlay .img-upload__cancel");

    uploadPhotosInput.addEventListener("change", function(evt) {
        evt.preventDefault();
        editFormOverlay.classList.remove("hidden");
    });

    function hideEditForm() {
        editFormOverlay.classList.add("hidden");
        uploadPhotosInput.value = none;
        document.removeEventListener("keyup", escapeButtonHandler)
    }

    closeButton.addEventListener("click", function(evt) {
        evt.preventDefault();
        hideEditForm();
    });

    function escapeButtonHandler(evt) {
        evt.preventDefault();
        if(evt.key === "Escape") {
            hideEditForm();
        }
    }

    document.addEventListener("keyup", escapeButtonHandler);
}

getPicturesData();
drawPictures();
showEditForm();

// Другие полезные функции
function getRandomNumber(minNumber, maxNumber) {
    var min = Math.ceil(minNumber);
    var max = Math.floor(maxNumber);
    return Math.floor(Math.random() * (max - min)) + min;
}