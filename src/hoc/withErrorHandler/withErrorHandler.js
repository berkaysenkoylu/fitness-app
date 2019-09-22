import React, { Component } from 'react';

import Modal from '../../components/UI/Modal/Modal';
import Auxillary from '../Auxillary/Auxillary';

const withErrorHandler = (WrappedComponent, axios) => {
    return class extends Component {
        state = {
            error: null
        }

        constructor(props) {
            super(props);

            // First clear any errors leftover from the previous http calls
            this.requestInterceptor = axios.interceptors.request.use(req => {
                this.setState({error: null});
                return req;
            });

            this.responseInterjector = axios.interceptors.response.use(res => res, error => {
                this.setState({error: error});
            });
        }

        componentWillMount() {
            axios.interceptors.request.eject(this.requestInterceptor);
            axios.interceptors.response.eject(this.responseInterjector);
        }

        errorConfirmedHandler = () => {
            this.setState({error: null});
        }

        render() {
            console.log(this.state.error);
            return (
                <Auxillary>
                    <Modal 
                        show={this.state.error}
                        modalClosed={this.errorConfirmedHandler}>
                        {this.state.error ? this.state.error : null}
                    </Modal>
                    <WrappedComponent { ...this.props } />
                </Auxillary>
            );
        }
    } 
}


export default withErrorHandler;
