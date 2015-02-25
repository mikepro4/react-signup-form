/** @jsx React.DOM */
var React = require('react/addons');
var CreateAccountScreen = require('./CreateAccountScreen.js');

var App = React.createClass({
  render: function() {
    return (
      <div className="application_wrapper">
        <CreateAccountScreen/>
      </div>
    );
  }
  
});
  
module.exports = App;