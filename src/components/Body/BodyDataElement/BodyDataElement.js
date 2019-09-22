import React from 'react';

import Accordion from '../../UI/Accordion/Accordion';

const bodyDataElement = (props) => {
    const demoContent = `Lorem ipsum, dolor sit amet consectetur adipisicing elit.
    Nesciunt, repudiandae debitis at facilis libero quae placeat nobis odit culpa
    asperiores facere, obcaecati hic porro dolore vel quibusdam. Sint, qui obcaecati!`;
    
    return (
        <Accordion title={props.date.toString()} content={demoContent} onDelete={props.onDel} onEdit={props.onEditData} />
    )
}

export default bodyDataElement;
