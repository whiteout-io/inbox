var inbox = require(".."),
    util = require("util");

var client = inbox.createConnection(false, "imap.gmail.com", {
    secureConnection: true,
    auth: {
        user: "safewithme.testuser@gmail.com",
        pass: "hellosafe"
    }
});

client.connect();

client.on("connect", function() {
    client.openMailbox("INBOX", function(error, mailbox) {
        if (error) throw error;

        console.log('\n\n> listing messages \n');
        client.listMessages(0, 20, function(error, messages) {
            messages.forEach(function(msg) {
                console.log(msg.UID + '\t' + msg.title);
            });
            console.log('\n\n> search unread messages in current folder \n');
            client.unreadMessages(function(error, unreadCount) {
                console.log('unread messages: ' + unreadCount + '\n');

                process.exit(1);
            });
        });

        // client.createStream({
        //     uid: 583,
        //     part: 'HEADER'
        // }).pipe(process.stdout, {
        //     end: false
        // });


        /*
        client.updateFlags(52, ["\\Answered", "\\Flagged"], "+", console.log)
        client.removeFlags(52, ["\\Answered", "\\Flagged"], console.log)
        client.addFlags(52, ["\\Flagged"], console.log)
        */

        // function walkMailboxes(name, level, node){
        //     level = level || 0;
        //     (node.listChildren || node.listMailboxes).call(node, function(err, list){
        //         if(err){return;}
        //         console.log("> "+name);
        //         for(var i=0; i<list.length; i++){
        //            console.log(list[i]);
        //            if(list[i].hasChildren){
        //                 walkMailboxes(list[i].name, level+1, list[i]);
        //            }
        //         }
        //     });
        // }

        // console.log(12)
        // client.getMailbox("[Gmail]/Saadetud kirjad", console.log);

        //walkMailboxes("ROOT", 0, client);
        /*
        client.listMailboxes(function(error, mailboxes){
            console.log(mailboxes)
            mailboxes.forEach(function(mailbox){
                if(mailbox.hasChildren){
                    mailbox.createChild("andristest", console.log);
                }
            })
        });
        */

        //client.listChildren(console.log)

    });

    // on new messages, print to console
    // client.on("new", function(message){
    //     console.log("New message:");
    //     console.log(util.inspect(message, false, 7));

    //     client.createMessageStream(message.UID).pipe(process.stdout, {end: false});

    // });
});