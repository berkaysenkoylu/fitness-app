import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import * as actions from '../../../store/actions/index';
import classes from './Login.module.css';
import Input from '../../../components/UI/Input/Input';
import Button from '../../../components/UI/Button/Button';
import Modal from '../../../components/UI/Modal/Modal';

class Login extends Component {
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

    inputChangedHandler = (event, inputField) => {
        const copiedFormControls = {
            ...this.state.formControls
        };

        const copiedFormControlElement = {
            ...copiedFormControls[inputField]
        };

        copiedFormControlElement.value = event.target.value;
        copiedFormControlElement.valid = this.checkValidity(event.target.value, copiedFormControlElement.validation);
        copiedFormControlElement.touched = true;

        copiedFormControls[inputField] = copiedFormControlElement;

        // Check the validity of the form
        let isValid = true;
        Object.keys(copiedFormControls).forEach(formControl => {
            isValid = isValid && copiedFormControls[formControl].valid;
        });

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

        this.props.onLogin(userData);

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
                touched={this.state.formControls[formControl].touched}
                isValid={this.state.formControls[formControl].valid}
                changed={(event) => this.inputChangedHandler(event, formControl)}
                 />
        })

        let form = (
            <form onSubmit={(event) => this.onSubmitHandler(event)}>
                {formFields}
                <Button btnType="Primary" disabled={!this.state.isFormValid}>LOGIN</Button>
            </form>
        );

        let redirect = null;
        if(this.props.isAuthenticated){
            redirect = <Redirect to='/' />
        }
        
        return (
            <div>
                <Modal show={this.props.error !== null && this.state.showError} modalClosed={this.closeErrorSection}>
                    {this.props.error}
                </Modal>
                <div>
                    <h2 style={{color: '#0044ff'}}>LOGIN</h2>
                    <div className={classes.LoginForm}>
                        {form}
                    </div>
                    {redirect}
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        isAuthenticated: state.userToken !== null,
        error: state.error
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onLogin: (userData) => {dispatch(actions.login(userData))}
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
