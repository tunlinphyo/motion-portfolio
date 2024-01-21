import SplitType from "split-type"
import { ElementBase } from "./base"
import { animate, AnimationOptionsWithOverrides, glide, inView, scroll, ScrollOptions, spring, stagger } from "motion"

export class Header extends ElementBase {
    constructor(readonly selector: string) {
        super(selector)
    }

    protected async init(): Promise<undefined> {
        const scrollOptions: ScrollOptions = {
            target: this.elem,
            offset: ["start start", `end 60px`]
        }

        this.animateContainer(scrollOptions)
        this.animateButtons()
        await this.animateEnter()
        this.animateMouse()

        this.subscribe()

        return        
    }

    private subscribe() {
        this.$('#me').addEventListener('click', async () => {
            const jumper = this.$('.jumper', document)
            await animate(jumper, {
                transform: ['translateX(100%) scaleX(0)', 'translateX(0) scaleX(1)'],
                opacity: [1, 1]
            }, {
                easing: glide({ velocity: 10 }),
            }).finished

            this.elem.scrollIntoView({
                behavior: 'instant',
                block: 'start'
            })

            animate(jumper, {
                transform: ['translateX(0) scaleX(1)', 'translateX(-100%) scaleX(0)'],
                opacity: [1, 1]
            }, {
                easing: glide({ velocity: 10 }),
            })
        })

        this.$('#callToAction').addEventListener('click', async () => {
            await animate(this.$('.jumper', document), {
                transform: ['translateX(-100%) scaleX(0)', 'translateX(0) scaleX(1)'],
                opacity: [1, 1]
            }, {
                easing: glide({ velocity: 10 }),
            }).finished

            this.$('.footer', document).scrollIntoView({
                behavior: 'instant',
                block: 'start'
            })

            animate(this.$('.jumper', document), {
                transform: ['translateX(0) scaleX(1)', 'translateX(100%) scaleX(0)'],
                opacity: [1, 1]
            }, {
                easing: glide({ velocity: 10 }),
            })
        })
    }

    private async animateEnter() {
        const hello = new SplitType('.header .hello', { types: 'chars' })
        const heading = new SplitType('#me', { types: 'chars' })
        const headerIntro = this.$('.intro')
        const intro = new SplitType('.header .intro', { types: 'chars' })

        await animate(
            [ ...(hello.chars) as HTMLElement[],...(heading.chars) as HTMLElement[] ],
            {
                transform: ['translateX(80px)', 'translateX(0px)'],
                opacity: [0, 1]
            }, {
                delay: stagger(0.08),
            }
        ).finished
        headerIntro.classList.add('ready')
        await animate(
            [ ...intro.chars as HTMLElement[] ],
            {
                transform: ['translateX(10px)', `translateX(0px)`],
                opacity: [0, 1]
            },
            {
                delay: stagger(0.01),
            }
        ).finished
        

        return
    }

    private animateContainer(scrollOptions: ScrollOptions) {
        const container = this.$('.header-container')
        const title = this.$('h1', container)
        const texts = this.$All('div', title)

        const options: AnimationOptionsWithOverrides = { easing: 'linear', duration: 0 }

        scroll(
            animate(
                container, 
                { height: ['100vh', '60px'] },
                options
            ),
            scrollOptions
        )

        scroll(
            animate(
                title, 
                { fontSize: ['clamp(2.5rem, 12vw, 11rem)', '1.2rem'] },
            ),
            scrollOptions
        )

        scroll(
            animate(
                texts, 
                { opacity: 0 },
            ),
            {
                target: this.elem,
                offset: ["start -10vh", "end 40vh"]
            }
        )
    }

    private animateMouse() {
        const mouse = this.$('#callToAction')

        inView(this.elem, () => {
            animate(mouse, { y: ['300px', '0px'] }, { easing: spring({ velocity: 10, damping: 13 }) })
            return () => {
                animate(mouse, { y: ['0px', '300px'] }, { easing: spring({ velocity: 10, damping: 13 }) })
            }
        }, { amount: .8 })
    }

    private animateButtons() {
        const buttons = this.$All<HTMLAnchorElement>('.buttons .button')

        scroll(
            animate(buttons, { scale: [0, 1], opacity: [0, 1] }),
            {
                target: this.elem,
                offset: ["end 60px", "end -60px"]
            },
        )
    }
}