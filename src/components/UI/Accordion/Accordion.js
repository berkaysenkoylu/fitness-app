import React, { Component } from 'react';

import classes from './Accordion.module.css';
import Chevron from './Chevron/Chevron';
import Button from '../Button/Button';

class Accordion extends Component {
    state = {
        accordionClasses: [classes.Accordion],
        chevronClasses: [classes.Icon],
        isOpen: false,
        height: 0
    }

    constructor(props) {
        super(props);
        this.content = React.createRef();
    }

    toggleAccordion = () => {
        const copiedAccClasses = [...this.state.accordionClasses];
        const copiedChevronClasses = [...this.state.chevronClasses];
        let newHeight = 0;

        if(!this.state.isOpen){
            // Open accordion
            copiedAccClasses.push(classes.Active);
            copiedChevronClasses.push(classes.Rotate);
            newHeight = this.content.current.scrollHeight;
        }
        else {
            // Close accordion
            copiedAccClasses.pop();
            copiedChevronClasses.pop();
            newHeight = 0;
        }

        this.setState({
            accordionClasses: copiedAccClasses,
            chevronClasses: copiedChevronClasses,
            isOpen: !this.state.isOpen,
            height: newHeight
        });
    }

    render() {
        return (
            <div >
                <button className={this.state.accordionClasses.join(' ')} onClick={this.toggleAccordion}>
                    <p className={classes.Title}>{this.props.title}</p>
                    <Chevron className={this.state.chevronClasses.join(' ')} width={10} fill={"#fff"} />
                </button>
                <div
                    ref={this.content}
                    style={{ maxHeight: `${this.state.height}px` }}
                    className={classes.ContentWrap}
                >
                    <div style={{width: '80%', margin: '5px auto'}}>
                        <div className={classes.Content}>
                            { this.props.content }
                        </div>
                        <div className={classes.ButtonContainer}>
                            <Button btnType='Success' type={'ContentButton'} clicked={this.props.onEdit}>Edit</Button>
                            <span className={classes.Stretcher}></span>
                            <Button btnType='Danger' type={'ContentButton'} clicked={this.props.onDelete}>Delete</Button>
                        </div>
                        
                    </div>
                </div>
            </div>
        )
    }
}

export default Accordion;