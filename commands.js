const commands = [
    { board: ['board', 'b'] },
    { thread: ['thread', 't'] },
    { id: ['id', 'i'] }
]

function getCommand (c) {
    for (const command of commands) {
        for (const key in command) {
            for (const i of command[key]) {
                if (i == c) return key                
            }
        }
    }
    return false
}

module.exports = { commands, getCommand }