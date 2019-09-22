import React from 'react';

import classes from './BodyGraphElement.module.css';
import { Line } from 'react-chartjs-2';

const BodyGraphElement = (props) => {
    let graphs = '';

    switch(props.graphType) {
        case 'Bar':
            break;
        case 'Line':
            graphs = <Line 
                        data={props.chartData} 
                        options={
                            {
                                title: {display: true, text: props.title, fontSize: 18, fontColor: 'rgb(41, 113, 134, 1)'},
                                legend: {display: false},
                                maintainAspectRatio: true,
                                scales: {
                                    xAxes: [
                                        {
                                            scaleLabel: {display: true, labelString: 'Days'},
                                            type: 'time',
                                            time: {
                                                unit: 'day',
                                                unitStepSize: 1,
                                                displayFormats: {
                                                   'day': 'MMM DD'
                                                }
                                            },
                                            ticks: {
                                                beginAtZero: true,
                                                min: new Date(new Date().setDate(new Date().getDate()-5))
                                            }    
                                        }
                                    ],
                                    yAxes: [
                                        {
                                            scaleLabel: {display: true, labelString: props.yLabel}
                                        }
                                    ]
                                }
                            }
                        } />
            break;
        default:
            break;
    }

    return (
        <div className={classes.GraphElement}>
            {graphs}
        </div>
    )
}

export default BodyGraphElement;
