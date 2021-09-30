'use strict';

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
    "Отгоняйте все сомненья. Не обижайте всех словами......",
    "Вот это тачка!"
];

var MIN_LIKES_AMOUNT = 15;
var MAX_LIKES_AMOUNT = 200;

var MIN_COMMENTS_AMOUNT = 2;
var MAX_COMMENTS_AMOUNT = 9;
var COMMENTS_AMOUNT_WITHOUT_LOAD = 5;


var FIRST_AVATAR_NUMBER = 1;
var LAST_AVATAR_NUMBER = 6;

var SMALL_IMG_WIDTH = 35;
var SMALL_IMG_HEIGHT = 35;

var FILTERS_LIST = {
    chrome: {
        name: 'chrome',
        cssRuleName: 'grayscale',
        minValue: 0,
        maxValue: 1,
        unit: ""
    },
    sepia: {
        name: 'sepia',
        cssRuleName: 'sepia',
        minValue: 0,
        maxValue: 1,
        unit: ""
    },
    marvin: {
        name: 'marvin',
        cssRuleName: 'invert',
        minValue: 0,
        maxValue: 100,
        unit: "%"
    },
    phobos: {
        name: 'phobos',
        cssRuleName: 'blur',
        minValue: 0,
        maxValue: 3,
        unit: "px"
    },
    heat: {
        name: 'heat',
        cssRuleName: 'brightness',
        minValue: 1,
        maxValue: 3,
        unit: ""
    }
};

function getRandomNumber(minNumber, maxNumber) {
    var min = Math.ceil(minNumber);
    var max = Math.floor(maxNumber);

    return Math.floor(Math.random() * (max - min)) + min;
}

function escapeButtonController(action, evt) {
    if(evt.key === "Escape") {
        evt.preventDefault();
        action();
    }
}

var picturesData = [];

function getPicturesData() {
    function setUpComments() {
        var commentsList = [];
        var commentsAmount = getRandomNumber(MIN_COMMENTS_AMOUNT, MAX_COMMENTS_AMOUNT);

        for(var j = 0; j < commentsAmount; j++) {
            commentsList.push({
                avatar: "img/avatar-" + getRandomNumber(1, 6) + ".svg",
                text: COMMENTS_TEXT[getRandomNumber(0, COMMENTS_TEXT.length - 1)]
            });
        }

        return commentsList;
    }
    for(var i = 0; i < PHOTOS_NUMBER; i++) {
        var likesAmount = getRandomNumber(MIN_LIKES_AMOUNT, MAX_LIKES_AMOUNT);
        var descriptionIndex = getRandomNumber(0, DESCRIPTION_LIST.length - 1);
        var userNameIndex = getRandomNumber(0, USER_NAMES.length - 1);

        picturesData.push({
            url: "photos/" + (i + 1) + ".jpg",
            likes: likesAmount,
            comments: setUpComments(),
            name: USER_NAMES[userNameIndex],
            description: DESCRIPTION_LIST[descriptionIndex]
        });
    }
}

function drawPictures() {
    var picturesFragment = document.createDocumentFragment();

    var pictureWrap = document.querySelector('.pictures');
    var template = document.querySelector('#picture').content.querySelector('.picture');
    
    picturesData.forEach(function(itPicture, index) {
        var newPicture = template.cloneNode(true);

        var pictureImg = newPicture.querySelector('.picture__img');
        
        pictureImg.src = itPicture.url;
        pictureImg.alt = itPicture.description;

        newPicture.setAttribute('data-picture-position', index);

        newPicture.querySelector('.picture__comments').textContent = itPicture.comments.length;
        newPicture.querySelector('.picture__likes').textContent = itPicture.likes;

        picturesFragment.appendChild(newPicture);
    });

    pictureWrap.appendChild(picturesFragment);

    function controlPicturesHandler() {
        var pictures = pictureWrap.querySelectorAll(".picture");

        pictures.forEach(function(itPicture) {
            itPicture.addEventListener("click", smallPictureClickHandler);
        });
    }

    function smallPictureClickHandler(evt) {
        evt.preventDefault();

        var index = evt.currentTarget.getAttribute('data-picture-position');

        showBigPicture(picturesData[index]);
    }

    controlPicturesHandler();
}

