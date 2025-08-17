import "./errorModal.css"

function errModal({ isOpen, onClose, title }) {
    if (!isOpen) return null;

    return (
        <div className="modalErr" style={{ display: "flex" }}>
            <div className="modal_boxErr">
                <button className="modal_closeErr" onClick={onClose}>
                    <i className='bxr bxs-x'></i>
                </button>

                <h2 className="modal_titleErr">{title}</h2>

            </div>
        </div>
    );
}

export default errModal;
