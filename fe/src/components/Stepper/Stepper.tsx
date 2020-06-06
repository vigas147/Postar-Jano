import React from 'react';
import IntroInfo from "../IntroInfo/IntroInfo";
import "./Stepper.scss"
import { Registration, Event } from '../../types/types';

interface StepperProps {
    event: Event
}

interface StepperState {
    registraion: Registration;
    event: Event | null,
}

const defaultState: StepperState = {
    registraion: {
        child: {
            name: "",
            surname: "",
            gender: null,
            city: "",
            dateOfBirth: null,
            finishedSchoolYear: null,
            attendedPreiousEvents: null
        },
        days: [],
        medicine: {
            takes: null,
            drugs: ""
        },
        health: {
            hasProblmes: null,
            problems: ""
        },
        parent: {
            name: "",
            surname: "",
            email: "",
            phone: "",
        },
        memberShip: {
            attendedActivities: ""
        },
        notes: ""
    },
    event: null
}

class Stepper extends React.Component<StepperProps, StepperState> {
    state: StepperState;

    constructor(props: StepperProps) {
        super(props);
        this.state = defaultState;
        this.setState({
            ...this.state,
            event: props.event
        })
    }

    render(): React.ReactNode {
        return (
            <div className="container">
                {
                    this.state.event && <IntroInfo event={this.state.event} />
                }
            </div>
        );
    }
};

export default Stepper;
