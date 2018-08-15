var gameplay = 'click';
var mouseClick = document.getElementById('mouse');
var toggleLive=function(){
    if(this.classList.contains('live')){
        this.classList.remove('live');
    }
    else{
        this.classList.add('live');
    }
};
var GameOfLife = function () {
    self=this;
    this.board = document.getElementById('board');
    this.cells = [];
    this.createBoard = function (boardWidth, boardHeight) {
        this.width = boardWidth;
        this.height = boardHeight;
        this.board.style.width = this.width * 20 + "px";
        this.board.style.height = this.height * 20 + "px";
        this.size = this.width * this.height;

        for (i = 0; i < this.size; i++) {
            var div = document.createElement('div');
            this.board.appendChild(div);
        }
        this.cells = this.board.querySelectorAll('div');
    };

    this.gameWay = function(){
        this.cells.forEach(function (cell) {
                cell.addEventListener(gameplay, toggleLive,true);
            });
    };

    this.index = function (x, y) {
        return this.cells[x + y * this.width];
    };

    this.setCellState = function (x, y, state) {
        var cell = this.index(x, y);
        cell.classList.add(state);
    }

    this.firstGlider = function () {
        this.setCellState(1, 0, "live");
        this.setCellState(2, 1, "live");
        this.setCellState(0, 2, "live");
        this.setCellState(1, 2, "live");
        this.setCellState(2, 2, "live");
    };

    this.neighboursLoop=function(jFrom, jTo,x,y){
        for (var i = -1; i < 2; i++) {
            for (var j = jFrom; j < jTo; j++) {
                if (i === 0 && j === 0) {
                    continue;
                } else {
                    if (this.index(x + j, y + i) !== undefined) {
                        this.neighbours.push(this.index(x + j, y + i))
                    }
                }
            }
        }
    };

    this.computeCellNextState = function (x, y) {
        this.neighbours = [];
        if (x === 0) {
            this.neighboursLoop(0,2,x,y)
        }
        else if (x === this.width - 1) {
            this.neighboursLoop(-1,1,x,y)
        }
        else {
            this.neighboursLoop(-1,2,x,y);
        }

        this.alive = 0;
        for(var s=0;s<this.neighbours.length;s++){
            if (this.neighbours[s].classList.contains("live")) {
                        this.alive++;
                    }
        }

        if ((this.alive < 2 || this.alive > 3) &&
            this.index(x, y).classList.contains("live")) return 0;
        else if (this.index(x, y).classList.contains("live") &&
            (this.alive === 2 || this.alive === 2)) return 1;
        else if ((!this.index(x, y).classList.contains("live")) &&
            this.alive === 3) return 1;
    };

    this.computeNextGeneration = function () {
        this.nextBoard = [];
        for (var p = 0; p < this.width; p++) {
            for (var m = 0; m < this.height; m++) {
                this.nextBoard.push(this.computeCellNextState(m, p))
            }
        }
    };

    this.printNextGeneration = function () {
        for (var p = 0; p < this.width; p++) {
            for (var m = 0; m < this.height; m++) {
                if (this.nextBoard[m + this.width * p] === 1) {
                    this.index(m, p).className = "live";
                }
                else if (this.nextBoard[m + this.width * p] === 0) {
                    this.index(m, p).className = "";
                }
            }
        }
    };
};

//obsługa play
var next = document.getElementById('play');
next.addEventListener('click', function () {
    if(next.innerText==="graj"){
        game.gameInterval = setInterval(function(){
            game.computeNextGeneration();
            game.printNextGeneration();
        },250);
    }


    next.innerText = "gra"
});

//obsługa pause
var pause = document.getElementById('pause');
pause.addEventListener('click', function () {
    window.clearInterval(game.gameInterval);
    next.innerText = "graj"
});

//obsługa Utwórz plansze
var newBoard = document.getElementById('makeGame');
var newWidth = document.getElementById('width');
var newHeight = document.getElementById('height');
newBoard.addEventListener('click',function(){
    var exBoard = document.querySelectorAll('#board div');
    var leng = exBoard.length;
    console.log(leng);
    exBoard.forEach(function(exDiv){
        game.board.removeChild(exDiv);
    });
    if(newWidth.value>4&&newWidth.value>4){
        game.createBoard(newWidth.value,newHeight.value);
    }else{
        console.log("plansza musi mieć rozmiar co najmniej 5x5");
    }
});

//obsługa wstaw glidera
var glider = document.getElementById('glider');
glider.addEventListener('click',function(){
    game.firstGlider();
});

//obsługa mouseover NIE DZIAŁA POPRAWNIE,
//trzebaby wrzucić funkcje, żeby nadawać event po stworzeniu
//nowych plansz

mouseClick.addEventListener('click',function(){
    //console.log("szok, coś działa");
    if(gameplay==='click') {
        console.log("zdejmuję click");
        self.cells.forEach(function(cell){
            cell.removeEventListener('click',toggleLive,true);
            gameplay = 'mouseover';
            mouseClick.innerText = "Kliknięcie";
        })
    }
    else if(gameplay==='mouseover'){
        console.log("zdejmuję mouseover");
        self.cells.forEach(function(cell){
            cell.removeEventListener('mouseover',toggleLive,true)
        });
        gameplay = 'click';
        mouseClick.innerText = "Ruch myszki"

    }
    console.log(gameplay);


    self.gameWay();
});



var game = new GameOfLife();
game.createBoard(20,20);
game.gameWay();


//console.table(game.computeNextGeneration());
