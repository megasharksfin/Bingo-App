import { IBingoNumber } from './ibingo-number';

export interface IBingoCard {
  bingoC: IBingoNumber[];
  bingoL: IBingoNumber[];
  bingoO: IBingoNumber[];
  bingoR: IBingoNumber[];
  bingoX: IBingoNumber[];
}
