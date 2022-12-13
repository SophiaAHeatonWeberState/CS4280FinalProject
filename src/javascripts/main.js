// Required by Webpack - do not touch
require.context('../', true, /\.(html|json|txt|dat)$/i)
require.context('../images/', true, /\.(gif|jpg|png|svg|eot|ttf|woff|woff2)$/i)
require.context('../stylesheets/', true, /\.(css|scss)$/i)

// First: Set up your name
let std_name = "Sophia Heaton"
document.querySelector('#std_name').innerHTML = `<strong>${std_name}</strong>`

import{outside} from './outside'
import{insidehouse} from './inside'

import * as dat from 'dat.gui'


//import {OBJLoader} from 'three/examples/jsm/loaders/OBJLoader.js';
//import {MTLLoader} from 'three/examples/jsm/loaders/MTLLoader.js';

if (document.querySelector('#inside'))  {
    insidehouse();
}
else {
    outside();
}