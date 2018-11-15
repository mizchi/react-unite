// x-view: react-native's View like element
// See https://github.com/necolas/react-native-web/blob/master/packages/react-native-web/src/exports/View/index.js#L72-L84

const defaultViewStyle = document.createElement("style");
defaultViewStyle.textContent = `
  :host {
    border-width: 0;
    border-style: solid;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    margin: 0;
    padding: 0;
    position: relative;
    z-index: 0;
    min-height: 0;
    min-width: 0;
  }
`;

customElements.define(
  "x-view",
  class extends HTMLElement {
    constructor() {
      super();
      const shadow = this.attachShadow({ mode: "open" });
      shadow.appendChild(document.importNode(defaultViewStyle, true));
      shadow.appendChild(document.createElement("slot"));
    }
  }
);

declare namespace JSX {
  interface IntrinsicElements {
    "x-view": React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement>,
      HTMLElement
    >;
  }
}
