import { Hterm } from "./hterm";
import { Xterm } from "./xterm";
import { Terminal, WebTTY, protocols, jidHandler, Icallback, WebTTYFactory } from "./webtty";
import { ConnectionFactory } from "./websocket";
import { InitializeApp, FireTTY, DisableShareBtn } from "./firetty";

// @TODO remove these
declare var gotty_auth_token: string;
declare var gotty_term: string;

var master = false;


function handleTerminalOptions(elem, option, event="optionchange") {
    var flag = true;
    if (option!==null && elem!==null) {
        var javaframe = elem.getElementsByClassName("javaframe")[0];
        if (javaframe !== undefined) {
            elem.removeChild(javaframe);
        }
        switch (option) {
                case "java":
                    // code...
                    if (event==="optionrun") {
                        break;
                    }
                    var iframe = document.createElement("IFRAME");
                    iframe.setAttribute("class","javaframe");
                    iframe.setAttribute("src","https://tryjshell.org");
                    iframe.setAttribute("style","width: inherit; height: inherit; border: 0px;");
                    elem.appendChild(iframe);
                    DisableShareBtn(option);
                    flag=false;
                    break;

                case "javascript":
                    // code...
                    var iframe = document.createElement("IFRAME");
                    iframe.setAttribute("class","javaframe");
                    iframe.setAttribute("src","./jsconsole.html");
                    iframe.setAttribute("style","width: inherit; height: inherit; border: 0px;");
                    elem.appendChild(iframe);
                    DisableShareBtn(option);
                    flag=false;
                    break; 
                
                default:
                    // code...
                    flag=true;
                    break;
        }
    }
    jidHandler("");
    return flag;
}

// changes
function getSelectValue() {
    // body...
    const optionMenu = document.getElementById("optionMenu");
    if(optionMenu!==null) {
        const option = (optionMenu.getElementsByClassName("list")[0] as HTMLSelectElement).value;
        return option;
    }
    return null;
}
const optionMenu = document.getElementById("optionMenu");
if(optionMenu!==null) {
    const SelectOption = (optionMenu.getElementsByClassName("list")[0] as HTMLSelectElement);
    if (SelectOption !== null) {
        SelectOption.addEventListener("change", ActionOnChange);
    }
}

export function ActionOnChange() {
    // body...
    const elem = document.getElementById("terminal");
    if (elem !== null) {
        var event = new Event('optionchange');
        elem.dispatchEvent(event);
    };
}

function fetchEditorContent() {
    var editor: any = window["editor"];
    if( editor.env && editor.env.editor && editor.env.editor.getValue && (typeof(editor.env.editor.getValue) === "function")) {
        return btoa(editor.env.editor.getValue());
    }
    return "";
}

function updatePayload(eventname="") {
    var pload: Object = {
                                "test":"test",
                        };
    if (eventname == "optionrun") {
        pload["IdeLang"] = getSelectValue();
        pload["IdeContent"] = fetchEditorContent(); 
    }
    return pload;
}

var hash = window.location.hash.replace(/#/g, '');
if (!hash) {
    master = true;
} else {
    master = false;
}
InitializeApp();

const elem = document.getElementById("terminal")
if (elem !== null) {
    var term: Terminal;
    var wt: WebTTYFactory;
    var ft: WebTTYFactory;
    var closer: Icallback;
    var factory: ConnectionFactory;
    // payload to transmit body and other large data over websocket
    var payload: Object = {
                                "test":"test",
                          };
    if (gotty_term == "hterm") {
        term = new Hterm(elem);
    } else {
        term = new Xterm(elem);
    }
    if (master) {
        const httpsEnabled = window.location.protocol == "https:";
        const url = (httpsEnabled ? 'wss://' : 'ws://') + window.location.host + window.location.pathname + 'ws_c';
        const args = window.location.search;
        ft = new FireTTY(term, master);
        factory = new ConnectionFactory(url, protocols);
        wt = new WebTTY(term, factory, ft, payload, args, gotty_auth_token);
    } else {
        wt = new FireTTY(term, master);
    }
    closer = wt.open();
    console.log("webtty created: ");

    window.addEventListener("unload", () => {
        console.log("closing connection")
        closer();
        term.close();
    });
    elem.addEventListener("optionchange", () => {
        console.log("event caught: change");
        var event = new Event('unload');
        window.dispatchEvent(event);
        setTimeout(function(){                // timeout between two events
            //var term: Terminal;
            const option = getSelectValue();
            console.log("option caught: ",option);
            if (!handleTerminalOptions(elem, option)) {
                return;
            }
            if (gotty_term == "hterm") {
                term = new Hterm(elem);
            } else {
                term = new Xterm(elem);
            }
            
            if (option !== null) {
                if (master) {
                    const httpsEnabled = window.location.protocol == "https:";
                    const url = (httpsEnabled ? 'wss://' : 'ws://') + window.location.host + window.location.pathname + 'ws' + '_' + option;
                    const args = window.location.search;
                    ft = new FireTTY(term, master);
                    factory = new ConnectionFactory(url, protocols);
                    payload = updatePayload("optionchange");
                    wt = new WebTTY(term, factory, ft, payload, args, gotty_auth_token);
                } else {
                    wt = new FireTTY(term, master);
                }
            
                closer = wt.open();
                console.log("webtty created:");
                /*window.addEventListener("unload", () => {
                    console.log("closing connection")
                    closer();
                    term.close();
                });*/
            }
        }, 500);
    });

    //compile and run from editor
    elem.addEventListener("optionrun", () => {
        console.log("event caught: optionrun");
        var event = new Event('unload');
        window.dispatchEvent(event);
        setTimeout(function(){                // timeout between two events
            //var term: Terminal;
            const option = getSelectValue();
            console.log("option caught: ",option);
            if (!handleTerminalOptions(elem, option, "optionrun")) {
                return;
            }
            if (gotty_term == "hterm") {
                term = new Hterm(elem);
            } else {
                term = new Xterm(elem);
            }
            
            if (option !== null) {
                if (master) {
                    const httpsEnabled = window.location.protocol == "https:";
                    const url = (httpsEnabled ? 'wss://' : 'ws://') + window.location.host + window.location.pathname + 'ws' + '_' + option;
                    const args = window.location.search;
                    ft = new FireTTY(term, master);
                    factory = new ConnectionFactory(url, protocols);
                    payload = updatePayload("optionrun");
                    wt = new WebTTY(term, factory, ft, payload, args, gotty_auth_token);
                } else {
                    wt = new FireTTY(term, master);
                }
            
                closer = wt.open();
                console.log("webtty created:");
                /*window.addEventListener("unload", () => {
                    console.log("closing connection")
                    closer();
                    term.close();
                });*/
            }
        }, 500);
    });
};
