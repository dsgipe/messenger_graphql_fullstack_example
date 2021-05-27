import React from 'react';
import {ApolloClient, ApolloProvider, HttpLink, InMemoryCache, split} from '@apollo/client';
import {WebSocketLink} from '@apollo/client/link/ws';
import {getMainDefinition} from '@apollo/client/utilities';
import {SubmitMessage} from "./SubmitMessage";
import {Messenger} from "./Messenger";
import {GetMessage} from "./GetMessage";


const httpLink = new HttpLink({
    uri: 'http://localhost:4000/graphql'
});
const wsLink = new WebSocketLink({
    uri: 'ws://localhost:4000/subscriptions',
    options: {
        reconnect: true
    }
});

const splitLink = split(
    ({query}) => {
        const definition = getMainDefinition(query);
        return (
            definition.kind === 'OperationDefinition' &&
            definition.operation === 'subscription'
        );
    },
    wsLink,
    httpLink,
);
const client = new ApolloClient({
    link: splitLink,
    cache: new InMemoryCache()
});

function App() {


    const [value, setValue] = React.useState('');
    const [historicMessages, setHistoricMessages] = React.useState({users:[]});
    return <ApolloProvider client={client}>
        <SubmitMessage value={value} setValue={setValue}/>
        <Messenger postID={1} value={value} setValue={setValue} historicMessages={historicMessages}/>
        <GetMessage setValue={setHistoricMessages}/>
    </ApolloProvider>

}

export default App;
