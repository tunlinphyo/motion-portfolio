import { Contact } from './scripts/contact'
import { Header } from './scripts/header'
import { Projects } from './scripts/projects'
import { Technical } from './scripts/technical'
import './style.css'

document.addEventListener('DOMContentLoaded', () => {
    new Header('.header')
    new Technical('.technical > .container')
    new Projects('.works-container')
    new Contact('.footer')
})
