// import React from 'react';
// import ReactDOM from 'react-dom';
// import App from '../src/App';

// it('renders without crashing', () => {
//     const div = document.createElement('div');
//     ReactDOM.render(<App/>, div);
//     ReactDOM.unmountComponentAtNode(div);
// });

const App = require('../src/App.js');

test('adds 1 + 2 to equal 3', () => {
    console.log('App', App);
    // expect(sum(1, 2)).toBe(3);
});
