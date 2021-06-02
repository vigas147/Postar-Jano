import React, { useContext, useEffect, useState} from 'react';
import {deleteRegistration, IExtendedRegistration, loadRegistrations, updateRegistration} from "../api/registrations";
import RegistrationEntry from "./RegistrationEntry";
import ViewFilter, {IViewFields} from "./ViewFilter";
import {useParams} from 'react-router-dom'
import {AppContext} from "../AppContext";
import useStorage from "../hooks/useStorage";
import EditForm from "./EditForm";
import {Table, Popover, OverlayTrigger} from 'react-bootstrap'

const RegistrationList:React.FC = () :JSX.Element => {
    const {apiHost, token, setToken} = useContext(AppContext)
    const [filter, setFilter] = useState<string>("")
    const [registrations, setRegistrations] = useState<IExtendedRegistration[]>([])
    const [fields, setFields] = useStorage<IViewFields>("VIEW_FILTERS",{
        "id": { display: "ID", show: true},
        "name": { display: "Meno", show: true},
        "surname": { display: "Priezvisko", show: true},
        "gender": {display: "Pohlavie", show: true},
        "date_of_birth": {display: "Datum narodenia", show: false},
        "finished_school": {display: "Dokonceny rocnik", show:false},
        "attended_previous": {display: "Ucast na akciach", show:false},
        "attended_activities": {display: "Navsetvovane aktivity", show:false},

        "city" : {display: "Mesto", show:false},
        "pills" :{display: "Lieky", show:false},
        "problems" :{display: "Zdravotne problemy", show:false},
        "notes": {display: "Poznamka", show:false},

        "parent_name" :{display: "Meno rodica", show:false},
        "parent_surname" :{display: "Priezvisko rodica", show:false},
        "email" :{display: "email", show:false},
        "phone" :{display: "telefon", show:false},

        "amount": {display: "Suma", show:false},
        "payed": {display: "Zaplatene", show:false},
        "discount": {display: "Zlava", show:false},

        "title": { display: "Akcia", show: true},
        "days": { display: "Dni", show: true},

        "buttons": {display: "Upravy", show:true},
    })
    const [expandViewFilter, setExpandViewFilter] = useState(false)
    const [showEdit, setShowEdit] = useState(false)
    const [editedRegistration, setEditedRegistration] = useState<IExtendedRegistration|null>(null)

    const {event} = useParams<{event:string}>()

    useEffect(
        () => {
            loadRegistrations(apiHost,token, setToken).then(
                (data) => {
                    setRegistrations(data)
                }
            )
        }
    ,[token, setToken])

    const displayedRegistrations = ():IExtendedRegistration[] => {
        const eventID = parseInt(event || "")

        const byEvent = registrations.filter(r => (!eventID) || r.eventID == eventID)

        if (filter === "") {
            return byEvent
        }

        const lowerFilter = filter.toLowerCase()
        return byEvent.filter(r =>
            r.name.toLowerCase().includes(lowerFilter) ||
            r.surname.toLowerCase().includes(lowerFilter) ||
            r.email.toLowerCase().includes(lowerFilter)
        )
    }

    const renderViewFilter = () => {
        if (expandViewFilter) {
            return (
                <>
                    <button onClick={()=>setExpandViewFilter(false)}>Skryť</button>
                    <ViewFilter fields={fields} setFields={setFields}/>
                </>
            )
        }
        return (
            <>
                <button onClick={()=>setExpandViewFilter(true)}>Zobrazené stĺpce</button>
            </>
        )
    }

    const handleUpdate = () => {
        if (editedRegistration === null) return
        updateRegistration(apiHost, token, editedRegistration).then(
            () => {
                setRegistrations((prevState) => {
                    return prevState.map((r) => {
                        if (r.id !== editedRegistration.id) return r
                        return {...r, ...editedRegistration}
                    })
                })
                setShowEdit(false)
            }
        )
    }

    const handleEdit = (mutator:(prev :IExtendedRegistration) => IExtendedRegistration) => {
        setEditedRegistration((p :IExtendedRegistration|null) => {
            if (p == null) return p
            const copyVal :IExtendedRegistration = {...p}

            const newVal = mutator(copyVal)
            console.log(newVal)
            return newVal
        })
    }

    const popover = (
        <Popover id="popover-basic">
            <Popover.Title as="h3">Skopirovane!</Popover.Title>
            <Popover.Content>Pouzi ctrl+v</Popover.Content>
        </Popover>
    );

    const copyTable = () => {
        const elTable = document.querySelector('table');

        let range, sel;

        // Ensure that range and selection are supported by the browsers
        if (document.createRange && window.getSelection) {

            range = document.createRange();
            sel = window.getSelection();
            // unselect any element in the page
            if (sel != null) {
                sel.removeAllRanges();
            }

            if (sel == null) return

            if (elTable == null) return
            try {
                range.selectNodeContents(elTable);
                sel.addRange(range);
            } catch (e) {
                range.selectNode(elTable);
                sel.addRange(range);
            }

            document.execCommand('copy');
            sel.removeAllRanges();
        }
    }



    return (
        <div>
        <h2>Zoznam prihlasenych</h2>
            <input
                value={filter}
                placeholder='filter...'
                onChange={event => setFilter(event.target.value)}
            />
            {editedRegistration!= null && <EditForm
                show={showEdit}
                reg={{...editedRegistration}}
                handleChange={handleEdit}
                handleSubmit={handleUpdate}
                handleClose={() => {setShowEdit(false)}}
            />}
            {renderViewFilter()}
            <OverlayTrigger trigger="click" placement="right" overlay={popover}>
                <button onClick={() => copyTable()}>Kopirovat</button>
            </OverlayTrigger>
            <Table>
                <tbody>
                {displayedRegistrations().map(
                    r =>
                        <RegistrationEntry
                            key={r.id}
                            fields={fields}
                            registration={r}
                            deleteRegByID={(id:number) => {
                                deleteRegistration(apiHost, token, id).then(()=>{
                                    setRegistrations((prev => prev.filter(r => r.id !== id)))
                                })
                            }}
                            editRegByID={() => {
                                setEditedRegistration({...r})
                                setShowEdit(true)
                            }}
                        />
                )}
                </tbody>
            </Table>
        </div>
    )
}
export default RegistrationList;