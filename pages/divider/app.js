import Divisor from "../../components/division/divisor.js"
import Quotient from "../../components/division/quotient.js"
import ALU from "../../components/division/ALUdivision.js"
import Remainder from "../../components/division/remainder.js"
import Router from "../../config/router.js"
import Extender from "../../middleware/bitBaseExtentionMiddleware.js"
import Formater from "../../middleware/formatMiddleware.js"

console.log("After import");

const initialValues = {
    divident: sessionStorage.getItem("firstOperand"),
    divisor: sessionStorage.getItem("secondOperand")
}

if(!initialValues.divident  || !initialValues.divisor) {
    alert("initial values have not been set, returning to set form")
    Router.home()
}

const formater = new Formater()

//LOGICAL COMPONENTS
const divisor = new Divisor(document.querySelector("#divisor-view-port"), `${initialValues.divisor}${Extender("0", initialValues.divisor.length)}`)
const quotient = new Quotient(document.querySelector("#quotient-view-port"), Extender("0", initialValues.divisor.length))
const remainder = new Remainder(document.querySelector("#remainder-view-port"), `${initialValues.divident}`)
const alu = new ALU()

//DOM COMPONENTS
const divisorC = document.querySelector(".divisor")
const quotientC = document.querySelector(".quotient")
const remainderC = document.querySelector(".remainder")
const aluC = document.querySelector(".alu")
const controlC = document.querySelector(".control")

const components = [divisorC, quotientC, remainderC, aluC]

console.log(initialValues.divident)

alu.steps.push(formater.subBinDec)
alu.steps.push(quotient.shiftL)
alu.steps.push(divisor.shiftR)

//buttons
const doButton = document.querySelector("#do")
const undoButton = document.querySelector("#undo")

let historyLog = []

doButton.addEventListener("click", e => {
    const testDiv = alu.stepFunc(remainder.value, divisor.value, quotient.value)
    if(testDiv[0]) {
        remainder.setValue(testDiv[0])
    }
    if(testDiv[1] != undefined){
        historyLog.push(testDiv[1])
        renderHistory()
    }

    animate()
    
})

let renderHistory = () => {

    const history = document.getElementById("history");
    history.innerHTML = "";

    historyLog.forEach((log) => {

        const liElement = document.createElement("li");
        liElement.classList.add("historyItem");
        liElement.innerText = log;
        history.appendChild(liElement);
    })
}

undoButton.addEventListener("click", e => {
        const prevState = alu.undo()
        
        if(historyLog.length > 0){
            historyLog.pop()
            renderHistory()
        }

        if(prevState) {
            switch(prevState[0]) {
                case "quotient":
                    quotient.setValue(prevState[1])
                    break;
                case "remainder":
                    remainder.setValue(prevState[1])
                    break;
                case "divisor":
                    divisor.setValue(prevState[1])
                    break;
                default:
                    console.log("Someting went oh so terribly wrong....")
            }

            animate()
        }
})

const animate = () => {
    //RESET ALL ANIMATION ON COMPONENTS 
    for (const component of components) {
        component.classList.remove("active")
    }
    aluC.style.setProperty("border", "none")
    
    //GET THE LAST COMPONENT TROUGH UNDOSTACK
    const componentName = alu.undoStack[alu.undoStack.length-1][0]

    //GET THE DOM COMPONENT WITH THAT NAME AND ACTIVATE IT
    document.querySelector(`.${componentName}`).classList.add("active")

    //CHANGE THE VISUAL VALUE FOR CARRY IN WHEN REMAINDER SHIFTS
    if (componentName === "quotient") {
        //REPRESENT CHECKS FOR CONTROL AND SET ANIMATION COLOR TO: GREEN -> GOES TROUGH; RED -> DOENST GO TROUGH

        alu.carryIn === "1" ? controlC.style.setProperty("--animation-primary", "green") : controlC.style.setProperty("--animation-primary", "red")

        document.querySelector("#control-view-port").textContent = `1 = ${alu.carryIn}`
        controlC.style.setProperty("border", ".2rem solid var(--animation-primary)")
        console.log(aluC.classList);
    }

    //ACTIVATE ALU WHEN SUBTRACTION DOES THE THING AS WELL AS DIVISOR
    if (componentName === "remainder") {
        aluC.style.setProperty("border", ".2rem solid white")
        divisorC.classList.add("active")
    }
}