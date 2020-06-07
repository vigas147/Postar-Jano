import React from 'react';
import { arrowForwardOutline, arrowBackOutline } from 'ionicons/icons'
import IntroInfo from "../IntroInfo/IntroInfo";
import "./Stepper.scss"
import { Registration, Event, ActionType, Stat, RegistrationRespone, responseStatus } from '../../types/types';
import { IonIcon, IonProgressBar, IonButton, IonContent, IonGrid, IonRow, IonCol, IonToast } from '@ionic/react';
import ChildInfo from '../childInfo/ChildInfo';
import DaySelector from '../DaySelector/DaySelector';
import ParentInfo from '../ParentInfo/ParentInfo';
import MedicineHealth from '../MedicineHalth/MedicineHealt';
import { toastController } from '@ionic/core'
import axios, { AxiosResponse } from 'axios';
import OtherInfo from '../OtherInfo/OtherInfo';
import Results from '../Result/Results';

interface StepperProps {
    event: Event,
    stats: Stat[]
}

interface StepperState {
    registraion: Registration;
    event: Event | null,
    stats: Stat[] | null,
    page: number,
    pageCount: number,
    valid: boolean,
    canGoBack: boolean,
    responseMsg: string | null,
    responseStatus: responseStatus | null
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
    stats: null,
    event: null,
    page: 0,
    pageCount: 5,
    valid: true,
    canGoBack: true,
    responseMsg: null,
    responseStatus: null
}

class Stepper extends React.Component<StepperProps, StepperState> {
    state: StepperState;
    
    constructor(props: StepperProps) {
        super(props);
        if (this.props.event.days.length > 1) {
            defaultState.pageCount += 1
        }
        this.state = defaultState;
        this.state.event = props.event;
        this.state.stats = props.stats;
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
            case ActionType.SET_ATTENDED_ACTIVITIES:
                state.registraion.memberShip.attendedActivities = value;
                break;
            case ActionType.SET_NOTES:
                state.registraion.notes = value;
                break;
            default:
                break;
        }
        this.setState({...state})
    }

    protected validate = () => {

    }


    protected handleSubmit = async () => {
        this.setState({
            ...this.state,
            page: this.state.page +1,
            responseMsg: null,
            responseStatus: null
        })
        const sendToast = await toastController.create({
            duration: 2000,
            message: "Prihláška bola odoslaná na spracovanie",
            color: "secondary",
            position: "bottom"
        })
        sendToast.present()

        const registration = this.state.registraion;

        if (this.state.event && this.state.event.days.length == 1) {
            registration.days.push(this.state.event.days[0].id)
        }
        
        axios.post(`${process.env.REACT_APP_API_HOST}/registrations/${this.state.event?.id}`, registration)
        .then(async(res: AxiosResponse<RegistrationRespone>)  => {
            if(res.data.success){
                const processToast = await toastController.create({
                    duration: 2000,
                    message: "Prihláška bola úspešne spracovaná",
                    color: "success",
                    position: "bottom"
                })
                processToast.present()
                this.setState({
                    ...this.state,
                    canGoBack: false,
                    responseMsg: "Prihláška bola úspešne spracovaná",
                    responseStatus: responseStatus.success
                })
            } else if (res.data.registredIDs) {
                if (res.data.registredIDs.length != this.state.registraion.days.length) {
                    const notRegistred = this.state.registraion.days.filter(d => !res.data.registredIDs?.includes(d))
                    let msg = 'Nepodarilo sa prihlásiť na tieto termíny: '
                    for (const dayId of notRegistred) {
                        const day = this.props.event.days.filter(d => d.id == dayId)[0];
                        msg += `${day.description} `
                    }
                    this.setState({
                        ...this.state,
                        canGoBack: true,
                        responseMsg: msg,
                        responseStatus: responseStatus.fail
                    })
                }
            }
        })
        .catch(async err => {
            const errorToast = await toastController.create({
                duration: 2000,
                message: err,
                color: "danger",
                position: "bottom"
            })
            errorToast.present()
            this.setState({
                ...this.state,
                canGoBack: true,
                responseMsg: "Došlo k chybe pri odosielaní prihlášky",
                responseStatus: responseStatus.fail
            })
            console.log(err)
        })
    }

    render(): React.ReactNode {
        return (
            <IonContent>
            <IonGrid>
                <IonRow>
                    <IonCol size="2"></IonCol>
                    <IonCol>
                        <IonProgressBar value={this.state.page/(this.state.pageCount-1)}></IonProgressBar>
                    </IonCol>
                    <IonCol size="2"></IonCol>
                </IonRow>
                {
                    this.state.event && 
                    <IonRow>
                        <IonCol size="2"></IonCol>
                        <IonCol>
                            {
                                this.state.page == 0 && this.state.stats && <IntroInfo event={this.state.event} stats={this.state.stats} />
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
                                this.state.page == 3 && this.state.event.days.length > 1 && this.state.stats && <DaySelector
                                    stats={this.state.stats}
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
                            {
                                this.state.page == 4 && this.state.event.days.length == 1 && <OtherInfo
                                    registration={this.state.registraion}
                                    setValue={(t,v) => this.setValueHandler(t, v)}
                                />
                            }
                            {
                                this.state.page == 5 && this.state.event.days.length > 1 && <OtherInfo
                                    registration={this.state.registraion}
                                    setValue={(t,v) => this.setValueHandler(t, v)}
                                />
                            }
                            {
                                this.state.page == 5 && this.state.event.days.length == 1 && <Results
                                    registration={this.state.registraion}
                                    responseMsg={this.state.responseMsg}
                                    responseStatus={this.state.responseStatus}
                                />
                            }
                            {
                                this.state.page == 6 && this.state.event.days.length > 1 && <Results
                                    registration={this.state.registraion}
                                    responseMsg={this.state.responseMsg}
                                    responseStatus={this.state.responseStatus}
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
                                this.state.page > 0 && this.state.canGoBack && 
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
                            {
                                this.state.page < this.state.pageCount -1 &&
                                <IonButton expand="full" shape="round" onClick={() => {
                                    if (this.state.page < this.state.pageCount) {
                                        this.setState({...this.state, page: this.state.page + 1})
                                    }
                                }}>
                                    Ďalej
                                    <IonIcon icon={arrowForwardOutline}/>
                                </IonButton>
                            }
                            {
                                this.state.page == this.state.pageCount -1 &&
                                <IonButton 
                                    expand="full" 
                                    shape="round"
                                    color="success"
                                    disabled={!this.state.valid}
                                    onClick={this.handleSubmit}
                                >
                                    Odoslať
                                </IonButton>
                            }
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
