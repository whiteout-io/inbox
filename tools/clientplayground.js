var inbox = require(".."),
    util = require("util");

var client = inbox.createConnection(false, "imap.gmail.com", {
    timeout: 5000,
    secureConnection: true,
    auth: {
        user: "safewithme.testuser@gmail.com",
        pass: "hellosafe"
    }
});

client.connect();
client.on('error', function(error) {
    throw error;
});

client.on("connect", function() {
    console.log('\n> listing mailboxes... \n');
    client.listMailboxes(function(error, mailboxes) {
        if (error) {
            throw error;
        }
        mailboxes.forEach(function(mailbox) {
            console.log(mailbox.path);
        });

        console.log('\n> opening mailbox... \n');
        client.openMailbox("INBOX", function(error) {
            if (error) {
                throw error;
            }
            console.log('mailbox opened! \n');

            console.log('\n> listing messages... \n');
            client.listMessages(0, 200, function(error, messages) {
                if (error) {
                    throw error;
                }
                messages.forEach(function(msg) {
                    console.log(msg.UID + '\t' + msg.title);
                });

                console.log('\n> listening for new messages... \n');
                client.on("new", function(message) {
                    console.log("New incoming message: " + message.title);
                });
            });
        });
    });
});

// on new messages, print to console
// client.on("new", function(message){
//     console.log("New message:");
//     console.log(util.inspect(message, false, 7));

//     client.createMessageStream(message.UID).pipe(process.stdout, {end: false});

// });