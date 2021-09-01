

$(function () {
    //alternateLayout($("body"), false);

    $(".fadeUp")
        .css("opacity", 0.0)
        .css("position", "relative")
        .css("top", 100)
        .animate(
            {
                opacity: 1.0,
                top: 0
            }, 2000);
});

function getStepDelay() {
    return 1000;
}

function alternateLayout(element, isVertical) {
    if ($(element).hasClass("vertical")) {
        isVertical = true;
    }
    else if ($(element).hasClass("horizontal")) {
        isVertical = false;
    }

    $(element).css("display", isVertical ? "block" : "flex");

    $(element).children().each(function () {
        alternateLayout(this, !isVertical);
    });
}
