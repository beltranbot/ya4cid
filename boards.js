const boards = [
    {
        board: 'v',
        ids: false,
        name: '',
    },
    {
        board: 'soc',
        ids: true,
        name: '',
    },
]

function boardExists(b) {
    for (const board of boards) {
        if (board.board = b.toLowerCase()) return true        
    }
    return false
}

module.exports = { boardExists }