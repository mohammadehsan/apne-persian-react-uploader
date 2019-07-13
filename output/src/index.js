import React from 'react';
import ReactDOM from 'react-dom';
import Uploader from '../../src/index';


const App = () => {
    return (
        <Uploader uploadUrl="url"/>
    )
};

ReactDOM.render(<App/>, document.getElementById('root'));
