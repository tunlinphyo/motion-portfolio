import { animate, scroll, timeline } from "motion"
import { ElementBase } from "../../scripts/base"

export class Yomiuri extends ElementBase {
    constructor(readonly selector: string) {
        super(selector)
    }

    protected init(): void | Promise<undefined> {
        const isMediumAndLarge = this.matchMedia('(min-width: 768px)')
        const isSmall = this.matchMedia('(max-width: 767px)')

        if (isMediumAndLarge) {
            this.animateHorizontalScroll()
            this.animateIntro()
        }
        this.animateShops(isSmall)
    }

    private animateHorizontalScroll() {
        const isLarge = this.matchMedia('(min-width: 1280px)')
        const horizontal = this.$('.flex-container')
        const sections = this.$All('section')
        const gap = isLarge ? 20 : 15
        const width = Array.from(sections).reduce((acc, section) => acc + section.clientWidth + gap, gap)

        const scrollWidth = width - window.innerWidth

        scroll(
            animate(horizontal, {
                transform: ['translateX(0px)', `translateX(-${scrollWidth}px)`]
            }, { easing: 'linear' }),
            {
                target: this.elem,
                offset: ['start start', 'end end']
            }
        )
    }

    private animateIntro() {
        const intro = this.$('.intro')
        const title = this.$('h1', intro)

        scroll(
            animate(title, { transform: 'translateX(50vh)' }, { easing: 'linear' }),
            {
                target: this.elem,
                offset: ['start start', '125vh start']
            }
        )
    }

    private animateShops(isSmall: boolean = false) {
        const shops = this.$('.shops')
        const colOne = this.$('.col--one', shops)
        const colTwo = this.$('.col--two', shops)
        const colThree = this.$('.col--three', shops)

        const reset = isSmall ? 'translateX(0vw)' : 'translateY(0vh)'
        const small = isSmall ? 'translateX(-50vw)' : 'translateY(-40vh)'
        const large = isSmall ? 'translateX(-60vw)' : 'translateY(-60vh)'

        scroll(
            timeline(
                [
                    [colOne, { transform: [small, reset] }, { easing: 'linear' }],
                    [colTwo, { transform: [reset, large] }, { easing: 'linear', at: 0 }],
                    [colThree, { transform: [large, reset] }, { easing: 'linear', at: 0 }],
                ]
            ), {
                target: this.elem,
                offset: ['start start', '260vh start']
            }
        )
    }
}