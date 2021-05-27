## Project Explanation
This is a full stack apollo messaging application. A few major things to keep in mind

1. As it is not a production application, I did not implement a scalable pub/sub
   implementation. I.E. I currently use an in memory pub/sub which would not work on a scaled application
1. I did not spend much time on the front end design. I tried to minimize time spent on the application,
   and design usually takes a non-negligible amount of time, and seemed out of scope.
1. This is the first time I used both node.js and mongoDb, so I would not recommend my implementations to
   be considered for anything in production.
1. I do not have automated testing, normally I would have unit tests for server and front end
   slice tests for contract testing, and cypress for journey and slice tests.
1. I normally would do something type safe. I would auto generate the types from the graphql types


### High level requirements
1. A short text message can be sent from one user (the sender) to another
   (the recipient).
   - I implemented a general text mutation with subscription. It is more of a group 
   chat, anyone joining the client can be a part of the conversation. Thought of it more of an 
     unrestricted group chat, rather than a protected end to end single user chat.

2. Recent messages can be requested for a recipient from a specific sender 
   1. with a limit of 100 messages 
   1. or all messages in last 30 days.
   - I implemented a limit of 100 messages, and expire each messages after 30 days
   
3. Recent messages can be requested from all senders - with a limit of 100
   messages or all messages in last 30 days.
   - this can be done by clearing out the `Sender Name` field
4. Document your api like you would be presenting to a web team for use.
   - I like code as documentation, and examples are the most helpful, so this is a full stack app
5. Show us how you would test your api.
   - see point 4 above. 
6. Ensure we can start / invoke your api.
   - README instructions in client and server should have everything you need.