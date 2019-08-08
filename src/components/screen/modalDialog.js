import React from "react";

import Modal from 'react-bootstrap/Modal'
import ModalFooter from 'react-bootstrap/ModalFooter'
import ModalBody from 'react-bootstrap/ModalBody'
import ModalTitle from 'react-bootstrap/ModalTitle'
import ModalHeader from 'react-bootstrap/ModalHeader'

import Button from 'react-bootstrap/Button'

const modalDialog = ({ show, handleClose, handleSubmit, title, Body, children }) => {
    return (
        <Modal show={show} onHide={handleClose}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered >
            <ModalHeader closeButton>
                <ModalTitle> <h2>{title}</h2> </ModalTitle>
            </ModalHeader>
            <ModalBody>
                {Body}
                {children}
            </ModalBody>
            <ModalFooter>
                <Button variant="secondary" onClick={handleClose} >Close</Button>
                <Button variant="primary" onClick={handleSubmit} > Confirmate </Button>
            </ModalFooter>
        </Modal>
    )
}


export default modalDialog