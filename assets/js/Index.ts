/// <reference path="../../DefinitelyTyped/jquery/jquery.d.ts"/>

var apps: IAppInfo[] = [
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

// переменные
var leftAnimation: JQuery;
var rightAnimation: JQuery;

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

// базовые функции
function fillAppContainers() {
    for (let key in apps) // for acts as a foreach
    {
        var app = apps[key];
        createElementForApp(app);
    }
}

function createElementForApp(appInfo: IAppInfo) {
    let imagePath = `/assets/images/screens/${appInfo.image}.jpeg`;

    let appElement =
        $("<div/>")
            .addClass("app");

    let appImageElement =
        $("<img/>")
            .attr("src", imagePath)

    var resultElement = appElement.append(appImageElement);

    appContainerLeft.append(resultElement.clone());
    appContainerRight.append(resultElement.clone());
}

function scrollContainerToIndex(element: JQuery, index: number, complete?: Function): void {
    let animationTime = 2000;

    let oneAppHeight = appContainerLeft.find(".app").height();
    let headerHeight = page2.find(".nav-bar-header").height();

    var topY = appLabels.position().top + appLabels.outerHeight(true);
    var position = topY - index * oneAppHeight;

    element.animate({ top: position }, animationTime, "swing", complete);
}

function getRandomAppIndex(): number {
    let offset = 4;
    let randomIndex = offset + Math.ceil(Math.random() * apps.length);
    return randomIndex;
}

function setActiveApp(container: JQuery, index: number) {
    let apps = container.children();
    for (let i = 0; i < apps.length; i++) {
        let appElement = $(apps[i]);
        let isActive = i == index;
        if (isActive) {
            appElement.removeClass("inactive");
            appElement.addClass("active");
        } else {
            appElement.removeClass("active");
            appElement.addClass("inactive");
        }
    }
}

function setAppLabel(labelElement: JQuery, appIndex: number) {
    let normalizedAppIndex = appIndex % apps.length;
    let appInfo = apps[normalizedAppIndex];
    let imagePath = `/assets/images/icons/${appInfo.image}.png`;

    let iconElement = $("<img/>").attr("src", imagePath).addClass("app-icon");
    let textElement = $("<span/>").text(appInfo.name);

    labelElement.empty().append(iconElement).append(textElement);
}

function highlightApps(leftAppIndex: number, rightAppIndex: number) {
    //выделим элементы визуально
    setActiveApp(appContainerLeft, leftAppIndex);
    setActiveApp(appContainerRight, rightAppIndex);
}

function dehighlightAppIn(container: JQuery) {
    let apps = container.children();
    for (let i = 0; i < apps.length; i++) {
        let appElement = $(apps[i]);
        appElement.removeClass("active");
        appElement.removeClass("inactive");
    }
}

function dehighlightApps() {
    dehighlightAppIn(appContainerLeft);
    dehighlightAppIn(appContainerRight);
}

function updateAppLabels(leftAppIndex: number, rightAppIndex: number) {
    //выставим текст
    setAppLabel(leftAppLabel, leftAppIndex);
    setAppLabel(rightAppLabel, rightAppIndex);
}

function completeRandomization() {
    page2.addClass("results");
    // page2.removeClass("shuffling");
}

function addAnimationToAppContaiers() {
    let firstAppIndex = getRandomAppIndex();
    let secondAppIndex = getRandomAppIndex();
    // чтобы не было одинаковых
    while (firstAppIndex === secondAppIndex) {
        secondAppIndex = getRandomAppIndex();
    }
    // обновим тайтлы и иконки приложений
    updateAppLabels(firstAppIndex, secondAppIndex);

    // перемотаем
    scrollContainerToIndex(appContainerLeft, firstAppIndex);
    scrollContainerToIndex(appContainerRight, secondAppIndex,
        () => {
            // после выполнения анимации
            highlightApps(firstAppIndex, secondAppIndex)
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
    // page2.removeClass("shuffling");
    // dehighlightApps();
    goShuffling();
}

function startApp() {
    var animationNames = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
    page1.addClass("animated zoomOut");
    page1.one(animationNames,
        () => {
            page1.hide();
            page1.removeClass("animated zoomOut");
            page1.one(animationNames, () => { });

            page2.addClass("animated zoomIn");
            page2.show();
            startBgAnimationOnPage2();
        });

}

function initialization() {
    //дважды зальем картинки, чтобы казалось, чтобы можно было зациклить движение
    fillAppContainers();
    fillAppContainers();

    startAppButton.click(startApp);
    startShuffleButton.click(goShuffling);
    restartShuffleButton.click(restartShuffle);
}

// старт приложения
initialization();


function startBgAnimationOnPage2() {
    let duration = 20000;
    appContainerLeft.css("top", 0);
    leftAnimation = appContainerLeft.animate({ top: -appContainerLeft.height() / 2 }, duration, "linear");

    appContainerRight.css("top", -appContainerRight.height() / 2);
    rightAnimation = appContainerRight.animate({ top: 0 }, duration, "linear", startBgAnimationOnPage2);
}

// после того как элементы добавятся, можно что-либо пересчитать
setTimeout(() => {
    // goShuffling();
    // start();
});
