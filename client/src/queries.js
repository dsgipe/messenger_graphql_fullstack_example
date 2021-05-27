import {gql} from "@apollo/client";

export const GET_MESSAGES = gql`
    query GetMessages($id: String!){
        users(id: $id) {
           id
           name
           message
        }
    }
`
export const ADD_TODO = gql`
    mutation sendMessage($type: String!, $id: String) {
        sendMessage(type: $type, id: $id)
    }
`;

export const COMMENTS_SUBSCRIPTION = gql`
    subscription OnCommentAdded($postID: ID!) {
        commentAdded(postID: $postID){
            type
            id
        }
    }
`;