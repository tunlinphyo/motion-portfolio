import { ScrollOptions, TimelineDefinition, animate, inView, scroll, spring, stagger, timeline } from "motion"
import { ElementBase } from "./base"

export class Technical extends ElementBase {
    constructor(readonly selector: string) {
        super(selector)
    }

    protected init(): void {
        const container = this.$<HTMLDivElement>('.technical-container')
        const isSmall = this.matchMedia('(max-width: 600px)')

        this.animateCircle(container, isSmall)
        this.animateCards(isSmall)
        this.animateEnd()
    }

    private animateCircle(elem: HTMLDivElement, isSmall: boolean) {
        const size = `${isSmall ? 140 : 180}px`

        const scrollOptions: ScrollOptions = {
            target: this.elem,
            offset: ["start center", "start 30px"]
        }

        scroll(
            animate(
                elem,
                {
                    width: [size, '100vw'],
                    height: [size, 'calc(100vh - 60px)'],
                    borderRadius: [size, '0px']
                }, { easing: 'linear', duration: 0 }
            ),
            scrollOptions
        )
    }

    private animateCards(isSmall: boolean) {
        const cards = this.$All<HTMLDivElement>('.card')
        const sequences: TimelineDefinition = []
        
        Array.from(cards).forEach((card) => {
            sequences.push([
                card, 
                { transform: ['translateX(100vw) scale(.7) rotate(15deg)', 'none'] }, 
                { easing: 'linear' }
            ])

            inView(card, () => {
                this.animateSkills(card)
            }, { amount: isSmall ? .5 : .8 })
        })
        
        scroll(
            timeline(
                sequences,
                { duration: 3 }
            ),
            {
                target: this.elem,
                offset: [(isSmall ? "start start" : "start center"), "end end"],
            }
        )
    }

    private async animateSkills(elem: HTMLElement) {
        const container = this.$('.technical--content', elem)
        const skills = this.$All('.skill-circle', container)
        const icons = this.$All('.technical--skill', elem)
        const list = this.$All('p', container)

        console.log(list)

        if (list.length) {
            animate(list, {
                opacity: [0, 1],
                transform: ['scale(0)', 'scale(1)']
            }, {
                duration: .5,
                delay: stagger(0.05)
            }).finished
        } else {
            await animate(icons, {
                // opacity: [0, 1],
                transform: ['scale(0)', 'scale(1)']
            }, {
                duration: .5,
                delay: stagger(0.05)
            }).finished
    
            Array.from(skills).forEach((skill) => {
                const offset = skill.dataset.offset
    
                animate(skill, {
                    strokeDashoffset: offset,
                }, {
                    easing: spring({ stiffness: 10, damping: 20 })
                })
            })
        }
    }

    private animateEnd() {
        scroll(
            animate(this.elem, { transform: 'scale(.8)', borderRadius: ['0px', '10px'] }),
            {
                target: this.elem,
                offset: ["end end", "end start"]
            }
        )
    }
}