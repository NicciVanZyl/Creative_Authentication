import { useState, useEffect } from 'react';
// import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Checkmark from '../Images/Checkmark.png'
import X from '../Images/X.png'


function Modals({ showModal, modalTitle, modalBody, modalButtons }) {
    const [show, setShow] = useState(showModal);
    const [image, setImage] = useState(modalBody);
    const handleClose = () => {
        setShow(false);
        window.location.reload();
    }
    const handleShow = () => setShow(true);

    useEffect(() => {
        setShow(showModal);
    }, [showModal]);
    useEffect(() => {
        if (modalBody == "X") {
            setImage(X);
        } else {
            setImage(Checkmark);
        }
    }, [modalBody]);

    return (
        <>
            <Modal centered className='modal' show={show} onHide={handleClose}>
                <Modal.Header className='modalHeader' closeButton>
                    <Modal.Title className='modalTitle'>{modalTitle}</Modal.Title>
                </Modal.Header>
                <Modal.Body className='modalBody'><img className='modalImage' src={image}></img></Modal.Body>
                <Modal.Footer className='modalFooter'>
                    <button className='customBtnSecondary' onClick={handleClose}>
                        {modalButtons}
                    </button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default Modals;