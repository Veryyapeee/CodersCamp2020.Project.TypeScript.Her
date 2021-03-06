import { GameState } from "./state";
import { evidencesArray } from "./data";
import  * as DOMTemplate from "./HTMLtemplate";
import { Puzzle } from "./puzzle";
import PuzzleCard from "./puzzleCard";
import {Evidence} from './evidence';
import {getStateLS} from './getLS';

//Update actionPoints interface
const updateActionDOM = (number: number): void => {
  const actionPoints = document.querySelector("#actionPoints") as HTMLElement;
  actionPoints.innerHTML = number.toString();
};

//Update storyBook DOM
const updateStoryBook = (): void => {
  //Get state from localStorage
  const state = getStateLS();
  const storyBook = document.querySelector(".board__storybook") as HTMLElement;
  const text = state.storyBook[state.currentPage];
  const content = DOMTemplate.pageTemplate(
    text,
    state.currentPage,
    state.storyBook.length - 1
  );
  storyBook.innerHTML = content;
};

const changePageStoryBook = (index: number) => {
  //Get state from localStorage
  const state = getStateLS();
  const storyBook = document.querySelector(".board__storybook") as HTMLElement;
  const previousText = state.storyBook[index];
  const previousContent = DOMTemplate.pageTemplate(
    previousText,
    state.currentPage,
    state.storyBook.length - 1
  );
  storyBook.innerHTML = previousContent;
};

function initStoryBook(){
  const storyBook = document.querySelector(".board__storybook") as HTMLElement;
  storyBook.innerHTML = '<h1 style="text-align: center;">Story Book</h1>';
}

//Update evidences DOM
const updateEvidencesDOM = (): void => {
  const state = getStateLS();
  //Get the HTML container
  const cnt = document.querySelector("#interface__evidences") as HTMLElement;

  cnt.innerHTML = `<h2 class="interface__element--title">Evidence</h2>`;

  //Get evidences from the state
  const DOMEvidences : Array<Evidence> = [];
  state.userEvidencesId.forEach((IdUser : string)=>{
    evidencesArray.forEach((evidence : Evidence)=>{
      if(IdUser === evidence.evidenceID){
        DOMEvidences.push(evidence);
        cnt.innerHTML += DOMTemplate.evidenceTemplate(evidence);
      }
    })
  })
};

//Update puzzleInterface DOM
/*
    @param {state} - GameState
    @param {puzzleArray} - array of all the puzzles
*/
const updatePuzzleDOM = (
  state: GameState,
  puzzleArray: Array<Puzzle>
): void => {
  //Get puzzle HTML container
  const cnt = document.querySelector("#interface__puzzle") as HTMLElement;

  //Reset DOM element
  cnt.innerHTML = '<h2 class="interface__element--title">Puzzles</h2>';

  //Take all the puzzle's that are in the gameState
  state.userPuzzlesId.forEach((statePuzzleID) => {
    puzzleArray.forEach((puzzleObj) => {
      if (statePuzzleID === puzzleObj.id) {
        //Create DOM element base on the template
        cnt.innerHTML += DOMTemplate.puzzleTemplate(puzzleObj);
      }
    });
  });
};

//Solve puzzle MODAL
/*
    @param {puzzleID} - ID of current puzzle
    @param {puzzleArray} - array of all puzzle objects
    @param {puzzleCardArray} - array of all puzzle cards
*/
const solvePuzzleModal = (
  puzzleID: string,
  puzzleArray: Array<Puzzle>,
  puzzleCardArray: Array<PuzzleCard>
) => {
  //Get the current puzzle
  const currentPuzzle: Puzzle = puzzleArray.find((el) => el.id === puzzleID)!;
  //Get all puzzleCards that the player found
  const visitedCards: Array<PuzzleCard> = [];
  currentPuzzle.visitedCards.forEach((visitedID) => {
    puzzleCardArray.forEach((puzzleCardObj) => {
      if (visitedID === puzzleCardObj.id) {
        visitedCards.push(puzzleCardObj);
      }
    });
  });
  //Put data into DOM
  (document.querySelector(".puzzle") as HTMLElement).innerHTML = `
        <div class='puzzle__text'>
            ${DOMTemplate.puzzleSolveTemplate(currentPuzzle, visitedCards)}
        </div>
    `;
};

//Update progressPoints DOM
const updateProgressDOM = (): void => {
  const state = getStateLS();
  //Get state from localStorage
  switch(state.progressPoints){
    case 1:
      (document.querySelector('#token1') as HTMLElement).style.opacity = '1';
      break;
    case 2:
      (document.querySelector('#token2') as HTMLElement).style.opacity = '1';
      (document.querySelector('#token1') as HTMLElement).style.opacity = '1';
      break;
    default:
      (document.querySelector('#token2') as HTMLElement).style.opacity = '0.4';
      (document.querySelector('#token1') as HTMLElement).style.opacity = '0.4';
  }
};

//Update area state
/*
    @param {state} - GameState
*/
const updateAreaDOM = (state: GameState): void => {
  state.visitedAreas.forEach((n: string) => {
    (document.querySelector(`#${n}`) as HTMLElement).classList.add("map__squareVisited");
  });
};

//Update story line
const updateStoryLine = () : void =>{
  //Get puzzle HTML container
  const cnt = document.querySelector("#interface__storyLine") as HTMLElement;

  //Reset DOM element
  cnt.innerHTML = '<h2 class="interface__element--title">Story Line Progress</h2>';

  //Get state from LS
  const state = getStateLS();

  //Put text to the container
  state.storyline.forEach((text : string) => {
    cnt.innerHTML += DOMTemplate.storyLineTemplate(text);
  })
}

export {
  updateActionDOM,
  updateProgressDOM,
  updatePuzzleDOM,
  updateAreaDOM,
  updateEvidencesDOM,
  updateStoryBook,
  solvePuzzleModal,
  changePageStoryBook,
  initStoryBook,
  updateStoryLine
}