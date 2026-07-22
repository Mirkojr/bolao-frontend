import styles from './AddJogoButton.module.css';
import { type ButtonHTMLAttributes } from 'react';

type AddJogoButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export const AddJogoButton = ({ children, ...props }: AddJogoButtonProps) => {
    return (
        <button className={styles.button33} {...props}>
            <span aria-hidden className={styles.icon}>
                +
            </span>
            {children || 'Criar jogo'}
        </button>
    );
};