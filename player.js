const URL = "https://guidedlearning.oracle.com/player/latest/api/scenario/get/v_IlPvRLRWObwLnV5sTOaw/5szm2kaj/?callback=?";
const ActionType = {
    TIP: 'tip',
    CLOSESCENARIO: 'closeScenario'
};

const Placement = {
    RIGHT: 'right',
    BOTTOM: 'bottom',
    TOP: 'top',
    LEFT: 'left'
}

const WIDTH = 288;
const HEIGHT = 140;

let steps;
let currStepIndex = 0;
function  addCss(){
     let css = document.createElement('link');
     css.rel = 'stylesheet';
     css.href = 'https://guidedlearning.oracle.com/player/latest/static/css/stTip.css';
     document.head.appendChild(css);
}
function addToolTip(tooltipCss, tip) {
    var css = document.createElement('link');
    css.rel = 'stylesheet';
    css.href = 'https://guidedlearning.oracle.com/player/latest/static/css/stTip.css';
    document.head.appendChild(css);

    (window.jQuery)(document.head).append("<style>" + tooltipCss + "</style>");
    (window.jQuery)(document.body).append(
      //add the provided html to the
      "<div  class='sttip'> " +
        "<div class='tooltip in'> " +
        "<div class='tooltip-arrow'></div>" +
        "<div class='tooltip-arrow second-arrow'></div>" +
        "<div class='popover-inner'>" +
        tip +
        "</div>" +
        "</div>" +
        "</div>");
    (window.jQuery)("span[data-iridize-role='stepsCount']").text(steps.length);
    (window.jQuery)("button[data-iridize-role='prevBt']").css({padding: '0 5px'});
    addActionsToTooltip();
    addTooltipContent();
}

function addActionsToTooltip() {
    (window.jQuery)("a[data-iridize-role='nextBt']").click(nextClick);
    (window.jQuery)("button[data-iridize-role='closeBt']").click(closeTooltip);
    (window.jQuery)("button[data-iridize-role='prevBt']").click(backClick);
}

function getTooltipPosition(top, left, selectorPositions) {
    const bodyPosition = (window.jQuery)(document.body)[0].getBoundingClientRect();
    if (left + WIDTH > bodyPosition.right) {
        left = selectorPositions.left - WIDTH;
    }
    if (top + HEIGHT > bodyPosition.bottom) {
        top = selectorPositions.top - HEIGHT;
    }
    return {top: top, left: left}
}

function setTooltipPlacement() {
    const action = steps[currStepIndex].action;
    const selector = action.selector
    if (!selector || !(window.jQuery)(selector)[0]) {
        const viewPortPosition = (window.jQuery)(document.body)[0].getBoundingClientRect();
        (window.jQuery)('.sttip').css({
            position: 'absolute',
            top: viewPortPosition.bottom / 2,
            left: viewPortPosition.right / 2
        });
        return;
    }
    const selectorPositions = (window.jQuery)(selector)[0].getBoundingClientRect();
    let tooltipPosition;
    switch (action.placement) {
        case Placement.RIGHT: {
            tooltipPosition = getTooltipPosition(selectorPositions.top, selectorPositions.right, selectorPositions);
            break;
        }
        case Placement.BOTTOM: {
            tooltipPosition = getTooltipPosition(selectorPositions.bottom,
                (selectorPositions.right + selectorPositions.left) / 2,
                selectorPositions);
            break;
        }
    }

    (window.jQuery)('.sttip').css({position: 'absolute', ...tooltipPosition});
}

function nextClick() {
    const nextStepId = steps[currStepIndex].followers[0].next;
    currStepIndex = steps.findIndex(val => val.id === nextStepId);
    addTooltipContent();
    if (currStepIndex > 0) {
        (window.jQuery)("button[data-iridize-role='prevBt']").removeClass('default-prev-btn');
    }
    if (currStepIndex === steps.length - 1) {
        (window.jQuery)("a[data-iridize-role='nextBt']").css({display: 'none'})
    }
}

function closeTooltip() {
    (window.jQuery)('.sttip').css({display: 'none'});
}

function backClick() {
    currStepIndex--;
    if (currStepIndex === 0) {
        (window.jQuery)("button[data-iridize-role='prevBt']").addClass('default-prev-btn');
    }
    if (currStepIndex < steps.length - 1) {
        (window.jQuery)("a[data-iridize-role='nextBt']").css({display: 'block'})
    }
    addTooltipContent();
}

function addTooltipContent() {
    (window.jQuery)("span[data-iridize-role='stepCount']").text(currStepIndex + 1);
    const action = steps[currStepIndex].action;
    let content;
    if (action.type === ActionType.TIP) {
        content = action.contents["#content"];
    } else {
        content = '<p>Congrats! You have completed the guided learning.</p>';
    }

    setTooltipPlacement();
    (window.jQuery)("div[data-iridize-id='content']").html(content);
}

function getSteps() {
    (window.jQuery).getJSON(
        URL,
        (json) => {
            let jData = json.data;
            steps = jData.structure.steps;
            if (steps && steps.length > 0)
                addToolTip(jData.css, jData.tiplates.tip);
        }
    );
}

(function startGuidedLearning() {
    var scriptTag = document.createElement('script');
    scriptTag.type = 'text/javascript';
    scriptTag.src = 'https://code.jquery.com/jquery-3.5.1.min.js';
    document.head.appendChild(scriptTag);
    scriptTag.onload = getSteps;
})()

