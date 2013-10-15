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
client.on('error', function (error) {
    throw error;
});

client.on("connect", function () {
    console.log('\n> listing mailboxes... \n');
    client.listMailboxes(function (error, mailboxes) {
        if (error) {throw error;}
        mailboxes.forEach(function (mailbox) {
            console.log(mailbox.path);
            if (mailbox.path === '[Gmail]') {
                console.log('\n> creating mailbox... \n');
                mailbox.createChild("andristest", function (error, mbx) {
                    if (error) {throw error;}
                    console.log(mbx.path);

                    console.log('\n> opening mailbox... \n');
                    client.openMailbox("INBOX", function (error) {
                        if (error) {throw error;}
                        console.log('mailbox opened! \n');

                        console.log('\n> listing messages... \n');
                        client.listMessages(0, 200, function (error, messages) {
                            if (error) {throw error;}
                            messages.forEach(function (msg) {
                                console.log(msg.UID + '\t' + msg.title);
                            });


                            console.log('\n> search unread messages in current folder... \n');
                            client.unreadMessages(function (error, unreadCount) {
                                if (error) {throw error;}
                                console.log('unread messages: ' + unreadCount + '\n');

                                console.log('\n> streaming header for uid 804... \n');

                                var stream = client.createStream({
                                    uid: 804,
                                    part: 'HEADER'
                                });

                                stream.on('data', function (data) {
                                    console.log(data.toString('binary'));
                                });
                                stream.on('end', function (data) {
                                    client.fetchFlags(804, console.log);
                                    client.removeFlags(52, ["\\Answered", "\\Flagged"], console.log);
                                    client.addFlags(52, ["\\Flagged"], console.log);
                                });
                            });
                        });
                    });
                });
            }
        });


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
    });

    // on new messages, print to console
    // client.on("new", function(message){
    //     console.log("New message:");
    //     console.log(util.inspect(message, false, 7));

    //     client.createMessageStream(message.UID).pipe(process.stdout, {end: false});

    // });
});