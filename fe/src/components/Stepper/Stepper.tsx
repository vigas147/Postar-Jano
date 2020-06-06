import React from 'react';
import { arrowForwardOutline, arrowBackOutline } from 'ionicons/icons'
import IntroInfo from "../IntroInfo/IntroInfo";
import "./Stepper.scss"
import { Registration, Event } from '../../types/types';
import { IonIcon, IonProgressBar, IonButton } from '@ionic/react';

interface StepperProps {
    event: Event
}

interface StepperState {
    registraion: Registration;
    event: Event | null,
    page: number,
    pageCount: number
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
    event: null,
    page: 0,
    pageCount: 5
}

class Stepper extends React.Component<StepperProps, StepperState> {
    state: StepperState;

    constructor(props: StepperProps) {
        super(props);
        this.state = defaultState;
        this.state.event = props.event;
    }

    render(): React.ReactNode {
        return (
            <div className="grid-container">
                {
                    this.state.event && 
                    <div className="form">
                        <IntroInfo event={this.state.event} />
                    </div>
                }
                <div className="progress">
                    <IonProgressBar value={this.state.page/this.state.pageCount}></IonProgressBar>
                </div>
                <div className="previous">
                    {
                        this.state.page > 0 && 
                        <IonButton expand="full" shape="round" size="large" onClick={() => {
                            if (this.state.page > 0) {
                                this.setState({...this.state, page: this.state.page - 1})
                            }
                        }}>
                            <IonIcon icon={arrowBackOutline}/>
                            Späť
                        </IonButton>
                    }
                </div>
                <div className="next">
                    <IonButton expand="full" shape="round" size="large" onClick={() => {
                        if (this.state.page < this.state.pageCount) {
                            this.setState({...this.state, page: this.state.page + 1})
                        }
                    }}>
                        Ďalej
                        <IonIcon icon={arrowForwardOutline}/>
                    </IonButton>
                </div>
            </div>
        );
    }
};

export default Stepper;
