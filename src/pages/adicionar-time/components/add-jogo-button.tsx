import styles from './AddJogoButton.module.css'
import { type ButtonHTMLAttributes } from 'react'

interface AddJogoButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>{
    
}

export const AddJogoButton = ({children, ...props} : AddJogoButtonProps) => {

    return (
        <button 
        className={styles.button33}
        {...props}
        >
            {children || "Criar jogo"} 
        </button>
    )
}