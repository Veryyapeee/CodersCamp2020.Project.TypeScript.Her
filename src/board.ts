//Import
import {newPuzzle, newPuzzleCard} from './puzzleAction';
import { BoardField} from './boardField';
import {GameState} from './state';
import ActionPoints from './actionPoints';
import Paragraph from './paragraph';
import{ActionPointsEnum, BoardState, BoardContent} from './ENUM';
import {Puzzle} from './puzzle';
import PuzzleCard from './puzzleCard';

//Board movement event
//Move later to index.ts
document.addEventListener('click',(e: any) : void=>{
    
    if(e.target.className === 'boardArea'){

        //Getting ID of DOM element to find boardArea object
        const areaID: string = e.target.id;

        //Getting current board object
        const currentField = getBoard(areaID, boardAreas)

        //Get the current board object
        if(!checkStatus(currentField)){
             //End if the area is explored
             //Run DOM function with message that area is explored
             return;
        }

        //If we have proper amount of actionPoints
        if(!checkActions(state)){
            //End function cuz of lack of action points
            //Run DOM function with message that we don't have enough actionPoints
            return;
        }

        //Function which run the movement and content events
        mainAction(areaID, state, currentField, actionPoints, paragraphsArray, puzzleCardArray, puzzleArray);
    }

})
//BoardArea validation
//Check the status of the current board
const checkStatus = (currentField: BoardField): boolean =>{
    return currentField.status === BoardState.PENDING;
}
//Check the amount of action points in game state
const checkActions = (state: GameState):boolean =>{
    return state.actionNumbers > 0;
}

//Get the current board
/*
    @param {id} - id of the boardArea object
    @param {boardAreas} - array of all the boardArea objects
*/
const getBoard = (id:string, boardAreas: Array<BoardField>) : BoardField =>{
    return boardAreas.find((c : BoardField) =>c._fieldID===id)!;
}

//Update action points
/*
    @param {numOfActions} - number of action's which we wanna add/remove from state
    @param {state} - state object, which contains main game state data
    @param {actionPoints} - action points object
*/
const updateAction = (numOfPoints: ActionPointsEnum,state: GameState, actionPoints: ActionPoints): void=>{

    actionPoints.addPoints(numOfPoints);

    state.actionNumbers = actionPoints.currentPoints;

}

//Board movement function
/*
  @param {currentField} - current boardField object
  @param {state} - GameState object
  @param {actionPoints} - actionPoints Object
  Mark area, as explored
*/
const move = (currentField: BoardField, state: GameState, actionPoints: ActionPoints) : void=>{

    //Mark the board as explored
    currentField.status = BoardState.EXPLORED;
    
    //Add paragraph ID to the state
    state.addParagraphsId(currentField._fieldID);

    //Remove 1 action point
    actionPoints.decrementPoints();

    //Save current action points to the gameState
    state.actionNumbers = actionPoints.currentPoints;

}

//Read paragraph
/*
    @param {id} - id of the paragraph, which is the same as ID od DOM element nad board area ID
    @param {state} - state of the game object
    @param {currentField} - current field object that we are moving on
    @param {paragraphsArray} - array of all the paragraphs
*/
const readParagraph = (id: string, state: GameState, currentField: BoardField, paragraphsArray: Array<Paragraph>): void=>{

    //Find current paragraph
    const currentParagraph : Paragraph = paragraphsArray.find((c: Paragraph)=>c.id === id)!;
    //Push current paragraph to the state
    if(currentParagraph){
        state.addParagraphsId(currentParagraph.id);
    }
    //Run read paragraph method from boarArea object
    //Will be DOM function
    currentField.readParagraph();

}

//Get content from current area
/*
    @param {boardField} - object of current boardField
    @param {state} - gameState object
    @param {actionObj} - object which contains actionPoints
    @param {puzzleCardArray} - array of puzzle cards
    @param {puzzleArray} - array of all the puzzle objects
*/
const getAreaContent = (boardField: BoardField, state: GameState, actionObj: ActionPoints, puzzleCardArray: Array<PuzzleCard>, puzzleArray: Array<Puzzle>) : void=>{

    switch(boardField.content){

        case BoardContent.CLUE:
            //Update points
            updateAction(ActionPointsEnum.CLUE, state, actionObj);
            //Run DOM function with message and random paragraph that we get points
            break;
        case BoardContent.PUZZLE:
            //Run function which add puzzle if not exist and get the puzzle card
            newPuzzle(state, boardField.fieldID);
            newPuzzleCard(boardField.fieldID, puzzleCardArray, puzzleArray);
            break;
        default:
            //Run DOM function with message that we didn't get any content

    }

}

//Main action function
/*
    @param {areaID} - ID get from the DOM
    @param {state} - game state object
    @param {currentField} - object of field we are exploring
    @param {actionObj} - actionPoints object
    @param {paragraphsArray} - array of all paragraphs
    @param {puzzleCardArray} - array of all puzzleCards
    @param {puzzleArray} - array of all puzzle objects
*/
const mainAction = (areaID: string, state: GameState, currentField: BoardField, actionObj: ActionPoints,paragraphsArray: Array<Paragraph>, puzzleCardArray: Array<PuzzleCard>, puzzleArray: Array<Puzzle> ) : void=>{

     //Mark the board, as explored and remove 1 action point
     move(currentField, state, actionObj);

     //Read paragraph and add to the state
     readParagraph(areaID, state, currentField, paragraphsArray);

     //Get content from the area
     getAreaContent(currentField, state, actionObj, puzzleCardArray,puzzleArray);

}

//Update points and remove evidence if we have any
/*
    @param {state} - state object, which contains main game state data
    @param {actionObj} - actionPoints object
*/
const stressCardAction = (state: GameState, actionObj: ActionPoints) : void=>{
    
    //Add action points
    updateAction(ActionPointsEnum.STRESSCARD, state, actionObj);
    //Remove evidence if player have any
    if(state.userEvidencesId.length !== 0){
        state.removeEvidence();
    }
    //Run DOM function reading random paragraph, tell the user that he lost evidence

}

//Export for testing
export {getBoard, checkActions, checkStatus, readParagraph}