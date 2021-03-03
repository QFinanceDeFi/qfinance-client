import React from "react";
import { useOnClickOutside } from "./hooks";
import "./modal.css";

interface IModalProps {
    open: boolean;
    close: Function;
    action: Function;
    children: any;
}

const Modal = ({open, close, action, children}: IModalProps) => {
    const node = React.useRef();
    useOnClickOutside(node, close);

    const toggle = () => {
        if (open) {
            document.body.style.backgroundColor = "rgba(0,0,0,0.9)";
        } else if (!open) {
            document.body.style.backgroundColor = "rgba(0,0,0)";
        }
    }

    React.useEffect(() => {
        toggle();
      }, [open]);

      return (
        open &&
        <div className="modal-container">
            <div className="modal" ref={node} id='modal'>
                <div className="modal_content">
                    {children}
                </div>
                <div className="modal_footer">
                    <button className="modal_button-close" onClick={() => close()}>
                        Close
                    </button>
                    <button className="modal_button-submit" onClick={() => action()}>
                        Submit
                    </button>
                </div>
            </div>
        </div>
      )
}

export default Modal;