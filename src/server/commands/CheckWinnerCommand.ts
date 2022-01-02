import { Command } from '@colyseus/command'
import { Client } from 'colyseus'
import ITicTacToeState, { Cell } from '../../types/ITicTacToeState'
import NextTurnCommand from './NextTurnCommand'

type Payload = {

}


const getValueAt = (board: number[], row: number, col: number) => {


	const idx = (row * 3) + col
	return board[idx]
}

const wins = [
	//Horizontal match
	[{ row: 0, col: 0 }, { row: 0, col: 1 }, { row: 0, col: 2 }],
	[{ row: 1, col: 0 }, { row: 1, col: 1 }, { row: 1, col: 2 }],
	[{ row: 2, col: 0 }, { row: 2, col: 1 }, { row: 2, col: 2 }],
	//vertical match
	[{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 2, col: 0 }],
	[{ row: 0, col: 1 }, { row: 1, col: 1 }, { row: 2, col: 1 }],
	[{ row: 0, col: 2 }, { row: 1, col: 2 }, { row: 2, col: 2 }],
	//diagonal match
	[{ row: 0, col: 0 }, { row: 1, col: 1 }, { row: 2, col: 2 }],
	[{ row: 0, col: 2 }, { row: 1, col: 1 }, { row: 2, col: 0 }]
]

export default class CheckWinnerCommand extends Command<ITicTacToeState, Payload>
{
	private determineWin() {
		let hasWinner = true
		for (let i = 0; i < wins.length; ++i) {
			const win = wins[i]
			for (let j = 1; j < win.length; ++j) {
				const prevCell = win[j - 1]
				const cell = win[j]

				const prevValue = getValueAt(this.state.board, prevCell.row, prevCell.col)
				const cellValue = getValueAt(this.state.board, cell.row, cell.col)

				if (prevValue !== cellValue || prevValue === Cell.Empty) {
					// no win
					hasWinner = false
					break
				}
			}

			if (hasWinner) {
				return "win"
			}
		}
		if(!hasWinner && this.room.state.moves==9)
		{
			return "Tie"
		}
		return false
	}

	execute() {
		const win = this.determineWin()
		if (win=="win") {
			// set winnerPlayer on state
			this.state.winningPlayer = this.state.activePlayer
		}
		else if(win=="Tie")
		{
			this.state.winningPlayer=-2;
		}
		else {
			return [
				new NextTurnCommand()
			]
		}
	}
}