import disableScroll from "./disabled-scroll"

export class ElementBase {
    protected elem: HTMLElement

    constructor(readonly selector: string) {
        this.elem = this.$(selector, document)
        this.init()
    }

    protected init(): void | Promise<undefined> {
        console.log(this.elem)
    }

    protected matchMedia(media: string): boolean {
        const mediaQuery = window.matchMedia(media)

        return mediaQuery.matches
    }

    protected mapRange(
        number: number,
        startRange1: number, endRange1:
        number, startRange2: number, endRange2: number
    ): number {
        if (number < startRange1) {
            number = startRange1
        } else if (number > endRange1) {
            number = endRange1
        }

        const range1 = endRange1 - startRange1
        const range2 = endRange2 - startRange2

        const mappedValue =
            ((number - startRange1) * range2) / range1 + startRange2

        return mappedValue
    }

    protected $<T extends HTMLElement>(selector: string, parent?: HTMLElement | Document): T {
        return (parent || this.elem).querySelector(selector) as T
    }

    protected $All<T extends HTMLElement>(selector: string, parent?: HTMLElement | Document): NodeListOf<T> {
        return (parent || this.elem).querySelectorAll(selector) as NodeListOf<T>
    }

    protected setProperty(elem: HTMLElement, property: string, value: string | number): void {
        elem.style.setProperty(property, String(value))
    }

    protected handleInView() {
        let opened = false
        
        return (progress: number, onEnter: () => void, onLeave: () => void) => {
            if (opened && (progress === 0 || progress === 1)) {
                opened = false
                onLeave()
            }
            if (!opened && (progress > 0 && progress < 1)) {
                opened = true
                onEnter()
            }
        }
    }

    protected disableScroll(elem?: Element): void {
        disableScroll.on(elem)
    }

    protected enableScroll(): void {
        disableScroll.off()
    }
}