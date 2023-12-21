class coord 
{
  constructor(x, y)
  {
    this.x = x;
    this.y = y;
  }
}


let data = [[1, 0, 1, 0, 1, 1, 1, 1, 3, 1],
            [1, 0, 0, 0, 1, 0, 0, 0, 0, 0],
            [1, 0, 1, 1, 1, 1, 1, 0, 1, 0],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [1, 2, 1, 1, 1, 1, 1, 1, 1, 1]];

let cvs = document.getElementById("Maze");
let ctx = document.getElementById("Maze").getContext("2d");
let solver = document.getElementById("Solver");

function BorderColorRaimbow(obj)
{
  obj.style.borderColor = "rgb(" + Rand(255, 0) + ", " + Rand(255, 0) + ", " + Rand(255, 0) + ")";
}

let manthanDraw = false;

function draw() {
  for (let i = 0; i < data.length; i++) {
    for (let j = 0; j < data[0].length; j++) {
      ctx.save();
      if (data[i][j] == 0)
      {
        ctx.fillStyle = "rgb(255, 255, 255)";
      }
      if (data[i][j] == 1)
      {
        ctx.fillStyle = "rgb(0, 0, 0)";
      }
      if (data[i][j] == 2)
      {
        ctx.fillStyle = "rgb(0, 102, 0)";
      }
      if (data[i][j] == 3)
      {
        ctx.fillStyle = "rgb(204, 0, 0)";
      }
      if (data[i][j] == 0 && manthanDraw == true)
      {
        ctx.fillStyle = "rgb("+ 255/manhattan_distance(j, i) + ", " + 255/manhattan_distance(j, i) + ", "+ 255/manhattan_distance(j, i) +")";
      }
      if (data[i][j] == 4)
      {
        ctx.fillStyle = "rgba(255, 255, 0, 0.7)";
      }
      ctx.translate(j * 500/data[0].length, i * 500/data.length);
      ctx.fillRect(0, 0, 500/data[0].length, 500/data.length);
      ctx.restore();
    }
  }
}

function Rand(max, min) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function Randf(max, min) {
  return Math.random() * (max - min) + min;
}


function manhattan_distance(x1, y1)
{
  x2 = -1;
  y2 = -1;
  for (let i = 0; i < data.length; i++) {
    for (let j = 0; j < data[0].length; j++) {
      if (data[i][j] == 3)
      {
        x2 = j;
        y2 = i;
      }
    }
  }
  return Math.abs(x2 - x1) + Math.abs(y2 - y1);
}

function aStar() {
  let start = undefined;
  let goal = undefined;
  for (let i = 0; i < data.length; i++) {
    for (let j = 0; j < data[0].length; j++) {
      if (data[i][j] == 2)
      {
        start = new coord(j, i);
      }
      if (data[i][j] == 3)
      {
        goal = new coord(j, i);
      }
    }
  }
  
  
  let openSet = [];
  let closedSet = [];
  openSet.push(start);

  while (openSet.length > 0) {
    let winner = 0;
    for (let i = 0; i < openSet.length; i++) {
      if (openSet[i].f < openSet[winner].f) {
        winner = i;
      }
    }

    let current = openSet[winner];

    if (current.x === goal.x && current.y === goal.y) {
      let path = [];
      let temp = current;
      path.push(temp);
      while (temp.previous) {
        path.push(temp.previous);
        temp = temp.previous;
      }
      return path;
    }

    openSet = openSet.filter(coord => !(coord.x === current.x && coord.y === current.y));
    closedSet.push(current);

    let neighbors = [];
    let directions = [{ x: 0, y: -1 }, { x: 0, y: 1 }, { x: -1, y: 0 }, { x: 1, y: 0 }];

    for (let i = 0; i < directions.length; i++) {
      let direction = directions[i];
      let x = current.x + direction.x;
      let y = current.y + direction.y;

      if (x >= 0 && x < data[0].length && y >= 0 && y < data.length && data[y][x] !== 1 && !closedSet.some(coord => coord.x === x && coord.y === y)) {
        let neighbor = new coord(x, y);
        neighbors.push(neighbor);
      }
    }

    for (let i = 0; i < neighbors.length; i++) {
      let neighbor = neighbors[i];

      if (!openSet.some(coord => coord.x === neighbor.x && coord.y === neighbor.y)) {
        neighbor.g = current.g + 1;
        neighbor.h = manhattan_distance(neighbor.x, neighbor.y);
        neighbor.f = neighbor.g + neighbor.h;
        neighbor.previous = current;
        openSet.push(neighbor);
      }
    }
  }

  return null;
}

solver.onclick = function(){
  let path = aStar();

  if (path) {
    for (let i = 1; i < path.length - 1; i++) {
      data[path[i].y][path[i].x] = 4;
    }
  }
  draw();
};

draw();