function showBigPicture(pictureData) {    
    var body = document.querySelector("body");
    var bigPicture = document.querySelector(".big-picture");
    var picture = bigPicture.querySelector(".big-picture__img img");
    var likesNumber = bigPicture.querySelector(".likes-count");
    var commentsNumber = bigPicture.querySelector(".comments-count");
    var socialComments = bigPicture.querySelector(".social__comments");
    var closeButton = bigPicture.querySelector("#picture-cancel");
    var commentsCountBlock = bigPicture.querySelector(".social__comment-count");
    var commentsLoaderButton = bigPicture.querySelector(".social__comments-loader");
    var pictureDescription = bigPicture.querySelector(".social__caption");

    function constructTheComment(commentData) {
        function constructTheParagraph() {
            var p = document.createElement("p");

            p.classList.add("social__text");
            p.textContent = commentData.text;
            
            return p;
        }

        function constructTheAvatar() {
            var img = document.createElement("img");

            img.classList.add("social__picture");
            img.src = commentData.avatar;
            img.alt = "Аватар комментатора фотографии";
            img.width = SMALL_IMG_WIDTH;
            img.height = SMALL_IMG_HEIGHT;

            return img;
        }
        var li = document.createElement("li");

        li.classList.add("social__comment");

        li.appendChild(constructTheAvatar());
        li.appendChild(constructTheParagraph());

        return li;
    }

    function cleanBlock(block) {
        block.innerHTML = "";
    }
    
    picture.src = pictureData.url;
    likesNumber.textContent = pictureData.likes;
    commentsNumber.textContent = pictureData.comments.length;
    pictureDescription.textContent = pictureData.description;

    function commentsAvailableCounter(startCommentIndex, lastCommentIndex) {
        pictureData.comments.slice(startCommentIndex, lastCommentIndex).forEach(function(itComment) {
            socialComments.appendChild(constructTheComment(itComment));
        })
    }

    function controlTheCommentsCounter() {
        if(pictureData.comments.length <= COMMENTS_AMOUNT_WITHOUT_LOAD) {
            commentsCountBlock.classList.add("visually-hidden");
            commentsLoaderButton.classList.add("visually-hidden");
        }

        var firstCommentIndex = 0;
        var availableForShowCommentsAmount = Math.min(COMMENTS_AMOUNT_WITHOUT_LOAD, pictureData.comments.length);

        commentsAvailableCounter(firstCommentIndex, availableForShowCommentsAmount);
    }

    function showPopUp() {
        bigPicture.classList.remove("hidden");
        body.classList.add("modalOpen");

        controlTheCommentsCounter();
        setUpBitPictureHandlers();
    }

    function closeBigPicture(evt){
        bigPicture.classList.add("hidden");
        commentsCountBlock.classList.remove("visually-hidden");
        commentsLoaderButton.classList.remove("visually-hidden");
        body.classList.remove("modalOpen");

        removeBigPictureHandlers();
        cleanBlock(socialComments);
    }
    
    function escapeButtonHandler(evt){
        escapeButtonController(closeBigPicture, evt);
    }

    function closeButtonHandler(evt) {
        evt.preventDefault();

        closeBigPicture();
    }

    function setUpBitPictureHandlers() {
        closeButton.addEventListener('click', closeButtonHandler);
        document.addEventListener('keydown', escapeButtonHandler);
    }

    function removeBigPictureHandlers() {
        document.removeEventListener('keydown', escapeButtonHandler);
        closeButton.removeEventListener('click', closeButtonHandler);
    }

    showPopUp();
}

function showEditForm(){
    var uploadPhotosInput = document.querySelector("#upload-file");
    var editFormOverlay = document.querySelector(".img-upload__overlay");
    var closeButton = editFormOverlay.querySelector(".img-upload__cancel");
    var previewImage = editFormOverlay.querySelector(".img-upload__preview img");
    var filterButtonsWrap = editFormOverlay.querySelector(".effects__list");
    var hashtagsInput = editFormOverlay.querySelector(".text__hashtags");
    var descriptionInput = editFormOverlay.querySelector(".text__description");

    function photosInputChangeHandler(evt) {
        evt.preventDefault();

        openEditForm();
    }

    uploadPhotosInput.addEventListener("change", photosInputChangeHandler);

    function escapeButtonHandler(evt) {
        escapeButtonController(hideEditForm, evt);
    }

    function closeButtonHandler(evt) {
        evt.preventDefault();
     
        hideEditForm();
    }

    function filterChooseButtonsHandler(evt) {
        if (typeof(evt.target.value) === "string") {
            var filterName = evt.target.value;
            var chosenFilter = FILTERS_LIST[filterName];

            if (filterName === "none") {
                previewImage.removeAttribute("style");
            } else {
                previewImage.setAttribute("style", "filter: " + chosenFilter.cssRuleName +
                     "(" + chosenFilter.maxValue + chosenFilter.unit + ")");
            }
        }
    }

    function setUpEditFormHandlers() {
        filterButtonsWrap.addEventListener("click", filterChooseButtonsHandler);
        closeButton.addEventListener("click", closeButtonHandler);
        document.addEventListener("keydown", escapeButtonHandler);
    }

    function removeEditFormHandlers() {
        closeButton.removeEventListener("click", closeButtonHandler);
        document.removeEventListener("keydown", escapeButtonHandler);
        filterButtonsWrap.removeEventListener("click", filterChooseButtonsHandler);
    }

    function openEditForm() {
        editFormOverlay.classList.remove("hidden");

        setUpEditFormHandlers();
    }
    
    function hideEditForm() {
        editFormOverlay.classList.add("hidden");

        uploadPhotosInput.value = "";
        hashtagsInput.value = "";
        descriptionInput.value = "";

        removeEditFormHandlers();
    }
}

getPicturesData();
drawPictures();
showEditForm();