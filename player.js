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
