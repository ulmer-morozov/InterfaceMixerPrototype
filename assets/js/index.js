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
        name: "Yandex Trains",
        image: "trains"
    }, {
        name: "Principle",
        image: "principle"
    }, {
        name: "Uber",
        image: "uber"
    }, {
        name: "Medusa",
        image: "medusa"
    }, {
        name: "Trip Advisor",
        image: "trip_advisor"
    }, {
        name: "Some Game",
        image: "game"
    }, {
        name: "Some Game2",
        image: "game2"
    }
];
var leftAnimation;
var rightAnimation;
var appContainerLeft = $("#app-container-left");
var appContainerRight = $("#app-container-right");
var page1 = $("#page-1");
var page2 = $("#page-2");
var startAppButton = page1.find(".start-shuffle");
var startShuffleButton = page2.find(".start-shuffle");
var restartShuffleButton = page2.find(".restart-shuffle");
var leftAppLabel = $(".leftAppLabel");
var rightAppLabel = $(".rightAppLabel");
var appLabels = $(".app-labels");
var phoneContentWidth = $(".phone-content").width();
var phoneContentHeight = $(".phone-content").height();
function fillAppContainers() {
    for (var key in apps) {
        var app = apps[key];
        createElementForApp(app);
    }
}
function createElementForApp(appInfo) {
    var imagePath = "/assets/images/screens/" + appInfo.image + ".jpeg";
    var appElement = $("<div/>")
        .addClass("app");
    var appImageElement = $("<img/>")
        .attr("src", imagePath);
    var resultElement = appElement.append(appImageElement);
    appContainerLeft.append(resultElement.clone());
    appContainerRight.append(resultElement.clone());
}
function scrollContainerToIndex(element, index, complete) {
    var animationTime = 2000;
    var oneAppHeight = appContainerLeft.find(".app").height();
    var headerHeight = page2.find(".nav-bar-header").height();
    var topY = appLabels.position().top + appLabels.outerHeight(true);
    var position = topY - index * oneAppHeight;
    element.animate({ top: position }, animationTime, "swing", complete);
}
function getRandomAppIndex() {
    var offset = 4;
    var randomIndex = offset + Math.ceil(Math.random() * apps.length);
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
    var imagePath = "/assets/images/icons/" + appInfo.image + ".png";
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
    var firstAppIndex = getRandomAppIndex();
    var secondAppIndex = getRandomAppIndex();
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
function startApp() {
    var animationNames = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
    page1.addClass("animated zoomOut");
    page1.one(animationNames, function () {
        page1.hide();
        page1.removeClass("animated zoomOut");
        page1.one(animationNames, function () { });
        page2.addClass("animated zoomIn");
        page2.show();
        startBgAnimationOnPage2();
    });
}
function initialization() {
    fillAppContainers();
    fillAppContainers();
    startAppButton.click(startApp);
    startShuffleButton.click(goShuffling);
    restartShuffleButton.click(restartShuffle);
}
initialization();
function startBgAnimationOnPage2() {
    var duration = 20000;
    appContainerLeft.css("top", 0);
    leftAnimation = appContainerLeft.animate({ top: -appContainerLeft.height() / 2 }, duration, "linear");
    appContainerRight.css("top", -appContainerRight.height() / 2);
    rightAnimation = appContainerRight.animate({ top: 0 }, duration, "linear", startBgAnimationOnPage2);
}
setTimeout(function () {
});
