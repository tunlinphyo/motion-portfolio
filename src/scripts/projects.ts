import { ValueKeyframesDefinition, animate, glide, inView, scroll, spring, stagger, timeline } from "motion"
import { ElementBase } from "./base"
import SplitType from "split-type"

export class Projects extends ElementBase {
    constructor(readonly selector: string) {
        super(selector)
    }

    protected init(): void {
        const projects = this.$All<HTMLDivElement>('.work')

        this.animateProjects(projects)
    }

    private animateProjects(elems: NodeListOf<HTMLDivElement>) {
        Array.from(elems).forEach((elem) => {
            const media = this.$<HTMLDivElement>('.work-media', elem)
            const mediaLayer = this.$<HTMLDivElement>('.work-media .layer', elem)
            const group = elem.parentElement as HTMLElement
            const button = this.$<HTMLButtonElement>('.btn-open', group)
            const iframeContainer = this.$<HTMLDivElement>('#websiteIframe', document)

            this.animateLayer(elem, mediaLayer)
            this.animateMedia(elem, media)
            this.animateDetails(group)

            if (button) {
                this.showButton(group, button)

                this.subscribe(button, iframeContainer)
            }
        })
    }

    private subscribe(elem: HTMLButtonElement, container: HTMLElement) {
        elem.addEventListener('click', () => {
            if (elem.dataset.src) {
                this.flipFrame(elem, container)
            }
        })
    }

    private async flipFrame(elem: HTMLButtonElement, container: HTMLElement) {
        const isClass = container.classList.contains('opened')
        const iframe = this.$<HTMLIFrameElement>('.iframe', container)
        const url = elem.dataset.src as string

        const startRect = container.getBoundingClientRect()
        container.classList.toggle('opened', !isClass)
        const endRect = container.getBoundingClientRect()

        const borderRadius: ValueKeyframesDefinition = isClass ? ['0px', '42px'] : ['42px', '0px']

        if (isClass) {
            container.style.pointerEvents = 'none'
            iframe.src = ''
            iframe.style.opacity = '0'
            this.buttonOpen(elem)
            this.enableScroll()
        } else {
            container.style.pointerEvents = 'auto'
            this.buttonClose(elem)
            this.disableScroll()
        }

        await animate(
            container,
            {
                left: [`${startRect.left}px`, `${endRect.left}px`],
                top: [`${startRect.top}px`, `${endRect.top}px`],
                width: [`${startRect.width}px`, `${endRect.width}px`],
                height: [`${startRect.height}px`, `${endRect.height}px`],
                opacity: [1, 1],
                borderRadius
            }, 
            { duration: .6 }
        ).finished
        container.removeAttribute('style')
        if (isClass) {
            container.style.opacity = '0'
        } else {
            container.style.opacity = '1'
            iframe.src = url
            iframe.style.opacity = '1'
        }
    }

    private buttonClose(elem: HTMLButtonElement) {
        timeline(
            [
                [ this.$('.text', elem), { transform: ['scale(1)', 'scale(0)'], opacity: [1, 0] }, { duration: .2 }],
                [ this.$('.icon', elem), { transform: ['rotate(0deg)', 'rotate(-135deg)'] }, { duration: .5, at: .1, easing: 'ease' }],
                [ elem, { width: ['170px', '42px'] }, { duration: .5, at: .1 }],
            ]
        )
    }

    private buttonOpen(elem: HTMLButtonElement) {
        timeline(
            [
                [ this.$('.icon', elem), { transform: ['rotate(-135deg)', 'rotate(0deg)'] }, { duration: .5, easing: 'ease' }],
                [ elem, { width: ['42px', '170px'] }, { duration: .5, at: 0, easing: spring() }],
                [ this.$('.text', elem), { transform: ['scale(0)', 'scale(1)'], opacity: [0, 1] }, { duration: .2, at: '-0.8' }],
            ]
        )
    }

    private animateLayer(target: HTMLDivElement, elem: HTMLElement) {
        scroll(
            animate(
                elem,
                { opacity: [1, 0] }
            ),
            {
                target,
                offset: ['start start', 'end center']
            }
        )
    }

    private animateMedia(target: HTMLDivElement, elem: HTMLElement) {
        scroll(
            animate(
                elem,
                { scale: [1, .8] }
            ), 
            {
                target,
                offset: ['start -50%', 'end start']
            }
        )
    }

    private animateDetails(group: HTMLElement) {
        const details = this.$All('.row', group)

        inView(details, (info) => {
            const elem = info.target as HTMLElement
            const cols = this.$All('.col', elem)

            animate(
                cols,
                {
                    transform: ['translateY(200px)', 'tranlateY(0)'],
                    opacity: [0, 1]
                }, {
                    easing: glide({ velocity: -5 })
                }
            )
        }, { amount: .8 })
    }

    private showButton(target: HTMLElement, elem: HTMLButtonElement) {
        const handler = this.handleInView()

        scroll(
            ({ y }) => {
                handler(y.progress, () => {
                    timeline(
                        [
                            [ elem, { transform: ['scale(0)', 'scale(1)'], width: ['42px', '42px'], opacity: [0, 1] }, { duration: 1, easing: [0.34, 3, 0.64, 1] }], // [0.34, 3, 0.64, 1] 
                            [ elem, { width: ['42px', '170px'] }, { duration: .5, delay: .1, easing: spring() }],
                            [ this.$('.text', elem), { transform: ['scale(0)', 'scale(1)'], opacity: [0, 1] }, { duration: .2, at: '-0.8', easing: 'ease' }],
                        ]
                    )
                }, () => {
                    timeline(
                        [
                            [ this.$('.text', elem), { transform: ['scale(1)', 'scale(0)'], opacity: [1, 0] }, { duration: .2 }],
                            [ elem, { width: ['170px', '42px'] }, { duration: .3 }],
                            [ elem, { transform: ['scale(1)', 'scale(0)'], width: ['42px', '42px'], opacity: [1, 0] }, { duration: .3, delay: .1 }],
                        ]
                    )
                })
            }, {
                target,
                offset: ['start center', 'end end']
            }
        )
    }
}