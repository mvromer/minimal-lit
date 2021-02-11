import { component, html } from 'haunted';

const App = ({ name }) => {
  return html`
    <h1>Hello, ${name}</h1>
  `;
}

App.observedAttributes = ['name'];

customElements.define('app-root', component(App));
