import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import * as actions from '../../../store/actions/index';

import classes from './Signup.module.css';
import Input from '../../../components/UI/Input/Input';
import Button from '../../../components/UI/Button/Button';
import Modal from '../../../components/UI/Modal/Modal';

class Signup extends Component {
    state = {
        formControls: {
            email: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'E-mail'
                },
                validation: {
                    required: true,
                    isEmail: true
                },
                valid: false,
                touched: false,
                value: ''
            },
            password: {
                elementType: 'input',
                elementConfig: {
                    type: 'password',
                    placeholder: 'Password'
                },
                validation: {
                    required: true,
                    minLength: 6
                },
                valid: false,
                touched: false,
                value: ''
            }
        },
        isFormValid: false,
        showError: true
    }

    checkValidity = (value, rules) => {
        let isValid = true;

        if (rules.required) {
            isValid = value.trim() !== '' && isValid;
        }

        if (rules.maxLength) {
            isValid = value.length <= rules.maxLength && isValid;
        }

        if (rules.minLength) {
            isValid = value.length >= rules.minLength && isValid;
        }

        if (rules.isEmail) {
            const pattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
            isValid = pattern.test(value) && isValid;
        }

        if (rules.isNumeric) {
            const pattern = /^\d+$/;
            isValid = pattern.test(value) && isValid;
        }

        return isValid;
    }

    onInputChangedHandler = (event, fieldName) => {
        // Copy the upper most element first
        const copiedFormControls = {
            ...this.state.formControls
        };
        // Then copy the one which is beneath the upper most element
        const copiedFormElement = {
            ...copiedFormControls[fieldName]
        };

        // Change the values that need changing
        copiedFormElement.value = event.target.value;
        copiedFormElement.touched = true;
        copiedFormElement.valid = this.checkValidity(event.target.value, copiedFormElement.validation);

        // Update the copied form controls
        copiedFormControls[fieldName] = copiedFormElement;

        // Check if the whole form is valid
        let isValid = true;
        Object.keys(copiedFormControls).forEach(formControl => {
            isValid = isValid && copiedFormControls[formControl].valid
        });

        // Update the state
        this.setState({
            formControls: copiedFormControls,
            isFormValid: isValid
        });
    }
    
    onSubmitHandler = (event) => {
        event.preventDefault();

        const userData = {
            email: this.state.formControls.email.value,
            password: this.state.formControls.password.value
        };

        // Dispatch an action
        this.props.onSignupSubmit(userData);

        this.setState({
            showError: true
        });
    }

    closeErrorSection = () => {
        this.setState({
            showError: false
        });
    }

    render() {
        let formFields = Object.keys(this.state.formControls).map(formControl => {
            return <Input
                key={formControl}
                elementType={this.state.formControls[formControl].elementType}
                elementConfig={this.state.formControls[formControl].elementConfig}
                value={this.state.formControls[formControl].value}
                isValid={this.state.formControls[formControl].valid}
                touched={this.state.formControls[formControl].touched}
                changed={(event) => this.onInputChangedHandler(event, formControl)} />
        });

        let form = (
            <form onSubmit={(event) => this.onSubmitHandler(event)}>
                {formFields}
                <Button btnType="Primary" disabled={!this.state.isFormValid}>SIGNUP</Button>
            </form>
        )

        let redirect = null;
        if(this.props.isSignupSuccessful) {
            redirect = <Redirect to="/" />
        }
        
        return (
            <div>
                <Modal show={this.props.error && this.state.showError} modalClosed={this.closeErrorSection}>
                    {this.props.error}
                </Modal>
                <h2 style={{color: '#0044ff'}}>SIGN UP</h2>
                <div className={classes.SignupForm}>
                    {form}
                </div>
                {redirect}
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        isLoading: state.loading,
        isSignupSuccessful: state.userToken !== null ? true : false,
        error: state.error
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onSignupSubmit: (userData) => {dispatch(actions.signup(userData))}
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Signup);