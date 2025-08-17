import "./modal.css"

function Modal({ isOpen, onClose, title, inputValue, onInputChange, error, onSubmit, submitText }) {
    if (!isOpen) return null;

    return (
        <div className="modal" style={{ display: "flex" }}>
            <div className="modal_box">
                <button className="modal_close" onClick={onClose}>
                    <i className='bxr bxs-x'></i>
                </button>

                <h2 className="modal_title">{title}</h2>

                <div className="input_box">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={onInputChange}
                        placeholder="name"
                        className="form_input"
                    />
                    <span className="input_icon"><i className='bxr bxs-pencil'></i></span>
                </div>

                {error && <p style={{ fontSize: 14, color: "red", marginLeft: 10 }}>{error}</p>}

                <button className="form_btn" onClick={onSubmit}>{submitText}</button>
            </div>
        </div>
    );
}

export default Modal;
