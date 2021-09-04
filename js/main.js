'use strict'
//Генерация случайного массива данных
var PHOTOS_NUMBER = 25;
var COMMENTS_TEXT = [
    "Всё отлично!",
    "В целом все неплохо. Но не всё.",
    "Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.",
    "Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.",
    "Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.",
    "Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!"
];

var USER_NAMES = [
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

var DESCRIPTION_LIST = [
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
    function setUpComments() {
        var commentsList = [];
        var commentAmount = getRandomNumber(2, 10);

        for(var j = 0; j < commentAmount; j++) {
            commentsList.push({
                avatar: "../img/avatar-" + getRandomNumber(1, 6) + ".svg",
                text: COMMENTS_TEXT[getRandomNumber(0, COMMENTS_TEXT.length - 1)]
            });
        }
        return commentsList;
    }
    for(var i = 0; i < PHOTOS_NUMBER; i++) {
        var likesAmount = getRandomNumber(15, 200);
        var descriptionIndex = getRandomNumber(0, DESCRIPTION_LIST.length - 1);
        var userNameIndex = getRandomNumber(0, USER_NAMES.length - 1);

        picturesData[i] = {
            url: "/photos/" + (i + 1) + ".jpg",
            likes: likesAmount,
            comments: setUpComments(),
            name: USER_NAMES[userNameIndex],
            description: DESCRIPTION_LIST[descriptionIndex]
        };
    }
}

function drawPictures() {
    var picturesFragment = document.createDocumentFragment();

    var pictureWrap = document.querySelector('.pictures');
    var template = document.querySelector('#picture').content.querySelector('.picture');

    function setImgOptions(img, src, alt) {
        img.src = src;
        img.alt = alt;
    }
    
    picturesData.forEach(function(itPicture, index) {
        var newPicture = template.cloneNode(true);

        var pictureImg = newPicture.querySelector('.picture__img');
        var pictureComments = newPicture.querySelector('.picture__comments');
        var pictureLikes = newPicture.querySelector('.picture__likes');

        setImgOptions(pictureImg, itPicture.url, itPicture.description);
        
        pictureComments.textContent = itPicture.comments.length;
        pictureLikes.textContent = itPicture.likes;

        picturesFragment.appendChild(newPicture);
    });

    pictureWrap.appendChild(picturesFragment);

    function setPicturesListeners() {
        var pictures = pictureWrap.querySelectorAll(".picture");

        pictures.forEach(function(itPicture, index) {
            itPicture.addEventListener("click", function(evt){
                evt.preventDefault();

                showBigPicture(picturesData[index]);
            })
        })
    }

    setPicturesListeners();
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