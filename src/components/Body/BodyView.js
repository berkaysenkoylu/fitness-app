import React, { useState, useEffect } from 'react';
import axiosBodyData from '../../axios-bodydata';
import { connect } from 'react-redux';

import classes from './BodyView.module.css';
import BodyDataElement from './BodyDataElement/BodyDataElement';
import BodyGraphElement from './BodyGraphElement/BodyGraphElement';
import Button from '../UI/Button/Button';
import Loader from '../UI/Loader/Loader';

const KEY_LABEL_MAP = {
    height: 'Height [cm]',
    weight: 'Weight [kg]',
    neck: 'Neck C. [cm]',
    waist: 'Waist C. [cm]',
    hip: 'Hip C. [cm]',
    bodyFat: 'Body Fat %'
}

const BodyView = (props) => {
    const [showData, setShowData] = useState(true);
    const [showGraph, setShowGraph] = useState(false);
    const [bodyData, setBodyData] = useState([]);
    const [graphData, setGraphData] = useState({xAxis: [], yAxis: {}});
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line
    }, []);

    const fetchData = () => {
        setIsLoading(true);

        let config = {
            headers: {
                'Authorization': 'Bearer ' + props.token
            }
        };

        axiosBodyData.get('', config).then(res => {
            const fetchedData = res.data.data.map(data => {
                let {_id, ...fetchedDataWithNoId} = data;
                return {
                    id: data._id,
                    ...fetchedDataWithNoId
                };
            });

            const copiedData = [...fetchedData];

            const orderedDataByDate = copiedData.sort((a, b) => {
                return new Date(a.date) - new Date(b.date);
            });
            
            const graphsData = {
                xAxis: [],
                yAxis: {
                    height: [],
                    weight: [],
                    neck: [],
                    waist: [],
                    hip: [],
                    bodyFat: []
                }
            }

            orderedDataByDate.forEach(dataElement => {
                graphsData.xAxis.push(dataElement.date);
                graphsData.yAxis.height.push(dataElement.height);
                graphsData.yAxis.weight.push(dataElement.weight);
                graphsData.yAxis.neck.push(dataElement.neck);
                graphsData.yAxis.waist.push(dataElement.waist);
                graphsData.yAxis.hip.push(dataElement.hip);
                graphsData.yAxis.bodyFat.push(dataElement.bodyfat);
            });
    
            setBodyData(orderedDataByDate);
            setGraphData(graphsData);
            setIsLoading(false);
        });
    }

    const toggleSections = () => {
        setShowData(showData => showData = !showData);
        setShowGraph(showGraph => showGraph = !showGraph);
    }

    const onDeleteElement = (id) => {
        let config = {
            headers: {
                'Authorization': 'Bearer ' + props.token
            }
        };

        axiosBodyData.delete('/' + id, config).then(res => {
            fetchData();
        });
    }

    const onEditElement = (id) => {
        // Navigate to add data section with an id payload
        props.history.push(props.match.url + '/add-data?key=' + id);
    }

    let content = <Loader />;
    if(!isLoading && bodyData.length > 0) {
        content = bodyData.map(data => {
            const date = new Date(data.date);
            const dateString = new Date(date.getTime() - (date.getTimezoneOffset() * 60000 ))
                    .toISOString()
                    .split("T")[0];
            return <BodyDataElement key={data.id} date={dateString} onDel={() => onDeleteElement(data.id)} onEditData={() => onEditElement(data.id)} />
        });
    } else {
        content = <p>No data has been entered yet!</p>;
    }

    let graphContent = '';
    if(!isLoading && graphData !== null){
        graphContent = Object.keys(graphData.yAxis).map(key => {
            const data = {
                labels: graphData.xAxis,
                datasets: [
                    {
                        label: key, 
                        data: graphData.yAxis[key],
                        fill: false,
                        borderColor: 'rgba(0, 0, 0, 0.6)',
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.6)',
                            'rgba(54, 162, 235, 0.6)',
                            'rgba(255, 206, 86, 0.6)',
                            'rgba(75, 192, 192, 0.6)',
                            'rgba(153, 102, 255, 0.6)',
                            'rgba(255, 99, 132, 0.6)',
                        ]
                    }
                ]
            }

            const graphTitle = key.slice(0, 1).toUpperCase() + key.toLowerCase().slice(1, key.length);

            return <BodyGraphElement key={key} graphType='Line' title={`Change in ${graphTitle}`} yLabel={KEY_LABEL_MAP[key]} chartData={data} />
        });
    }

    return (
        <div>
            <div className={classes.Buttons}>
                <Button btnType="Primary" clicked={toggleSections}>{showData ? 'Switch to Graphs' : 'Switch to Data'}</Button>
            </div>
            <hr />
            <div hidden={!showData}>
                <div className={classes.BodyView}>
                    {content}
                </div>
            </div>
            
            <div hidden={!showGraph}>
                <div className={classes.GraphView}>
                    {graphContent}
                </div>
            </div>
        </div>
    )
}

const mapStateToProps = state => {
    return {
        token: state.userToken
    };
};

export default connect(mapStateToProps, null)(BodyView);