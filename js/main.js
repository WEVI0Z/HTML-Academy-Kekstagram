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
var MAX_COMMENTS_AMOUNT = 6;

var FIRST_AVATAR_NUMBER = 1;
var LAST_AVATAR_NUMBER = 6;

var SMALL_IMG_WIDTH = 35;
var SMALL_IMG_HEIGHT = 35;

var FILTERS_LIST = [
    {
        name: 'chrome',
        cssRuleName: 'grayscale',
        minValue: 0,
        maxValue: 1,
        unit: ""
    },
    {
        name: 'sepia',
        cssRuleName: 'sepia',
        minValue: 0,
        maxValue: 1,
        unit: ""
    },
    {
        name: 'marvin',
        cssRuleName: 'invert',
        minValue: 0,
        maxValue: 100,
        unit: "%"
    },
    {
        name: 'phobos',
        cssRuleName: 'blur',
        minValue: 0,
        maxValue: 3,
        unit: "px"
    },
    {
        name: 'heat',
        cssRuleName: 'brightness',
        minValue: 1,
        maxValue: 3,
        unit: ""
    }
];

function getRandomNumber(minNumber, maxNumber) {
    var min = Math.ceil(minNumber);
    var max = Math.floor(maxNumber);
    return Math.floor(Math.random() * (max - min)) + min;
}

function escapeTemplate(doSomethingFunction, key) {
    if(key === "Escape") {
        doSomethingFunction();
    }
}

var picturesData = [];

function getPicturesData() {
    function setUpComments() {
        var commentsList = [];
        var commentsAmount = getRandomNumber(MIN_COMMENTS_AMOUNT, MAX_COMMENTS_AMOUNT);

        for(var j = 0; j < commentsAmount; j++) {
            commentsList.push({
                avatar: "img/avatar-" + getRandomNumber(FIRST_AVATAR_NUMBER, LAST_AVATAR_NUMBER) + ".svg",
                text: COMMENTS_TEXT[getRandomNumber(0, COMMENTS_TEXT.length - 1)]
            });
        }

        return commentsList;
    }
    for(var i = 0; i < PHOTOS_NUMBER; i++) {
        var likesAmount = getRandomNumber(MIN_LIKES_AMOUNT, MAX_LIKES_AMOUNT);
        var descriptionIndex = getRandomNumber(0, DESCRIPTION_LIST.length - 1);
        var userNameIndex = getRandomNumber(0, USER_NAMES.length - 1);

        picturesData[i] = {
            url: "photos/" + (i + 1) + ".jpg",
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

    function controlPicturesHandler() {
        var pictures = pictureWrap.querySelectorAll(".picture");

        pictures.forEach(function(itPicture, index) {
            itPicture.addEventListener("click", function(evt){
                evt.preventDefault();

                showBigPicture(picturesData[index]);
            });
        });
    }

    controlPicturesHandler();
}

function showBigPicture(pictureData) {
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
    
    var bigPicture = document.querySelector(".big-picture");
    var picture = document.querySelector(".big-picture__img img");
    var likesNumber = document.querySelector(".big-picture .likes-count");
    var commentsNumber = document.querySelector(".big-picture .comments-count");
    var socialComments = document.querySelector(".big-picture .social__comments");
    var closeButton = document.querySelector("#picture-cancel");
    var commentsCountBlock = document.querySelector(".big-picture .social__comment-count");
    var commentsLoaderButton = document.querySelector(".social__comments-loader");
    var pictureDescription = document.querySelector(".big-picture .social__caption");
    
    picture.src = pictureData.url;
    likesNumber.textContent = pictureData.likes;
    commentsNumber.textContent = pictureData.comments.length;
    pictureDescription.textContent = pictureData.description;

    function controlTheCommentsCounter() {
        if(pictureData.comments.length <= 5) {
            commentsCountBlock.classList.add("visually-hidden");
            commentsLoaderButton.classList.add("visually-hidden");
        }

        var availableForShowCommentsAmount = Math.min(5, pictureData.comments.length);

        for(var i = 0; i < availableForShowCommentsAmount; i++) {
            socialComments.appendChild(constructTheComment(pictureData.comments[i]));
        }
    }

    function showPopUp() {
        bigPicture.classList.remove("hidden");
        document.querySelector("body").classList.add("modalOpen");

        controlTheCommentsCounter();
        bigPictureHandlersControl();
    }

    function closeBigPicture(evt){
        bigPicture.classList.add("hidden");
        commentsCountBlock.classList.remove("visually-hidden");
        commentsLoaderButton.classList.remove("visually-hidden");
        document.querySelector("body").classList.remove("modalOpen");
        document.removeEventListener('keyup', escapeButtonHandler);

        cleanBlock(socialComments);
    }
    
    function escapeButtonHandler(evt){
        evt.preventDefault();

        escapeTemplate(closeBigPicture, evt.key);
    }

    function bigPictureHandlersControl() {
        closeButton.addEventListener('click', function(evt){
            evt.preventDefault();

            closeBigPicture();
        });

        document.addEventListener('keyup', escapeButtonHandler);
    }

    showPopUp();
}

function showEditForm(){
    var uploadPhotosInput = document.querySelector("#upload-file");
    var editFormOverlay = document.querySelector(".img-upload__overlay");
    var closeButton = document.querySelector(".img-upload__overlay .img-upload__cancel");

    uploadPhotosInput.addEventListener("change", function(evt) {
        evt.preventDefault();

        openEditForm();
    });

    function controlEditFormsHandlers() {
        closeButton.addEventListener("click", function(evt) {
            evt.preventDefault();
     
            hideEditForm();
        });
    
        document.addEventListener("keyup", escapeButtonHandler); 
    }

    function escapeButtonHandler(evt) {
        evt.preventDefault();
        escapeTemplate(hideEditForm, evt.key);
    }

    function controlFilters() {
        var previewImage = editFormOverlay.querySelector(".img-upload__preview").querySelector("img");
        var filterButtonsWrap = editFormOverlay.querySelector(".effects__list");

        function setFilterButtonsLesteners() {
            filterButtonsWrap.addEventListener("click", function(evt) {
                if(evt.target.type === "radio") {
                    FILTERS_LIST.forEach(function(itFilter) {
                        if(itFilter.name === evt.target.value) {
                            previewImage.setAttribute("style", "filter: " + itFilter.cssRuleName +
                             "(" + itFilter.maxValue + itFilter.unit + ")");
                        } else if(evt.target.value === "none"){
                            previewImage.removeAttribute("style");
                        }
                    });
                }
            });
        }
        setFilterButtonsLesteners();
    }

    function openEditForm() {
        editFormOverlay.classList.remove("hidden");

        controlEditFormsHandlers();
        controlFilters();
    }
    
    function hideEditForm() {
        editFormOverlay.classList.add("hidden");
        document.removeEventListener("keyup", escapeButtonHandler);
        uploadPhotosInput.value = "";
    }
}

getPicturesData();
drawPictures();
showEditForm();