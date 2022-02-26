// This is where we create an array of the phrases we want to randomly select from
// These intentionally make no sense
var terms = ["document.hack_security: \"TARGET AQUIRED\"",
    "execute cyber_attack.exe", "crack hashed bitmap", "sudo bash hackSecureBank.subtract($10000){<br/>&#9;transfer(amount).to(offshore_acount);<br/>}", "hacker.decrypt(account: administrator, password: BRUTE_FORCE) attack=true --anonymous --global", "try sudo apt get install hacker-tools.exe", "execute malware.exe {<br/>&#9;type=trojan, <br/>&#9;location=Washington DC, <br/>&#9;activate=4676HFDVD*L, <br/>&#9;deactivation_code=*******<br/>}", "westernUnion.wireTransfer(300.39933 BTC){<br/>&#9;authenticationToken=fn5GDh7dh7Hdijf3j<br/>&#9;type=untraceable<br/>}", "activate dark_web.exe open tor.exe funnel{<br/>&#9;traffic=anonymous,<br/>&#9;data_stream(){<br/>&#9&#9;IO.write.hashcode();<br/>&#9}<br/>}", "hacker-tools.decrypt(secure.Server, type.Government, location.Secret){<br/>&#9;hashmap=F378JDWiji#fe(){<br/>&#9;&#9;security=SSH,<br/>&#9;&#9;method=BRUTE_FORCE<br/>&#9;}<br/>&#9;details.Decode();<br/>}"
];
// This is where we create a copy of our terms array so we can remove values from it later on
var copy = [...terms];
// This adds an event listener to the entire document checking for a keypress
document.addEventListener("keydown", function() {
    // This checks to see if we have already removed all the phrases from our terms array
    if (terms.length == 0) {
        // This restores the terms array by copying the array named copy
        terms = [...copy];
    }
    // This chooses a random number in the limits of [0,terms.length)
    var rand = Math.floor(Math.random() * (terms.length));
    // This removes a random phrase from our terms array
    var phrase = terms.splice(rand, 1);
    // This appends the random phrase to our code window and adds the next line's C:>
    document.getElementById("code").innerHTML += phrase + "<br/>C:> ";
    // This scrolls to the bottom automatically for us every time a key is pressed
    window.scrollTo(0, document.body.scrollHeight);
})