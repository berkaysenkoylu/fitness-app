import React, { Component } from 'react';
import axiosBodyData from '../../../axios-bodydata';
import { connect } from 'react-redux';

import classes from './BodyData.module.css';
import Input from '../../../components/UI/Input/Input';
import Button from '../../../components/UI/Button/Button';

class BodyData extends Component {
    state = {
        formControls: {
            date: {
                elementType: 'input',
                elementConfig: {
                    type: 'date',
                    placeholder: 'Date'
                },
                validation: {
                    required: true
                },
                valid: false,
                touched: false,
                value: ''
            },
            height: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Your height [cm]'
                },
                validation: {
                    required: true,
                    isNumber: true
                },
                valid: false,
                touched: false,
                value: ''
            },
            weight: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Your weight [kg]'
                },
                validation: {
                    required: true,
                    isNumber: true 
                },
                valid: false,
                touched: false,
                value: ''
            },
            neck: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Your neck circumference [cm]'
                },
                validation: {
                    required: true,
                    isNumber: true       
                },
                valid: false,
                touched: false,
                value: ''
            },
            waist: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Your waist circumference [cm]'
                },
                validation: {
                    required: true,
                    isNumber: true
                },
                valid: false,
                touched: false,
                value: ''
            },
            hip: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Your hip circumference [cm]'
                },
                validation: {
                    required: true,
                    isNumber: true
                },
                valid: false,
                touched: false,
                value: ''
            },
            gender: {
                elementType: 'select',
                elementConfig: {
                    options: [
                        {value: 'male', displayValue: 'Male'},
                        {value: 'female', displayValue: 'Female'}
                    ]
                },
                validation: {},
                valid: true,
                touched: false,
                value: 'male'
            }
        },
        isFormValid: false,
        isEditMode: false,
        fetchedData: {}
    }

    componentDidMount() {
        const query = new URLSearchParams(this.props.location.search);
        let postId = '';
        // eslint-disable-next-line
        for (let param of query.entries()){
            postId = param[1];
        }

        if (postId !== '') {
            const updatedFormControls = {
                ...this.state.formControls
            };
            let config = {
                headers: {
                    'Authorization': 'Bearer ' + this.props.token
                }
            };
            // Get the data that needs editing from backend
            axiosBodyData.get(`/${postId}`, config).then(fetchedData => {
                // Pre-populate the form fields
                Object.keys(this.state.formControls).forEach(formControl => {
                    if(formControl !== 'gender') {
                        const updatedFormElement = {
                            ...updatedFormControls[formControl]
                        };
                        if(formControl === 'date') {
                            let fetchedDate = new Date(fetchedData.data[formControl]);
                            let day, month, year, date;

                            day = fetchedDate.getDate();
                            if (day <10)
                                day = "0" + day;
                            month = fetchedDate.getMonth() + 1;
                            if (month < 10)
                                month = "0" + month;
                            year = fetchedDate.getFullYear();
                            date = year + "-" + month + "-" + day;
                            updatedFormElement.value = date
                        }
                        else {
                            updatedFormElement.value = fetchedData.data[formControl];
                        }

                        updatedFormElement.valid = true;
                        updatedFormElement.touched = true;

                        updatedFormControls[formControl] = updatedFormElement;
                    }
                    
                });

                // Update state
                this.setState({
                    formControls: updatedFormControls,
                    isEditMode: true,
                    fetchedData: fetchedData.data,
                    isFormValid: true
                });
                
            });
        }
    }

    componentDidUpdate(prevProps) {
        // Reset the form
        if(prevProps.location.search !== this.props.location.search){
            const resetedFormControls = {
                ...this.state.formControls
            };
            
            Object.keys(this.state.formControls).forEach(formControl => {
                if(formControl !== 'gender'){
                    const resetedFormElement = {
                        ...resetedFormControls[formControl]
                    };

                    resetedFormElement.value = "";
                    resetedFormElement.valid = false;
                    resetedFormElement.touched = false;

                    resetedFormControls[formControl] = resetedFormElement;
                }
                
            });

            this.setState({
                formControls: resetedFormControls,
                isEditMode: false,
                fetchedData: {},
                isFormValid: false
            });
        }
    }

    checkValidation = (value, rules) => {
        let isValid = true;
 
        if (rules.required) {
            isValid = value.trim() !== '' && isValid;
        }

        if(rules.isNumber) {
            // Test only numbers
            let regExp = new RegExp("^[0-9]+$");
            // Test for floating digits
            let regExpWithChars = new RegExp("^[0-9]{1,2}([,.][0-9]{1,2})?$");
            
            isValid = (regExp.test(value) || regExpWithChars.test(value))  && isValid;
        }

        return isValid;
    }
    
    onInputChangedHandler = (event, inputName) => {
        // First, copy whole form controls
        const updatedFormControls = {
            ...this.state.formControls
        };

        // Then, copy the individual form control
        const updatedFormElement = {
            ...updatedFormControls[inputName]
        };

        // Change the desired value of copied individual form control 
        updatedFormElement.value = event.target.value;
        updatedFormElement.touched = true;
        if(updatedFormElement.validation !== null){
            updatedFormElement.valid = this.checkValidation(event.target.value, updatedFormElement.validation);
        }
        
        // Update the contents of the copied form controls
        updatedFormControls[inputName] = updatedFormElement;

        // Check the validity of the form
        let formIsValid = true;
        Object.keys(updatedFormControls).forEach(formControl => {
            formIsValid = formIsValid && updatedFormControls[formControl].valid;
        });

        // Update the state by using the copied form controls object
        this.setState({
            formControls: updatedFormControls,
            isFormValid: formIsValid
        });
    }

    formOnSubmitHandler = (event) => {
        event.preventDefault();

        const copiedForm = {...this.state.formControls};

        let bodyFatPercentage = null;

        if(this.state.formControls.gender.value === 'male'){
            bodyFatPercentage = (495 / (1.0324 - 0.19077 * Math.log10(parseFloat(copiedForm.waist.value) - parseFloat(copiedForm.neck.value)) 
                + 0.15456 * Math.log10(parseFloat(copiedForm.height.value)))) - 450;
        } 
        else 
        {
            bodyFatPercentage = (495 / (1.29579 - 0.35004 * Math.log10(parseFloat(copiedForm.waist.value) + parseFloat(copiedForm.hip.value) 
                - parseFloat(copiedForm.neck.value)) + 0.22100 * Math.log10(parseFloat(copiedForm.height.value)))) - 450;
        }
  
        const userId = localStorage.getItem("userId");

        const bodyData = {
            userId: userId,
            date: new Date(copiedForm.date.value),
            height: parseFloat(copiedForm.height.value),
            weight: parseFloat(copiedForm.weight.value),
            neck: parseFloat(copiedForm.neck.value),
            waist: parseFloat(copiedForm.waist.value),
            hip: parseFloat(copiedForm.hip.value),
            bodyFat: Math.floor(bodyFatPercentage * 100) / 100
        };

        if(!this.state.isEditMode) {
            // Not in edit mode
            let config = {
                headers: {
                    'Authorization': 'Bearer ' + this.props.token
                }
            };

            axiosBodyData.post('', bodyData, config).then(res => {
                this.props.history.push('/body');
            }).catch(error => {
                console.log(error.message);
            });
        }
        else {
            // In edit mode
            const editedBodyData = {
                _id: this.state.fetchedData._id,
                ...bodyData
            }
            let config = {
                headers: {
                    'Authorization':'Bearer ' + this.props.token
                }
            };
            axiosBodyData.put('' + this.state.fetchedData._id, editedBodyData, config).then(response => {
                this.props.history.push('/body');
            }).catch(error => {
                console.log(error);
            });
        }
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
            <form onSubmit={(event) => this.formOnSubmitHandler(event)}>
                {formFields}
                <Button btnType='Success' disabled={!this.state.isFormValid}>SUBMIT</Button>
            </form>
        )

        return (
            <div className={classes.BodyData}>
                <h2>Enter your body values</h2>
                {form}
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        token: state.userToken
    };
};

export default connect(mapStateToProps, null)(BodyData);