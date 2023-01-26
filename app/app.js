import Multiplicand from './components/multiplicand.js'
import Multiplier from './components/multiplier.js'    
import Product from './components/product.js'
import Control from './components/control.js'
import ALU from './components/ALU.js'
import formater from './middleware/formatMiddleware.js'

const app = document.querySelector("#main")
const button = document.querySelector("button")

const mulLocal = new Multiplicand()
const mulpLocal = new Multiplier()
const product = new Product(8)
const controlLocal = new Control()
const formaterLocal = new formater()
const ALULocal = new ALU()

ALULocal.steps.push(mulLocal.shiftL)
ALULocal.steps.push(mulpLocal.shiftR)
ALULocal.steps.push(formaterLocal.addBin)

button.addEventListener("click", e=> {
    const test = ALULocal.stepFunc(product.value, mulLocal.value)
    console.log(test)
    if(test) {
        product.set(test)
    }
    app.innerHTML = mulLocal.render() + mulpLocal.render() + product.render() + controlLocal.body
})

app.innerHTML = mulLocal.render() + mulpLocal.render() + product.render() + controlLocal.body