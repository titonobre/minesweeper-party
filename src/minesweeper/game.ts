// Credits to Christian Johansen for game logic:
// https://github.com/cjohansen/react-sweeper

export interface GameOptions {
  cols: number;
  rows: number;
  mines: number;
}

export interface Game {
  cols: number;
  rows: number;
  playingTime: number;
  isDead: boolean;
  isSafe: boolean;
  tiles: Tile[];
}

export interface Tile {
  id: number;
  isRevealed: boolean;
  isMine: boolean;
  isFlagged: boolean;
  threatCount: number;
}

function shuffle(random: () => number) {
  return random() - 0.5;
}

function idx(game: Game, tile: number) {
  if (tile < 0) { return null; }
  return game.tiles[tile] ? tile : null;
}

function onWEdge(game: Game, tile: number) {
  return tile % game.cols === 0;
}

function onEEdge(game: Game, tile: number) {
  return tile % game.cols === game.cols - 1;
}

function nw(game: Game, tile: number) {
  return onWEdge(game, tile) ? null : idx(game, tile - game.cols - 1);
}

function n(game: Game, tile: number) {
  return idx(game, tile - game.cols);
}

function ne(game: Game, tile: number) {
  return onEEdge(game, tile) ? null : idx(game, tile - game.cols + 1);
}

function e(game: Game, tile: number) {
  return onEEdge(game, tile) ? null : idx(game, tile + 1);
}

function se(game: Game, tile: number) {
  return onEEdge(game, tile) ? null : idx(game, tile + game.cols + 1);
}

function s(game: Game, tile: number) {
  return idx(game, tile + game.cols);
}

function sw(game: Game, tile: number) {
  return onWEdge(game, tile) ? null : idx(game, tile + game.cols - 1);
}

function w(game: Game, tile: number) {
  return onWEdge(game, tile) ? null : idx(game, tile - 1);
}

const directions = [nw, n, ne, e, se, s, sw, w];

function neighbours(game: Game, tile: number) {

  return directions.map(dir => game.tiles[dir(game, tile)]).filter(tilex => tilex);
}

function getMineCount(game: Game, tile: number) {
  const nbs = neighbours(game, tile);
  return nbs.filter(tilex => tilex.isMine).length;
}

function isSafe(game: Game) {
  const tiles = game.tiles;
  const mines = tiles.filter(tile => tile.isMine);

  const revealedTiles = tiles.filter(tile => tile.isRevealed);
  const revealedMines = mines.filter(tile => tile.isRevealed);

  return revealedMines.length === 0 && tiles.length - mines.length === revealedTiles.length;
}

function isMine(game: Game, tile: number) {
  return game.tiles[tile].isMine;
}

function attemptWinning(game: Game): Game {
  return isSafe(game) ? { ...game, isSafe: true } : game;
}

function revealMine(tile: Tile) {
  return tile.isMine ? { ...tile, isRevealed: true } : tile;
}

function revealMines(game: Game): Game {
  return {
    ...game,
    tiles: game.tiles.map(revealMine)
  };
}

function updateTile(tiles: Tile[], id: number, updater: (tile: Tile) => Tile) {
  return tiles.map(tile => {
    if (tile.id === id) {
      return updater(tile);
    }

    return tile;
  });
}

function addThreatCount(game: Game, tile: number): Game {
  return {
    ...game,
    tiles: updateTile(game.tiles, tile, tilex => ({ ...tilex, threatCount: getMineCount(game, tile) }))
  };
}

function revealAdjacentSafeTiles(game: Game, tile: number): Game {
  if (isMine(game, tile)) {
    return game;
  }

  const game1 = addThreatCount(game, tile);

  const game2 = {
    ...game1,
    tiles: updateTile(game1.tiles, tile, tilex => ({ ...tilex, isRevealed: true }))
  };

  if (game2.tiles[tile].threatCount === 0) {

    return directions
      .map(dir => dir(game2, tile))
      .filter(tilex => tilex !== null)
      .reduce(function (game2a, pos) {
        return !game2a.tiles[pos].isRevealed ?
          revealAdjacentSafeTiles(game2a, pos) : game2a;
      }, game2);
  }
  return game2;
}

function initTiles(rows: number, cols: number, mines: number, random: () => number): Tile[] {
  const tilesWithMines = Array(mines).fill({ isMine: true, isRevealed: false });
  const tilesClean = Array(rows * cols - mines).fill({ isRevealed: false });

  const allTiles = [...tilesWithMines, ...tilesClean].sort(() => shuffle(random));

  return allTiles.map((tile, i) => ({ ...tile, id: i }));
}

export function createGame(options: GameOptions, random = Math.random): Game {
  return {
    cols: options.cols,
    rows: options.rows,
    playingTime: 0,
    isDead: false,
    isSafe: false,
    tiles: initTiles(options.rows, options.cols, options.mines, random)
  };
}

export function isGameOver(game: Game) {
  return isSafe(game) || game.isDead;
}

export function revealTile(game: Game, tile: number): Game {

  const updated = !game.tiles[tile] ?
    game
    :
    {
      ...game,
      tiles: updateTile(game.tiles, tile, tilex => ({ ...tilex, isRevealed: true }))
    };

  if (isMine(updated, tile)) {
    return revealMines({ ...updated, isDead: true });
  } else {
    const revealed = revealAdjacentSafeTiles(updated, tile);

    return attemptWinning(revealed);
  }
}

export function setFlag(game: Game, tile: number, flag: boolean): Game {

  return !game.tiles[tile] ?
    game
    :
    {
      ...game,
      tiles: updateTile(game.tiles, tile, tilex => ({ ...tilex, isFlagged: flag }))
    };
}

export function simplify(game: Game): Game {
  return {
    ...game,
    tiles: game.tiles.map(tile => {

      return <Tile>{
        id: tile.id,
        ...(
          tile.isRevealed
            ? { isRevealed: tile.isRevealed, isMine: tile.isMine, threatCount: tile.threatCount }
            : {}
        ),
      };
    })
  };
}
