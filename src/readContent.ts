import Paragraph from "./paragraph";
import TypeIt from "typeit";
import {updateStoryBook} from "./updateDOM";
import {getDate} from './date'
import {getStateLS} from './getLS';
import { updateStateLS } from "./updateLS";

/*
    Function which open modals and read paragraph in cases such as:
    -Move on board and get content (puzzle/card/clue/nothing)
    -Solve puzzle
    @param {paragraph} - paragraph object
*/
const read = (paragraph: Paragraph): void => {
  //Get state
  const state = getStateLS();
  //Display modal and reset content
  (document.querySelector(".paragraph") as HTMLElement).style.display = "block";
  (document.querySelector('.paragraph__text') as HTMLElement).innerHTML = '';

  //Put data in container
  new TypeIt(".paragraph__text", {
    strings: `${paragraph.text} <br> You gain: <br>  ${paragraph.content}`,
    speed: 80,
    loop: false,
    startDelete: false,
    afterStep: async (step, instance) => {
      if((document.querySelector(".paragraph") as HTMLElement).style.display === 'none'){
        instance.destroy();
      }
    }
  }).go();
  const date: string = getDate().toString();

  //Update story book
  state.addPage(date,paragraph.text);
  updateStateLS(state);
  updateStoryBook();
};

/*
  Puzzle already solved
*/
const puzzleAlreadySolved = () : void=>{
  //Put data in container
  setTimeout(function(){
    //Display modal and reset content
    (document.querySelector(".paragraph") as HTMLElement).style.display = "block";
    (document.querySelector('.paragraph__text') as HTMLElement).innerHTML = '';
    new TypeIt(".paragraph__text", {
      strings: `You already solved this puzzle`,
      speed: 80,
      loop: false,
      startDelete: false,
      afterStep: async (step, instance) => {
        if((document.querySelector(".paragraph") as HTMLElement).style.display === 'none'){
          instance.destroy();
        }
      }
    }).go();
  }, 10000);
  
}

/*
    Read stressCard
    @param {stressParagraphs} - array of stress paragraphs
*/
const readStressParagraph = (stressParagraphs: string[]) : void =>{

  //Get random index of stressParagraphs array
  const index = Math.floor(Math.random() * (stressParagraphs.length));

  //Display modal
  (document.querySelector(".paragraph") as HTMLElement).style.display = "block";
  (document.querySelector('.paragraph__text') as HTMLElement).innerHTML = '';

  //Put data into container
  new TypeIt(".paragraph__text", {
    strings: `${stressParagraphs[index]} <br> You lost 1 evidence <br> You gain 4 action points`,
    speed: 80,
    loop: false,
    afterStep: async (step, instance) => {
      if((document.querySelector(".paragraph") as HTMLElement).style.display === 'none'){
        instance.destroy();
      }
    }
  }).go();
}

//Not enough progress points
//Display modal with motification
const readNotEnughPR = () : void => {
  (document.querySelector('.noPoints__modal') as HTMLElement).style.display = 'block';
  (document.querySelector('.noPoints__text') as HTMLElement).innerHTML = '';
  new TypeIt(".noPoints__text", {
    strings: `You have not enough progress points`,
    speed: 80,
    loop: false,
    afterStep: async (step, instance) => {
      if((document.querySelector('.noPoints__modal') as HTMLElement).style.display === 'none'){
        instance.destroy();
      }
    }
  }).go();
}

/*
    Function with notification that the solution of a puzzle is incorrect
*/
const incorrectPuzzle = (): void => {

  const validInput = document.querySelector('.puzzle__solve__input') as HTMLElement;
  validInput.classList.add('incorrect__solution');

  setTimeout(function(){
      validInput.classList.remove('incorrect__solution');
  }, 500);
  
};

/*
    Notification that the player has not enough action points
*/
const notEnoughPoints = (): void => {
  (document.querySelector('.noPoints__modal') as HTMLElement).style.display = 'block';
  (document.querySelector('.noPoints__text') as HTMLElement).innerHTML = '';
  new TypeIt(".noPoints__text", {
    strings: `You have not enough action points`,
    speed: 80,
    loop: false,
    afterStep: async (step, instance) => {
      if((document.querySelector('.noPoints__modal') as HTMLElement).style.display === 'none'){
        instance.destroy();
      }
    }
  }).go();
};


/*
    Notification that area is already explored
*/ 
const areaExplored = (): void => {
  (document.querySelector('.areaExplored__modal') as HTMLElement).style.display = 'block';
  (document.querySelector('.areaExplored__text') as HTMLElement).innerHTML = '';
  new TypeIt(".areaExplored__text", {
    strings: `Area has been already explored`,
    speed: 80,
    loop: false,
    afterStep: async (step, instance) => {
      if((document.querySelector('.areaExplored__modal') as HTMLElement).style.display === 'none'){
        instance.destroy();
      }
    }
  }).go();
};

//Ending story read function
const endingStory = (text : string): void => {
  (document.querySelector('.ending__modal') as HTMLElement).style.display = 'block';
  (document.querySelector('.ending__text') as HTMLElement).innerHTML = ``;
  new TypeIt(".ending__text", {
      strings: `${text}`,
      speed: 100,
      loop: false,
      afterStep: async (step, instance) => {
          if((document.querySelector(".ending__modal") as HTMLElement).style.display === 'none'){
            instance.destroy();
          }
      }
  }).go();
  (document.querySelector('.ending__text') as HTMLElement).innerHTML = `
  <button class="ending__close" id="ending__close">
    End
  </button>
  `;
};

export {areaExplored, notEnoughPoints, incorrectPuzzle, readNotEnughPR, readStressParagraph, read, endingStory, puzzleAlreadySolved}
