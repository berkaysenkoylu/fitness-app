import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import axiosExerciseRoutine from '../../../axios-exerciseRoutine';

import classes from './ExerciseView.module.css';

const ExerciseView = (props) => {
    const [exerciseRoutineData, setExerciseRoutineData] = useState([]);

    useEffect(() => {
        const config = {
            headers: {
                'Authorization': 'Bearer ' + props.token
            }            
        };
        axiosExerciseRoutine.get('', config).then(response => {
            let fetchedData = [];

            fetchedData = response.data.result.map(d => {
                return {
                    id: d._id,
                    userId: d.userId,
                    date: d.date,
                    exercises: d.exercises
                };
            });

            setExerciseRoutineData(fetchedData);
        });
    }, [props.token]);

    let dateMap = {};
    const exerciseGlossary = {};
    let tableExerciseHeaders = [];
    let tableDateHeaders = [];
    if (exerciseRoutineData.length > 0) {
        exerciseRoutineData.forEach(data => {
            tableExerciseHeaders = tableExerciseHeaders.concat(Object.keys(data.exercises));

            // Remove duplicates
            tableExerciseHeaders = [...new Set(tableExerciseHeaders)];

            const date = new Date(data.date);
            const dateString = new Date(date.getTime() - (date.getTimezoneOffset() * 60000 ))
                .toISOString()
                .split("T")[0];
            dateMap[data.date] = dateString;
            tableDateHeaders.push(dateString);
        });
    }

    tableDateHeaders.forEach(day => {
        if (!exerciseGlossary[day]) {
            let dailyExercise = [];
            exerciseRoutineData.forEach(fetchedData => {
                // const date = new Date(fetchedData.date);
                // const dateString = new Date(date.getTime() - (date.getTimezoneOffset() * 60000 ))
                //     .toISOString()
                //     .split("T")[0];;
                const dateString = dateMap[fetchedData.date];

                if(day === dateString){
                    tableExerciseHeaders.forEach(exercise => {
                        const exer = {};
                        if(fetchedData.exercises[exercise]) {
                            exer[exercise] = fetchedData.exercises[exercise];
                        } else {
                            exer[exercise] = { sets: 0, reps: 0 };
                        }

                        dailyExercise.push(exer);
                    });
                }

            });
            exerciseGlossary[day] = dailyExercise;
        }
    });

    let tableData = null;
    let exerciseHeaders = null;
    if (Object.keys(exerciseGlossary).length > 0) {
        tableData = Object.keys(exerciseGlossary).map(date => {
            return (
                <tr key={date}>
                    <th>{date}</th>
                    {exerciseGlossary[date].map((exercise, index) => {
                        return (
                            <React.Fragment key={exercise + Math.random() * 100}>
                                <td>{exercise[tableExerciseHeaders[index]].sets}</td>
                                <td>{exercise[tableExerciseHeaders[index]].reps}</td>
                            </React.Fragment>)
                    })}
                    <th style={{cursor: 'pointer'}} onClick={(event) => onDeleteDate(event, date)}>X</th>
                </tr>
            )
            
        });
    };

    const onDeleteDate = (event, value) => {
        let date = Object.keys(dateMap).find(key => dateMap[key] === value);

        // Get the id of the data to be deleted given its date value
        let id = exerciseRoutineData.filter(data => data.date === date)[0].id;
        
        // Remove this from the array
         let copiedArr = [...exerciseRoutineData];
         copiedArr = copiedArr.filter(data => data.id !== id);
         setExerciseRoutineData(copiedArr);

        // Http request
        const config = {
            headers: {
                'Authorization': 'Bearer ' + props.token
            }            
        };
        axiosExerciseRoutine.delete('/' + id, config).then(response => {
            console.log(response);
        }).catch(error => {
            console.log(error);
        })
    }

    exerciseHeaders = tableExerciseHeaders.map(exercise => {
        return <th colSpan="2" key={exercise}>{exercise}</th>
    });

    let subHeaders = tableExerciseHeaders.map(exercise => {
        return (
            <React.Fragment key={"Exercise_Sub_Headers" + Math.random() * 100}>
                <th key={exercise + "sets"}>Sets</th>
                <th key={exercise + "reps"}>Reps</th>
            </React.Fragment>
        );
    });

    let tableContent = "You haven't got any exercise routine history yet!";
    if (exerciseRoutineData.length > 0) {
        tableContent = (
            <table>
                <thead>
                    <tr>
                        <th rowSpan="2">Date</th>
                        {exerciseHeaders}
                    </tr>

                    <tr>
                        {subHeaders}
                    </tr>
                </thead>

                <tbody>
                    {tableData}
                </tbody>
            </table>
        )
    }

    return (
        <div>
            <h2>Exercise Routine History</h2>
            <hr />
            <div className={classes.Table}>
                {tableContent}
            </div>
        </div>
    )
}

const mapStateToProps = state => {
    return {
        token: state.userToken
    };
};

export default connect(mapStateToProps, null)(ExerciseView);
