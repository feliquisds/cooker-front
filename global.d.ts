export {};

declare global {
    namespace JSX {
        interface Element {}
        interface ElementClass {}
        interface ElementAttributesProperty {}
        interface ElementChildrenAttribute {}

        interface IntrinsicElements {
            [elemName: string]: any;
        }
    }
}