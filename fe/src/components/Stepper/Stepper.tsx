import React from 'react';
import { arrowForwardOutline, arrowBackOutline } from 'ionicons/icons'
import IntroInfo from "../IntroInfo/IntroInfo";
import "./Stepper.scss"
import { Registration, Event, ActionType } from '../../types/types';
import { IonIcon, IonProgressBar, IonButton, IonContent, IonGrid, IonRow, IonCol } from '@ionic/react';
import ChildInfo from '../childInfo/ChildInfo';
import DaySelector from '../DaySelector/DaySelector';
import ParentInfo from '../ParentInfo/ParentInfo';
import MedicineHealth from '../MedicineHalth/MedicineHealt';

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
            dateOfBirth: new Date(),
            finishedSchoolYear: null,
            attendedPreviousEvents: null
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

    protected setValueHandler = (type: ActionType, value: any) => {
        const state = {...this.state};
        switch (type) {
            case ActionType.SET_CHILD_NAME:
                state.registraion.child.name = value;
                break;
            case ActionType.SET_CHILD_SURNAME:
                state.registraion.child.surname = value;
                break;
            case ActionType.SET_CHILD_GENDER:
                state.registraion.child.gender = value;
                break;
            case ActionType.SET_CHILD_BIRTH:
                state.registraion.child.dateOfBirth = value;
                break;
            case ActionType.SET_CHILD_CITY:
                state.registraion.child.city = value;
                break;
            case ActionType.SET_CHILD_YEAR:
                state.registraion.child.finishedSchoolYear = value;
                break;
            case ActionType.SET_CHILD_ATTEND:
                state.registraion.child.attendedPreviousEvents = value;
                break;
            case ActionType.SET_DAYS:
                state.registraion.days = value;
                break;
            case ActionType.SET_PARNET_NAME:
                state.registraion.parent.name = value;
                break;
            case ActionType.SET_PARENT_SURNAME:
                state.registraion.parent.surname = value;
                break;
            case ActionType.SET_PARENT_PHONE:
                state.registraion.parent.phone = value;
                break;
            case ActionType.SET_PARENT_EMAIL:
                state.registraion.parent.email = value;
                break;
            case ActionType.SET_MEDICINE:
                state.registraion.medicine.takes = value;
                break;
            case ActionType.SET_HEALTH:
                state.registraion.health.hasProblmes = value;
                break;
            case ActionType.SET_DRUGS:
                state.registraion.medicine.drugs = value;
                break;
            case ActionType.SET_PROBLEMS:
                state.registraion.health.problems = value;
                break;
            default:
                break;
        }
        this.setState({...state})
    }

    render(): React.ReactNode {
        return (
            <IonContent>
            <IonGrid>
                <IonRow>
                    <IonCol size="2"></IonCol>
                    <IonCol>
                        <IonProgressBar value={this.state.page/this.state.pageCount}></IonProgressBar>
                    </IonCol>
                    <IonCol size="2"></IonCol>
                </IonRow>
                {
                    this.state.event && 
                    <IonRow>
                        <IonCol size="2"></IonCol>
                        <IonCol>
                            {
                                this.state.page == 0 && <IntroInfo event={this.state.event} />
                            }
                            {
                                this.state.page == 1 && <ChildInfo 
                                    registration={this.state.registraion}
                                    setValue={(t,v) => this.setValueHandler(t, v)}
                                />
                            }
                            {
                                this.state.page == 2 && <MedicineHealth
                                    registration={this.state.registraion}
                                    setValue={(t,v) => this.setValueHandler(t, v)}
                                />
                            }
                            {
                                this.state.page == 3 && this.state.event.days.length > 1 && <DaySelector
                                    event={this.state.event}
                                    registration={this.state.registraion}
                                    setValue={(t,v) => this.setValueHandler(t, v)}
                                />
                            }
                            {
                                this.state.page == 3 && this.state.event.days.length == 1 && <ParentInfo
                                    registration={this.state.registraion}
                                    setValue={(t,v) => this.setValueHandler(t, v)}
                                />
                            }
                            {
                                this.state.page == 4 && this.state.event.days.length > 1 && <ParentInfo
                                    registration={this.state.registraion}
                                    setValue={(t,v) => this.setValueHandler(t, v)}
                                />
                            }
                        </IonCol>
                        <IonCol size="2"></IonCol>
                    </IonRow>
                }
                <IonRow>
                    <IonCol></IonCol>
                    <IonCol size="3">
                        <div className="previous">
                            {
                                this.state.page > 0 && 
                                <IonButton expand="full" shape="round" onClick={() => {
                                    if (this.state.page > 0) {
                                        this.setState({...this.state, page: this.state.page - 1})
                                    }
                                }}>
                                    <IonIcon icon={arrowBackOutline}/>
                                    Späť
                                </IonButton>
                            }
                        </div>
                    </IonCol>
                    <IonCol size="3">
                        <div className="next">
                            <IonButton expand="full" shape="round" onClick={() => {
                                if (this.state.page < this.state.pageCount) {
                                    this.setState({...this.state, page: this.state.page + 1})
                                }
                            }}>
                                Ďalej
                                <IonIcon icon={arrowForwardOutline}/>
                            </IonButton>
                        </div>
                    </IonCol>
                    <IonCol></IonCol>
                </IonRow>
            </IonGrid>
        </IonContent>
        );
    }
};

export default Stepper;
