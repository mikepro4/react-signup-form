/** @jsx React.DOM */
var React = require('react/addons');
var _ = require('underscore');
var Icon = require('./Icon.js');
var InputError = require('./InputError.js');
var PasswordValidator = require('./PasswordValidator.js');

var cx = React.addons.classSet;


var Input = React.createClass({

  getInitialState: function(){
    var valid = (this.props.isValid && this.props.isValid()) || true;

    return {
      valid: valid,
      empty: _.isEmpty(this.props.value),
      focus: false,
      value: null,
      iconsVisible: !this.props.validator,
      errorMessage: this.props.emptyMessage,
      validator: this.props.validator,
      validatorVisible: false,
      type: this.props.type,
      minCharacters: this.props.minCharacters,
      requireCapitals: this.props.requireCapitals,
      requireNumbers: this.props.requireNumbers,
      forbiddenWords: this.props.forbiddenWords,
      isValidatorValid: {
        minChars: false,
        capitalLetters: false,
        numbers: false,
        words: false,
        all: false
      },
      allValidatorValid: false
    };
  },

  handleChange: function(event){
    this.setState({
      value: event.target.value,
      empty: _.isEmpty(event.target.value)
    });

    if(this.props.validator) {
      this.checkRules(event.target.value)
    }

    // call input's validation method
    if(this.props.validate) {
      this.validateInput(event.target.value);
    }

    // call onChange method on the parent component for updating it's state
    if(this.props.onChange) {
      this.props.onChange(event);
    }
  },

  validateInput: function (value) {
    // trigger custom validation method in the parent component
    if(this.props.validate && this.props.validate(value)){
      this.setState({
        valid: true,
        errorVisible: false
      });
    } else {
      this.setState({
        valid: false,
        errorMessage: !_.isEmpty(value) ? this.props.errorMessage : this.props.emptyMessage
      });  
    }

  },

  componentWillReceiveProps: function (newProps) {    
    // perform update only when new value exists and not empty  
    if(newProps.value) {
      if(!_.isUndefined(newProps.value) && newProps.value.length > 0) {
        if(this.props.validate) {
          this.validateInput(newProps.value);
        }
        this.setState({
          value: newProps.value,
          empty: _.isEmpty(newProps.value)
        });
      }   
    }
  },

  isValid: function () {
    if(_.isEmpty(this.state.value) || !this.props.validate(this.state.value)) {
      this.setState({
        valid: false,
        errorVisible: true
      });
    }
  },

  handleFocus: function () {
    this.setState({
      focus: true,
      validatorVisible: true
    });

    // hide error when validator is active
    if(this.props.validator) {
      this.setState({
        errorVisible: false
      })
    }
  },

  handleBlur: function () {
    this.setState({
      focus: false,
      errorVisible: !this.state.valid,
      validatorVisible: false
    });
  },

  mouseEnterError: function () {
    this.setState({
      errorVisible: true
    });
  },

  hideError: function () {
    this.setState({
      errorVisible: false,
      validatorVisible: false
    });
  },

  // validator function
  checkRules: function(value) {
    var validData = {
      minChars: !_.isEmpty(value) ? value.length > parseInt(this.state.minCharacters): false,
      capitalLetters: !_.isEmpty(value) ? this.countCapitals(value): false,
      numbers: !_.isEmpty(value) ? this.countNumbers(value) > 0 : false,
      words: !_.isEmpty(value) ? !this.checkWords(value) : false
    }
    var allValid = (validData.minChars && validData.capitalLetters && validData.numbers && validData.words);

    this.setState({
      isValidatorValid: validData,
      allValidatorValid: allValid,
      valid: allValid
    })
  },

  countCapitals: function(value) {
    var str = value;
    return str.replace(/[^A-Z]/g, "").length;
  },

  countNumbers: function(value) {
    return myValue = /\d+/.exec(value)
  },

  checkWords: function(value) {
    return  _.some(this.state.forbiddenWords, function (word) {
      var matched = (word === value) ? true : "";
      return matched
    })
  },

  render: function(){

    var inputGroupClasses = cx({
      'input_group':     true,
      'input_valid':     this.state.valid,
      'input_error':     !this.state.valid,
      'input_empty':     this.state.empty,
      'input_hasValue':  !this.state.empty,
      'input_focused':   this.state.focus,
      'input_unfocused': !this.state.focus
    });

    var validator;

    if(this.state.validator) {
      validator = 
        <PasswordValidator
          ref="passwordValidator"
          visible={this.state.validatorVisible}
          name={this.props.text}
          value={this.state.value}
          validData={this.state.isValidatorValid}
          valid={this.state.allValidatorValid}
          forbiddenWords={this.state.forbiddenWords}
        />
    }

    return (
      <div className={inputGroupClasses}>

        <label className="input_label" htmlFor={this.props.text}>
          <span className="label_text">{this.props.text}</span>
        </label>

        <input 
          {...this.props}
          placeholder={this.props.placeholder} 
          className="input" 
          id={this.props.text}
          defaultValue={this.props.defaultValue} 
          value={this.state.value} 
          onChange={this.handleChange} 
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          autoComplete="off"
        />

        <InputError 
          visible={this.state.errorVisible} 
          errorMessage={this.state.errorMessage} 
        />

        <div className="validationIcons">
          <i className="input_error_icon" onMouseEnter={this.mouseEnterError}> <Icon type="circle_error"/> </i>
          <i className="input_valid_icon"> <Icon type="circle_tick"/> </i>
        </div>

        {validator}

      </div>
    );
  }
});

module.exports = Input;