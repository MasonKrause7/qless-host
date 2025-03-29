import React from "react";

type ErrorMessageProps = {
    message: string;
};

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {


    return (
        <>
            <div>
                <p className="errorMessageText">{message}</p>
            </div>
        </>
    )
}

export default ErrorMessage;