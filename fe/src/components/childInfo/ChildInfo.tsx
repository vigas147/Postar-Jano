import React from 'react';
import './ChildInfo.scss';
import { Event, Registration, Gender, ActionType } from '../../types/types';
import DatePicker from 'react-date-picker';
import { IonGrid, IonRow, IonCol, IonItem, IonLabel, IonInput, IonRadioGroup, IonRadio, IonIcon, IonSelect, IonSelectOption } from '@ionic/react';
import { calendarOutline } from 'ionicons/icons';

interface ChildInfoProps {
    registration: Registration
    setValue: (action: ActionType, value: any) => void,
}

const ChildInfo: React.FC<ChildInfoProps> = (props) => {
    const { child } = props.registration;

    return (
        <IonGrid>
            <IonRow>
                <IonCol>
                    <h1>Informácie o dieťati</h1>
                </IonCol>
            </IonRow>
            <IonRow>
                <IonCol>
                    <h4>Meno</h4>
                    <IonItem>
                        <IonLabel position="floating"></IonLabel>
                        <IonInput value={child.name} onIonChange={e => props.setValue(ActionType.SET_CHILD_NAME, e.detail.value)} placeholder="Jožko" required={true}></IonInput>
                    </IonItem>
                </IonCol>
            </IonRow>
            <IonRow>
                <IonCol>
                    <h4>Priezvisko</h4>
                    <IonItem>
                        <IonLabel position="floating"></IonLabel>
                        <IonInput value={child.surname} onIonChange={e => props.setValue(ActionType.SET_CHILD_SURNAME, e.detail.value)} placeholder="Mrkvička" required={true}></IonInput>
                    </IonItem>
                </IonCol>
            </IonRow>
            <IonRow>
                <IonCol>
                    <h4>Pohlavie</h4>
                    <IonRadioGroup value={props.registration.child.gender} onIonChange={e => props.setValue(ActionType.SET_CHILD_GENDER, e.detail.value)}>
                        <IonItem>
                            <IonLabel>Chlapec</IonLabel>
                            <IonRadio slot="start" value={Gender.Male} />
                        </IonItem>
                        <IonItem>
                            <IonLabel>Dievča</IonLabel>
                            <IonRadio slot="start" value={Gender.Female} />
                        </IonItem>
                    </IonRadioGroup>
                </IonCol>
            </IonRow>
            <IonRow>
                <IonCol>
                    <h4>Dátum narodenia</h4>
                    <DatePicker
                        onChange={(date) => props.setValue(ActionType.SET_CHILD_BIRTH, date)}
                        value={child.dateOfBirth}
                        calendarIcon={<IonIcon icon={calendarOutline}></IonIcon>}
                        minDate={new Date(new Date().getFullYear() - 25, 0, 1)}
                        maxDate={new Date(new Date().getFullYear() - 6, 0, 1)}
                    />
                </IonCol>
            </IonRow>
            <IonRow>
                <IonCol>
                    <h4>Mesto / Obec trvalého bydliska</h4>
                    <IonItem>
                        <IonLabel></IonLabel>
                        <IonInput value={child.city} onIonChange={e => props.setValue(ActionType.SET_CHILD_CITY, e.detail.value)} required={true} placeholder="Banská Bystrica"></IonInput>
                    </IonItem>
                </IonCol>
            </IonRow>
            <IonRow>
                <IonCol>
                    <h4>Ukončený školský rok</h4>
                    <IonItem>
                    <IonSelect value={child.finishedSchoolYear} placeholder="Vybrať" onIonChange={e => props.setValue(ActionType.SET_CHILD_YEAR, e.detail.value)}>
                        <IonSelectOption value="3zs">3. ZŠ</IonSelectOption>
                        <IonSelectOption value="4zs">4. ZŠ</IonSelectOption>
                        <IonSelectOption value="5zs">5. ZŠ</IonSelectOption>
                        <IonSelectOption value="6zs">6. ZŠ</IonSelectOption>
                        <IonSelectOption value="7zs">7. ZŠ</IonSelectOption>
                        <IonSelectOption value="8zs">8. ZŠ</IonSelectOption>
                        <IonSelectOption value="9zs">9. ZŠ</IonSelectOption>
                        <IonSelectOption value="1ss">1. SŠ</IonSelectOption>
                        <IonSelectOption value="2ss">2. SŠ</IonSelectOption>
                        <IonSelectOption value="3ss">3. SŠ</IonSelectOption>
                        <IonSelectOption value="4ss">4. SŠ</IonSelectOption>
                    </IonSelect>
                    </IonItem>
                </IonCol>
            </IonRow>
            <IonRow>
                <IonCol>
                    <h4>Zúčastnilo sa vaše dieťa minuloročných akcií ?</h4>
                    <IonRadioGroup value={props.registration.child.attendedPreiousEvents} onIonChange={e => props.setValue(ActionType.SET_CHILD_ATTEND, e.detail.value)}>
                        <IonItem>
                            <IonLabel>Áno</IonLabel>
                            <IonRadio slot="start" value={true} />
                        </IonItem>
                        <IonItem>
                            <IonLabel>Nie</IonLabel>
                            <IonRadio slot="start" value={false} />
                        </IonItem>
                    </IonRadioGroup>
                </IonCol>
            </IonRow>
        </IonGrid>
    );
};

export default ChildInfo;
