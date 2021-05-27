import {useLazyQuery} from "@apollo/client";
import {GET_MESSAGES} from "./queries";
import React, {useEffect, useState} from "react";
import {TextField} from "@material-ui/core";

function GetButton(input, setValue) {
    const [getMessages, {data}] = useLazyQuery(GET_MESSAGES, {
        variables: {id: input},
        fetchPolicy: "network-only"

    })

    useEffect(() => {
        setValue(data)
    }, [data])

    return <button type="submit" onClick={getMessages}>{`Get messages from ${input ? input : "all"}`}</button>;
}

export function GetMessage({setValue}) {

    const [input, setInput] = useState("")
    return <div>
        <TextField id="standard-basic" label="Sender Name" onChange={e => setInput(e.target.value)}/>
        {GetButton(input, setValue)}
    </div>
}