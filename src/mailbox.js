if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(function (require) {
    'use strict';

    var mailboxNames = {
        "sent": ["aika", "bidaliak", "bidalita", "dihantar", "e rometsweng", "e tindami", "elküldött", "elküldöttek", "enviadas", "enviadas", "enviados", "enviats", "envoyés", "ethunyelweyo", "expediate", "ezipuru", "gesendete", "gestuur", "gönderilmiş öğeler", "göndərilənlər", "iberilen", "inviati", "išsiųstieji", "kuthunyelwe", "lasa", "lähetetyt", "messages envoyés", "naipadala", "nalefa", "napadala", "nosūtītās ziņas", "odeslané", "padala", "poslane", "poslano", "poslano", "poslané", "poslato", "saadetud", "saadetud kirjad", "sendt", "sendt", "sent", "sent items", "sent messages", "sända poster", "sänt", "terkirim", "ti fi ranṣẹ", "të dërguara", "verzonden", "vilivyotumwa", "wysłane", "đã gửi", "σταλθέντα", "жиберилген", "жіберілгендер", "изпратени", "илгээсэн", "ирсол шуд", "испратено", "надіслані", "отправленные", "пасланыя", "юборилган", "ուղարկված", "נשלחו", "פריטים שנשלחו", "المرسلة", "بھیجے گئے", "سوزمژہ", "لېګل شوی", "موارد ارسال شده", "पाठविले", "पाठविलेले", "प्रेषित", "भेजा गया", "প্রেরিত", "প্রেরিত", "প্ৰেৰিত", "ਭੇਜੇ", "મોકલેલા", "ପଠାଗଲା", "அனுப்பியவை", "పంపించబడింది", "ಕಳುಹಿಸಲಾದ", "അയച്ചു", "යැවු පණිවුඩ", "ส่งแล้ว", "გაგზავნილი", "የተላኩ", "បាន​ផ្ញើ", "寄件備份", "寄件備份", "已发信息", "送信済みﾒｰﾙ", "발신 메시지", "보낸 편지함"],
        "trash": ["articole șterse", "bin", "borttagna objekt", "deleted", "deleted items", "deleted messages", "elementi eliminati", "elementos borrados", "elementos eliminados", "gelöschte objekte", "item dipadam", "itens apagados", "itens excluídos", "mục đã xóa", "odstraněné položky", "pesan terhapus", "poistetut", "praht", "silinmiş öğeler", "slettede beskeder", "slettede elementer", "trash", "törölt elemek", "usunięte wiadomości", "verwijderde items", "vymazané správy", "éléments supprimés", "видалені", "жойылғандар", "удаленные", "פריטים שנמחקו", "العناصر المحذوفة", "موارد حذف شده", "รายการที่ลบ", "已删除邮件", "已刪除項目", "已刪除項目"],
        "junk": ["bulk mail", "correo no deseado", "courrier indésirable", "istenmeyen", "istenmeyen e-posta", "junk", "levélszemét", "nevyžiadaná pošta", "nevyžádaná pošta", "no deseado", "posta indesiderata", "pourriel", "roskaposti", "skräppost", "spam", "spam", "spamowanie", "søppelpost", "thư rác", "спам", "דואר זבל", "الرسائل العشوائية", "هرزنامه", "สแปม", "‎垃圾郵件", "垃圾邮件", "垃圾電郵"],
        "drafts": ["ba brouillon", "borrador", "borrador", "borradores", "bozze", "brouillons", "bản thảo", "ciorne", "concepten", "draf", "drafts", "drög", "entwürfe", "esborranys", "garalamalar", "ihe edeturu", "iidrafti", "izinhlaka", "juodraščiai", "kladd", "kladder", "koncepty", "koncepty", "konsep", "konsepte", "kopie robocze", "layihələr", "luonnokset", "melnraksti", "meralo", "mesazhe të padërguara", "mga draft", "mustandid", "nacrti", "nacrti", "osnutki", "piszkozatok", "rascunhos", "rasimu", "skice", "taslaklar", "tsararrun saƙonni", "utkast", "vakiraoka", "vázlatok", "zirriborroak", "àwọn àkọpamọ́", "πρόχειρα", "жобалар", "нацрти", "нооргууд", "сиёҳнавис", "хомаки хатлар", "чарнавікі", "чернетки", "чернови", "черновики", "черновиктер", "սևագրեր", "טיוטות", "مسودات", "مسودات", "موسودې", "پیش نویسها", "ڈرافٹ/", "ड्राफ़्ट", "प्रारूप", "খসড়া", "খসড়া", "ড্ৰাফ্ট", "ਡ੍ਰਾਫਟ", "ડ્રાફ્ટસ", "ଡ୍ରାଫ୍ଟ", "வரைவுகள்", "చిత్తు ప్రతులు", "ಕರಡುಗಳು", "കരടുകള്‍", "කෙටුම් පත්", "ฉบับร่าง", "მონახაზები", "ረቂቆች", "សារព្រាង", "下書き", "草稿", "草稿", "草稿", "임시 보관함"]
    };

    /**
     * Create a mailbox object
     *
     * @memberOf mailbox
     * @constructor
     * @param {Object} options Options object
     */

    function Mailbox(options) {
        options = options || {};

        Object.defineProperty(this, "client", {
            value: options.client || {},
            enumerable: false
        });
        Object.defineProperty(this, "tags", {
            value: options.tags || [],
            enumerable: false,
            writable: true
        });

        this.name = options.name || "";
        this.path = options.path || this.name;
        this.type = options.type || (this.client._capabilities.indexOf("XLIST") < 0 && this.detectType() || "Normal");
        this.delimiter = options.delimiter || this.client._mailboxDelimiter || "";
    }

    /**
     * Open the mailbox
     *
     * @param {Object} [options] Optional options object
     * @param {Boolean} [options.readOnly] If set to true, open the mailbox in read-only mode (seen/unseen flags won't be touched)
     * @param {Function} callback Callback function to run when the mailbox is opened
     */
    Mailbox.prototype.open = function (options, callback) {
        this.client.openMailbox(this.path, options, callback);
    };

    /**
     * Detects the type by the name of the mailbox
     */
    Mailbox.prototype.detectType = function () {
        return detectMailboxType(this.name);
    };

    /**
     * Lists children for the mailbox
     *
     * @param {String} [path] If set, list only selected path info but not the children
     * @param {Function} callback Callback function to run with the mailbox list
     */
    Mailbox.prototype.listChildren = function (path, callback) {
        if (!callback && typeof path == "function") {
            callback = path;
            path = undefined;
        }

        var command = "LIST",
            suffix = "";

        path = this.client._escapeString(path || (this.path ? this.path + this.delimiter + "%" : "%"));

        if (this.client._capabilities.indexOf("SPECIAL-USE") >= 0) {
            command = "LIST";
            suffix = " RETURN (SPECIAL-USE)";
        } else if (this.client._capabilities.indexOf("XLIST") >= 0) {
            command = "XLIST";
        }

        this.client._send(command + " " + this.client._escapeString(this.client._rootPath) + " " + path + suffix, (function (status) {
            this.listSubscribed(path, this.client._mailboxList, callback);
        }).bind(this), (function () {
            this.client._mailboxList = [];
            this.client._armTimeout(callback);
        }).bind(this));

    };

    /**
     * Fetches subscribed mailboxes
     *
     * @param {String} path Parent mailbox
     * @param {Array} xinfo Results from XLIST or LIST
     * @param {Function} callback Callback function to run with the mailbox list
     */
    Mailbox.prototype.listSubscribed = function (path, xinfo, callback) {
        if (!callback && typeof xinfo == "function") {
            callback = xinfo;
            xinfo = undefined;
        }

        xinfo = xinfo || [];

        this.client._send("LSUB " + this.client._escapeString(this.client._rootPath) + " " + path,
            this.client._handlerTaggedLsub.bind(this.client, xinfo, callback), (function () {
                this.client._mailboxList = [];
                this.client._armTimeout(callback);
            }).bind(this));
    };

    /**
     * Creates a new mailbox and subscribes to it
     *
     * @param {String} name Name of the mailbox
     * @param {Function} callback Callback function to run with the created mailbox object
     */
    Mailbox.prototype.createChild = function (name, callback) {
        var path = (this.path ? this.path + this.delimiter + name : name);
        this.client._send("CREATE " + this.client._escapeString(path), (function (status) {
            if (status == "OK") {
                this.client._send("SUBSCRIBE " + this.client._escapeString(path), (function (status) {
                    if (typeof callback == "function") {
                        callback(null, new this.client.Mailbox({
                            client: this.client,
                            path: path,
                            name: name,
                            delimiter: this.delimiter,
                            tags: []
                        }));
                    }
                }).bind(this), this.client._armTimeout.bind(this.client, callback));
            } else {
                callback(new Error("Creating mailbox failed"));
            }
        }).bind(this), this.client._armTimeout.bind(this.client, callback));
    };

    /**
     * Returns mailbox type detected by the name of the mailbox
     *
     * @param {String} mailboxName Mailbox name
     * @return {String} Mailbox type
     */

    function detectMailboxType(mailboxName) {
        mailboxName = (mailboxName || "").toString().trim().toLowerCase();

        if (mailboxNames.sent.indexOf(mailboxName) >= 0) {
            return "Sent";
        }

        if (mailboxNames.trash.indexOf(mailboxName) >= 0) {
            return "Trash";
        }

        if (mailboxNames.junk.indexOf(mailboxName) >= 0) {
            return "Junk";
        }

        if (mailboxNames.drafts.indexOf(mailboxName) >= 0) {
            return "Drafts";
        }

        return "Normal";
    }

    return {
        Mailbox: Mailbox,
        detectMailboxType: detectMailboxType
    };

});