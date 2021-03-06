import SimpleBar from "simplebar";

// Render page from template
/*
    @param {nameId} - id of template to display
    @param {host} - html element where template will be inserted
*/
function createFormTemplate(nameId: string, host: string) {
  const templateElement = document.getElementById(
    nameId
  ) as HTMLTemplateElement;

  const hostElement = document.getElementById(host)! as HTMLElement;
  const importedNode = document.importNode(templateElement.content, true);

  const element = importedNode.firstElementChild as HTMLElement;

  hostElement.insertAdjacentElement("afterbegin", element);
}

// Display page from template
/*
    @param {oldElem} - element to hide
    @param {newElem} - element to show
*/
function handleClick(oldElem: HTMLElement, newElem: HTMLElement) {
  oldElem.style.display = "none";
  oldElem.style.opacity = "0";

  // newElem.style.display = newElem === board ? "block" : "flex";
  newElem.style.display = "block";
  setTimeout(() => {
    newElem.style.opacity = "1";
  }, 10);
}

// Render boards forom template
/*
    @param {num} - number of boards to render
*/
function boardFromTemplate(num: number) {
  for (let i = num; i > 0; i--) {
    createFormTemplate("board-map", "board-container");
    const board = document.querySelector(".board__map")!;
    board.id = `board${i}`;
    board.innerHTML = board.innerHTML.replace(/\{\{locationId\}\}/g, `${i}`);

    // first board is visible as default
    i === 1 && board.classList.toggle("activeBoard");
  }
}

// create html from template
function navigationInit() {
  createFormTemplate("home-page", "app");
  createFormTemplate("menu-page", "app");
  createFormTemplate("game-board", "app");
  boardFromTemplate(3); // render 3 boards
}

// navigation functions for buttons
function navigationActions() {
  const home = document.querySelector(".home-container")! as HTMLElement;
  const menu = document.querySelector(".menu-container")! as HTMLElement;
  const board = document.querySelector(".game-container")! as HTMLElement;
  const startBtn = document.querySelector("#startBtn")! as HTMLDivElement;
  const newGameBtn = document.querySelector("#newGameBtn")! as HTMLDivElement;
  const homeBackBtn = document.querySelector("#homeBack")! as HTMLDivElement;
  const continueBtn = document.querySelector("#continueBtn") as HTMLElement;

  // go to menu panel
  startBtn.addEventListener("click", () => {
    handleClick(home, menu);
    //Disable continue button if localStorage is empty
    if (localStorage.getItem("state") === null) {
      continueBtn.classList.add("continue__denied");
    } else {
      continueBtn.classList.remove("continue__denied");
    }
  });

  continueBtn.addEventListener("click", () => {
    handleClick(menu, board);
  });

  // go to board panel
  newGameBtn.addEventListener("click", () => {
    handleClick(menu, board);
  });

  // go to home panel
  homeBackBtn.addEventListener("click", () => {
    handleClick(board, home);
  });

  //Close ending story -- go to the main page
  document.addEventListener("click", (e: any) => {
    if (
      e.target.id === "ending__close" ||
      e.target === (document.querySelector(".ending__modal") as HTMLElement)
    ) {
      handleClick(board, home);
      (document.querySelector(".ending__modal") as HTMLElement).style.display =
        "none";
    }
  });
}

// Buttons and informations in menu panel
function menuInfo() {
  const about = document.querySelector(".menu__info--about") as HTMLElement;
  const authors = document.querySelector(".menu__info--authors") as HTMLElement;
  const guide = document.querySelector(".menu__info--guide") as HTMLElement;
  const btn = document.querySelectorAll(".menu__info--btn");
  new SimpleBar(guide, { autoHide: false, background: "red" });

  btn.forEach((elem) => {
    elem.addEventListener("click", ({ target }: any) => {
      btn.forEach((e) => {
        e.classList.remove("active");
      });
      elem.classList.toggle("active");

      switch (target.innerText) {
        case "Authors":
          guide.style.display = "none";
          about.style.display = "none";
          authors.style.display = "block";
          break;

        case "Game guide":
          authors.style.display = "none";
          about.style.display = "none";
          guide.style.display = "block";
          break;

        case "About game":
          authors.style.display = "none";
          guide.style.display = "none";
          about.style.display = "block";
          break;

        default:
          "error";
      }
    });
  });
}

// Navigate between panels
export default function navigation() {
  navigationInit();
  navigationActions();
  menuInfo();
}
