import React, {useEffect, useState} from "react";
import {IExtendedRegistration} from "../api/registrations";
import {Button, Modal, Form} from "react-bootstrap";

interface Props {
    show :boolean;
    reg :IExtendedRegistration |null;
    handleChange :(mutator :(prev :IExtendedRegistration) => IExtendedRegistration) => void;
    handleSubmit :(updated :IExtendedRegistration) => void;
    handleClose :() => void;
}

const EditForm:React.FC<Props> = ({show, reg:r,handleClose, handleChange}) => {
    const onClose = () => {
        handleClose()
    }

    if (r == null) return null

    const days = r.days.length == 1 ?
            <span> {r.days[0].description}</span> :
            <ul>
                {r.days.map((d) => <li key={d.id}>{d.description}</li>)}
            </ul>

    const onChange = (mutator :((prev :IExtendedRegistration) => IExtendedRegistration) ) => {
       return handleChange(mutator)
    }

    const renderForm = () => {
       const renderMaybeNumber = (val :number|null):number =>  val || 0

       return <Form>
           <Form.Group>
               <Form.Label>Suma</Form.Label>
               <Form.Control
                   type="number"
                   onChange={
                       (e :React.ChangeEvent<HTMLInputElement>) => {
                            const val = parseInt(e.target.value) || null
                            if (val == null) return
                            onChange((prev :IExtendedRegistration) => {
                                prev.amount = val
                                return prev
                            })
                       }
                   }
                   value={r.amount}
               />
           </Form.Group>
           <Form.Group>
               <Form.Label>Zaplatené</Form.Label>
           <Form.Control
               type="number"
               onChange={
                   (e :React.ChangeEvent<HTMLInputElement>) => {
                       const val = parseInt(e.target.value) || null
                       onChange((prev :IExtendedRegistration) => {
                           prev.payed = val
                           return prev
                       })
                   }
               }
               value={renderMaybeNumber(r.payed)}
           />
           </Form.Group>
           <Form.Group>
               <Form.Label>Zľava</Form.Label>
           <Form.Control
               type="number"
               onChange={
                   (e :React.ChangeEvent<HTMLInputElement>) => {
                       const val = parseInt(e.target.value) || null
                       onChange((prev :IExtendedRegistration) => {
                           prev.discount = val
                           return prev
                       })
                   }
               }
               value={renderMaybeNumber(r.discount)}
           />
           </Form.Group>
        </Form>
    }

    return (<>
        <Modal show={show} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>{r.name} {r.surname}</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <span>{r.title}</span>
                {days}
                <br/>
                {r !== null && renderForm()}
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>Zrušiť</Button>
                <Button variant="primary">Uloziť zmeny</Button>
            </Modal.Footer>
        </Modal>
    </>)
}

export default EditForm