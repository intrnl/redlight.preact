import { h, render } from 'preact';
// import 'preact/debug';
// import 'preact/devtools';

import '~/src/styles/reset.css';
import '~/src/styles/base.css';
import { App } from '~/src/components/app';


render(<App />, document.getElementById('root'));
