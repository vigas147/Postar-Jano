import React, { useState } from 'react';
import { Event, Registration, ActionType, Day } from '../../types/types';
import { IonGrid, IonRow, IonCol, IonItem, IonLabel, IonInput, IonRadioGroup, IonRadio, IonIcon, IonSelect, IonSelectOption, IonList, IonItemDivider, IonCheckbox, IonProgressBar } from '@ionic/react';

interface ParentInfoProps {
    registration: Registration
    setValue: (action: ActionType, value: any) => void,
}

const ParentInfo: React.FC<ParentInfoProps> = (props) => {
    const { parent } = props.registration;

    return (
        <IonGrid>
            <IonRow>
                <IonCol>
                    <h1>Údaje o zákonnom zástupcovi</h1>
                </IonCol>
            </IonRow>
            <IonRow>
                <IonCol>
                    <h4>Meno</h4>
                    <IonItem>
                        <IonLabel position="floating"></IonLabel>
                        <IonInput value={parent.name} onIonChange={e => props.setValue(ActionType.SET_PARNET_NAME, e.detail.value)} placeholder="Jožko" required={true}></IonInput>
                    </IonItem>
                </IonCol>
            </IonRow>
            <IonRow>
                <IonCol>
                    <h4>Priezvisko</h4>
                    <IonItem>
                        <IonLabel position="floating"></IonLabel>
                        <IonInput value={parent.surname} onIonChange={e => props.setValue(ActionType.SET_PARENT_SURNAME, e.detail.value)} placeholder="Mrkvička" required={true}></IonInput>
                    </IonItem>
                </IonCol>
            </IonRow>
            <IonRow>
                <IonCol>
                    <h4>Email</h4>
                    <IonItem>
                        <IonLabel position="floating"></IonLabel>
                        <IonInput value={parent.email} onIonChange={e => props.setValue(ActionType.SET_PARENT_EMAIL, e.detail.value)} placeholder="jozk.mrkvica@gmail.com" type="email" required={true}></IonInput>
                    </IonItem>
                </IonCol>
            </IonRow>
            <IonRow>
                <IonCol>
                    <h4>Tel. číslo</h4>
                    <IonItem>
                        <IonLabel position="floating"></IonLabel>
                        <IonInput value={parent.phone} onIonChange={e => props.setValue(ActionType.SET_PARENT_PHONE, e.detail.value)} placeholder="0900 000 000" type="tel" required={true}></IonInput>
                    </IonItem>
                </IonCol>
            </IonRow>
        </IonGrid>
    );
};

export default ParentInfo;
