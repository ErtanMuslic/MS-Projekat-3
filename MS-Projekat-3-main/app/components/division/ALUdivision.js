import Formater from "../../middleware/formatMiddleware.js"
import Extender from "../../middleware/bitBaseExtentionMiddleware.js"

const formater = new Formater()


export default function ALUdivision() {
    this.body = `<div class="alu"> ALU </div>`
    this.undoStack = []
    this.steps = []
    this.currStep = 0
    this.iteration = 0
    this.carryIn = '0'
    this.stepFunc = (remainder, divisor, quotient) => {
        
        let returnValue = undefined

        if(this.iteration < quotient.length + 1){
            if(this.currStep == 0){
                let rem = this.steps[this.currStep](remainder, divisor)
                if(rem < 0){
                    this.carryIn = '0'
                    rem = formater.binToDec(remainder)
                    console.log("Because the difference between Remainder and Divisor is negative, Remainder stays the same.")
                }else{
                    this.carryIn = '1'
                    console.log("The Remainder has changed.")
                }
                returnValue = Extender(formater.decToBin(rem), remainder.length)
                console.log(formater.decToBin(rem));
                console.log(returnValue);
                while(returnValue.length < remainder.length){
                    returnValue = '0' + returnValue
                }
                this.undoStack.push(['remainder', remainder])
            }else if(this.currStep == 1){
                this.steps[this.currStep](this.carryIn)
                if(this.carryIn == '1'){
                    console.log("Quotinet shifts to the left, the new bit is '1' because the difference between Remainder and Divisor is a non-negative number.")
                }else{
                    console.log("Quotinet shifts to the left, the new bit is '0' because the difference between Remainder and Divisor is a negative number.")
                }
                console.log('old quotient', quotient)
                this.undoStack.push(['quotient', quotient])
            }else if(this.currStep == 2){
                this.steps[this.currStep]()
                this.iteration++
                console.log("Divisor shifts to the right.")
                this.undoStack.push(['divisor', divisor])
            }
            
        }else{
            console.log("This computation has concluded kindly sod off")
        }
        
        this.currStep++
        this.currStep %= this.steps.length

        if(returnValue !== undefined){
            return returnValue
        }
    }
    this.undo = () => {
        if (this.undoStack.length != 0) {
            if (this.currStep == 0) {
                this.iteration--
                this.currStep = 2
            } else {
                this.currStep--
            }
            return this.undoStack.pop()
        } else {
            console.log("You have undone all your vile work")
        }
    }
    this.render = () => {
        return this.body
    }
}