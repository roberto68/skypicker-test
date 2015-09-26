require('bootstrap/dist/css/bootstrap.min.css')
require('react-widgets/dist/css/react-widgets.css')

var React = require('react')
var {Provider} = require('react-redux')

var AddTravel = require('./AddTravel')
var configureStore = require('./configureStore')

var store = configureStore()

React.render(<Provider store={store}>{() => <AddTravel/>}</Provider>, document.querySelector('#app'))