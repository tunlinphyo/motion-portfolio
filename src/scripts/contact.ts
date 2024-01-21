import SplitType from "split-type"
import { ElementBase } from "./base"
import { animate, glide, inView, spring, stagger } from "motion"

export class Contact extends ElementBase {
    constructor(readonly selector: string) {
        super(selector)
    }

    protected init(): void | Promise<undefined> {

        this.animateLinks()
        this.animateMouse()

        this.subscribe()
    }

    private subscribe() {
        this.$('#goToTop').addEventListener('click', async () => {
            await animate(this.$('.jumper', document), {
                transform: ['translateX(100%) scaleX(0)', 'translateX(0) scaleX(1)'],
                opacity: [1, 1]
            }, {
                duration: .5,
                easing: glide({ velocity: 10 }),
            }).finished

            this.$('.header', document).scrollIntoView({
                behavior: 'instant',
                block: 'start'
            })

            animate(this.$('.jumper', document), {
                transform: ['translateX(0) scaleX(1)', 'translateX(-100%) scaleX(0)'],
                opacity: [1, 1]
            }, {
                duration: .5,
                delay: .1,
                easing: glide({ velocity: 10 }),
            })
        })
    }

    private animateLinks() {
        const rows = this.$All('.row')
        
        Array.from(rows).forEach((row) => {
            const link = this.$('a', row)
            const splitLink = new SplitType(link, { types: 'chars' })
            inView(
                row,
                () => {
                    animate(splitLink.chars as HTMLElement[], {
                        transform: ['translateX(60px)', 'translateX(0px)'],
                        opacity: [0, 1]
                    }, {
                        delay: stagger(0.02)
                    })
                    return () => {
                        animate(splitLink.chars as HTMLElement[], {
                            opacity: [1, 0]
                        })
                    }
                }, {
                    amount: 1
                }
            )
        })
    }

    private animateMouse() {
        const mouse = this.$('#goToTop')

        inView(this.elem, () => {
            console.log('ENTER')
            animate(mouse, { y: ['300px', '0px'] }, { easing: spring({ velocity: 10, damping: 13 }) })
            return () => {
                console.log('LEAVE')
                animate(mouse, { y: ['0px', '300px'] }, { easing: spring({ velocity: 10, damping: 13 }) })
            }
        }, { amount: .8 })
    }

}