import {useLazyQuery, useMutation} from "@apollo/client";
import {ADD_TODO, GET_MESSAGES} from "./queries";
import React, {useEffect, useState} from "react";
import {TextField} from "@material-ui/core";


export function SubmitMessage({value, setValue}) {
    const [sendMessage] = useMutation(ADD_TODO);
    const [name, setName] = useState("")

    return (
        <div>
            <TextField id="standard-basic" label="Name" onChange={e => {
                setName(e.target.value)

            }}/>
            <button type="submit" onClick={() => {
                sendMessage({variables: {type: value, id: name}});
                setValue('')
            }}>Send</button>
        </div>
    );
}