import {makeStyles} from "@material-ui/core/styles";
import {useSubscription} from "@apollo/client";
import {COMMENTS_SUBSCRIPTION} from "./queries";
import React, {useEffect} from "react";
import TextField from "@material-ui/core/TextField";

const useStyles = makeStyles((theme) => ({
    root: {
        '& .MuiTextField-root': {
            margin: theme.spacing(1),
            width: '25ch',
        },
    },
}));

function getMessageString(message) {
    let prevName = ""
    return message.map(it => {
        const displayName = it.name !== prevName
        let nameHeader = displayName ? `${it.name}:\n` : ""
        prevName = it.name
        return it.message ? `${nameHeader}    ${it.message}\n` : ""
    });
}

export function Messenger({postID, value, setValue, historicMessages}) {

    const data = useSubscription(
        COMMENTS_SUBSCRIPTION,
        {variables: {postID}}
    );

    const classes = useStyles();

    const handleChange = (event) => {
        setValue(event.target.value);
    };

    const [message, updateMessage] = React.useState([{message: "", name: ""}])

    useEffect(() => {
        updateMessage(it => [...it, {
            message: data.data?.commentAdded?.type,
            name: data.data?.commentAdded?.id
        }].filter(it => it.message !== undefined))
    }, [data.data])


    const messageString = getMessageString(message);

    const historicMessageString = historicMessages ? getMessageString(historicMessages["users"]).join("") : "";

    let messageContents = messageString.join("");
    return (
        <form className={classes.root} noValidate autoComplete="off">
            <div>
                <TextField
                    id="outlined-multiline-flexible"
                    label="Input"
                    multiline
                    rowsMax={40}
                    value={value}
                    onChange={handleChange}
                    variant="outlined"
                />
                <TextField
                    id="filled-multiline-static"
                    label="History"
                    multiline
                    rows={40}
                    defaultValue="Default Value"
                    value={messageContents}
                    variant="filled"
                />
                <TextField
                    id="filled-multiline-static"
                    label="Sender History"
                    multiline
                    rows={40}
                    defaultValue="Default Value"
                    value={historicMessageString}
                    variant="filled"
                />
            </div>
        </form>
    );
}