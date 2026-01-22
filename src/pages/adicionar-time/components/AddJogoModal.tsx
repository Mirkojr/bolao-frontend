import { useState } from "react"

interface AddJogoModalProps {
    isOpen: boolean,
    children: React.ReactNode
    setModalOpen: (value: boolean) => void
}

const BACKGROUND_STYLE: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    zIndex: 1000
}

const MODAL_STYLE: React.CSSProperties = {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '80%',
    padding: '150px 0px 150px 0px',
    backgroundColor: '#fff',
    borderRadius: '10px',
    
    // Alinhamento
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
}

const CLOSE_BUTTON_STYLE : React.CSSProperties = {
    position: 'absolute',
    top: '10px',
    right: '20px',
    fontSize: '20px',
    border: 'none',
    backgroundColor: 'transparent',
    fontWeight: 'bold',
    padding: '5px',
    cursor: 'pointer'
}

export default function AddJogoModal({ isOpen, children, setModalOpen}: AddJogoModalProps) {

    if (isOpen) {
        return (
            <div style={BACKGROUND_STYLE}>
                <div style={MODAL_STYLE}>
                    <button className="hover:text-red-500 hover:scale-125 transition-all"
                            onClick={() => setModalOpen(!isOpen)} 
                            style={CLOSE_BUTTON_STYLE}>x</button>
                    {children}
                </div>
            </div>
        )
    }

}
