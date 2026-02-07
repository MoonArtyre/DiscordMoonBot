const GreetingWordList = [
    "hi",
    "hello",
    "hey",
    "ey",
    "hoi",
    "hallo",
    "hola"
]

const BotName = "denji";

function GetRandomGreeting(): string {
    const chosenId = Math.floor(Math.random() * GreetingWordList.length)
    return GreetingWordList[chosenId]
}

function CheckGreeting(wordCheck: string): boolean {
    if (GreetingWordList.includes(wordCheck))
        return true

    return false
}

function CheckBotname(wordCheck: string): boolean {
    if (wordCheck === BotName)
        return true

    if (wordCheck.length === BotName.length) {
        for (let i = 0; i < wordCheck.length; i++) {
            let foundChar = false;

            for (let j = 0; j < BotName.length; j++) {
                if (wordCheck.charAt(i) === BotName.charAt(j)) {
                    foundChar = true
                    break;
                }
            }

            if (foundChar == false) {
                //Could find character in botname
                return false;
            }
        }

        //All chars in the checked word exist in the botname, very like bot is meant
        return true
    }

    return false
}

export = {
    CheckBotname,
    CheckGreeting,
    GetRandomGreeting
}