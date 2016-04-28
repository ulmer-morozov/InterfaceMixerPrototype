var apps = [
    {
        name: "Apple Music",
        image: "apple_music"
    }, {
        name: "AutoRap",
        image: "autorap"
    }, {
        name: "Exist.ru",
        image: "exist_ru"
    }, {
        name: "Fruit Ninja",
        image: "fruit_ninja"
    }, {
        name: "Grndr",
        image: "grndr"
    }, {
        name: "Invision",
        image: "invision"
    }, {
        name: "You Tube",
        image: "youtube"
    }, {
        name: "Yandex Trains",
        image: "trains"
    }, {
        name: "Principle",
        image: "principle"
    }, {
        name: "Uber",
        image: "uber"
    }, {
        name: "LinkedIn",
        image: "linkedin"
    }, {
        name: "Medusa",
        image: "medusa"
    }, {
        name: "Trip Advisor",
        image: "trip_advisor"
    },
    {
        name: "Navigator",
        image: "navigator"
    },
    {
        name: "Some Game",
        image: "game"
    }, {
        name: "Some Game2",
        image: "game2"
    }, {
        name: "Skype",
        image: "skype"
    }, {
        name: "Tinder",
        image: "tinder"
    }
];
var combinations = [
    { firstAppIndex: 1, secondAppIndex: 16, video: "skype" },
    { firstAppIndex: 4, secondAppIndex: 10, video: "grndr" },
    { firstAppIndex: 13, secondAppIndex: 6, video: "youtube" },
    { firstAppIndex: 3, secondAppIndex: 17, video: "tinder" },
];
var animationNames = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
var leftAnimation;
var rightAnimation;
var appContainerLeft = $("#app-container-left");
var appContainerRight = $("#app-container-right");
var page1 = $("#page-1");
var page2 = $("#page-2");
var page3 = $("#page-3");
var startAppButton = page1.find(".start-shuffle");
var startShuffleButton = page2.find(".start-shuffle");
var restartShuffleButton = page2.find(".restart-shuffle");
var showCombinationButton = page2.find(".check-out");
var randomizeAfterVideoButton = page3.find(".start-shuffle-after-video");
var videoCombination = page3.find("video.combinationVideo");
var video = videoCombination[0];
var leftAppLabel = $(".leftAppLabel");
var rightAppLabel = $(".rightAppLabel");
var appLabels = $(".app-labels");
var phoneContentWidth = $(".phone-content").width();
var phoneContentHeight = $(".phone-content").height();
var lastCombinationIndex;
var lastCombination;
function fillAppContainers() {
    for (var key in apps) {
        var app = apps[key];
        createElementForApp(app);
    }
}
function createElementForApp(appInfo) {
    var imagePath = "assets/images/screens/" + appInfo.image + ".jpeg";
    var appElement = $("<div/>")
        .addClass("app");
    var appImageElement = $("<img/>")
        .attr("src", imagePath);
    var resultElement = appElement.append(appImageElement);
    appContainerLeft.append(resultElement.clone());
    appContainerRight.append(resultElement.clone());
}
var oneAppHeight = undefined;
var headerHeight = undefined;
var topY = undefined;
function scrollContainerToIndex(element, index, complete) {
    var animationTime = 2000;
    if (oneAppHeight == undefined) {
        oneAppHeight = appContainerLeft.find(".app").height();
    }
    if (headerHeight == undefined) {
        headerHeight = page2.find(".nav-bar-header").height();
    }
    if (topY == undefined) {
        topY = appLabels.position().top + appLabels.outerHeight(true);
    }
    var position = topY - index * oneAppHeight;
    element.animate({ top: position }, animationTime, "swing", complete);
}
function getRandomAppIndex() {
    var offset = 4;
    var randomIndex = offset + Math.ceil(Math.random() * apps.length - 1);
    return randomIndex;
}
function getRandomCombinationIndex() {
    var randomIndex;
    do {
        randomIndex = Math.ceil(Math.random() * combinations.length - 1);
    } while (randomIndex == lastCombinationIndex);
    return randomIndex;
}
function setActiveApp(container, index) {
    var apps = container.children();
    for (var i = 0; i < apps.length; i++) {
        var appElement = $(apps[i]);
        var isActive = i == index;
        if (isActive) {
            appElement.removeClass("inactive");
            appElement.addClass("active");
        }
        else {
            appElement.removeClass("active");
            appElement.addClass("inactive");
        }
    }
}
function setAppLabel(labelElement, appIndex) {
    var normalizedAppIndex = appIndex % apps.length;
    var appInfo = apps[normalizedAppIndex];
    var imagePath = "assets/images/icons/" + appInfo.image + ".png";
    var iconElement = $("<img/>").attr("src", imagePath).addClass("app-icon");
    var textElement = $("<span/>").text(appInfo.name);
    labelElement.empty().append(iconElement).append(textElement);
}
function highlightApps(leftAppIndex, rightAppIndex) {
    setActiveApp(appContainerLeft, leftAppIndex);
    setActiveApp(appContainerRight, rightAppIndex);
}
function dehighlightAppIn(container) {
    var apps = container.children();
    for (var i = 0; i < apps.length; i++) {
        var appElement = $(apps[i]);
        appElement.removeClass("active");
        appElement.removeClass("inactive");
    }
}
function dehighlightApps() {
    dehighlightAppIn(appContainerLeft);
    dehighlightAppIn(appContainerRight);
}
function updateAppLabels(leftAppIndex, rightAppIndex) {
    setAppLabel(leftAppLabel, leftAppIndex);
    setAppLabel(rightAppLabel, rightAppIndex);
}
function completeRandomization() {
    page2.addClass("results");
}
function addAnimationToAppContaiers() {
    lastCombinationIndex = getRandomCombinationIndex();
    lastCombination = combinations[lastCombinationIndex];
    var firstAppIndex = lastCombination.firstAppIndex;
    var secondAppIndex = lastCombination.secondAppIndex;
    while (firstAppIndex === secondAppIndex) {
        secondAppIndex = getRandomAppIndex();
    }
    updateAppLabels(firstAppIndex, secondAppIndex);
    scrollContainerToIndex(appContainerLeft, firstAppIndex);
    scrollContainerToIndex(appContainerRight, secondAppIndex, function () {
        highlightApps(firstAppIndex, secondAppIndex);
        completeRandomization();
    });
}
function goShuffling() {
    leftAnimation.stop();
    rightAnimation.stop();
    page2.removeClass("init");
    page2.addClass("shuffling");
    addAnimationToAppContaiers();
}
function restartShuffle() {
    page2.removeClass("results");
    goShuffling();
}
function restartShuffleAfterVideo() {
    page3.addClass("animated zoomOut");
    page3.one(animationNames, function () {
        page3.hide();
        page3.removeClass("animated zoomOut");
        page3.unbind(animationNames);
        startShuffleButton.hide();
        page2.removeClass("results");
        page2.addClass("animated zoomIn");
        page2.show();
        goShuffling();
    });
}
function startApp() {
    page1.addClass("animated zoomOut");
    page1.one(animationNames, function () {
        page1.hide();
        page1.removeClass("animated zoomOut");
        page1.unbind(animationNames);
        page2.addClass("animated zoomIn");
        page2.show();
        startBgAnimationOnPage2();
    });
}
function combinationVideoEnded() {
    randomizeAfterVideoButton.show();
    randomizeAfterVideoButton.addClass("animated zoomIn");
    randomizeAfterVideoButton.one(animationNames, function () {
        page3.removeClass("animated zoomIn");
        randomizeAfterVideoButton.unbind(animationNames);
    });
}
function showCombination() {
    var videoUrl = "assets/videos/" + lastCombination.video + ".mp4";
    page2.addClass("animated zoomOut");
    page2.one(animationNames, function () {
        page2.hide();
        page2.removeClass("animated zoomOut");
        page2.unbind(animationNames);
        videoCombination.attr("src", videoUrl);
        page3.addClass("animated zoomIn");
        randomizeAfterVideoButton.hide();
        page3.show();
        page3.one(animationNames, function () {
            page3.unbind(animationNames);
            video.play();
        });
    });
}
function initialization() {
    fillAppContainers();
    fillAppContainers();
    startAppButton.click(startApp);
    startShuffleButton.click(goShuffling);
    restartShuffleButton.click(restartShuffle);
    showCombinationButton.click(showCombination);
    randomizeAfterVideoButton.click(restartShuffleAfterVideo);
    page3.hide();
    video.onended = combinationVideoEnded;
}
initialization();
function startBgAnimationOnPage2() {
    var duration = 60000;
    appContainerLeft.css("top", 0);
    leftAnimation = appContainerLeft.animate({ top: -appContainerLeft.height() / 2 }, duration, "linear");
    appContainerRight.css("top", -appContainerRight.height() / 2);
    rightAnimation = appContainerRight.animate({ top: 0 }, duration, "linear", startBgAnimationOnPage2);
}
setTimeout(function () {
});
