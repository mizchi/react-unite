// x-pane

const defaultPaneStyle = document.createElement("style");
defaultPaneStyle.textContent = `
  :host {
    align-items: center;
    border-width: 0;
    border-style: solid;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    height: 100%;
    justify-content: center;
    margin: 0;
    min-height: 0;
    min-width: 0;
    padding: 0;
    position: relative;
    width: 100%;
    z-index: 0;
  }
`;

customElements.define(
  "x-pane",
  class extends HTMLElement {
    constructor() {
      super();
      const shadow = this.attachShadow({ mode: "open" });
      shadow.appendChild(document.importNode(defaultPaneStyle, true));
      shadow.appendChild(document.createElement("slot"));
    }
  }
);

declare namespace JSX {
  interface IntrinsicElements {
    "x-pane": React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement>,
      HTMLElement
    >;
  }
}
