const canvas = document.querySelector("canvas");
canvas.width = 500;
canvas.height = 500;
const flood = document.getElementById("flood");
const colorPicker = document.getElementById("colorpicker");
const eraser = document.getElementById("eraser");
console.log(eraser);
const btnDload = document.getElementById("btndload");
console.log(btnDload);

btnDload.addEventListener("click", () => {
  console.log("abc");
  const image = canvas
    .toDataURL("image/png")
    .replace("image/png", "image/octet-stream"); // here is the most important part because if you dont replace you will get a DOM 18 exception.
  const anchor = document.createElement("a");
  anchor.href = image;
  anchor.download = "img.png";
  anchor.click();
});

let c = canvas.getContext("2d");
class Grid {
  constructor(rows, columns) {
    this.rows = rows;
    this.columns = columns;
    this.cellH = canvas.height / this.columns;
    this.cellW = canvas.width / this.rows;
    this.color = "red";
    this.fill = "blue";
    this.grid = [];
    for (let i = 0; i < rows; i++) {
      this.grid.push([]);
      for (let j = 0; j < columns; j++) {
        this.grid[i].push("white");
      }
    }
  }
  drawGrid() {
    // c.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        c.drawImage;
        c.fillStyle = this.grid[i][j];
        c.fillRect(j * this.cellW, i * this.cellH, this.cellW, this.cellH);
        // c.fillStyle = "blue";
        // c.fillText(`${i} ${j}`, j * this.cellW, i * this.cellH + 30);
      }
    }
  }
  getColor() {
    return `rgb(${Math.random() * 255},${Math.random() * 255},${
      Math.random() * 255
    }) `;
  }
  getPosition(e) {
    if (e.buttons === 1) {
      let r = Math.floor(e.y / this.cellW);
      let c = Math.floor(e.x / this.cellH);
      if (eraser.checked) {
        this.grid[r][c] = "white";
        this.drawGrid();
        return;
      }
      this.grid[r][c] = this.color;
      this.drawGrid();
    }
  }
  clicked(e) {
    if (flood.checked) {
      return;
    }
    let r = Math.floor(e.y / this.cellW);
    let c = Math.floor(e.x / this.cellH);
    if (eraser.checked) {
      this.grid[r][c] = "white";
      this.drawGrid();
      return;
    }
    this.grid[r][c] = this.color;
    this.drawGrid();
  }
  floodfill(e) {
    if (!flood.checked) {
      this.clicked(e);
      return;
    }
    let queue = [];
    let r = Math.floor(e.y / this.cellW);
    let c = Math.floor(e.x / this.cellH);
    console.log(r, c);
    console.log(this.rows, this.columns);
    const srcBg = this.grid[r][c];
    queue.push({
      r: r,
      c: c,
    });
    let maxlen = 0;
    while (queue.length != 0) {
      // console.log("queue");
      if (queue.length > maxlen) {
        maxlen = queue.length;
      }
      if (
        queue[0].r < 0 ||
        queue[0].r >= this.rows ||
        queue[0].c < 0 ||
        queue[0].c >= this.columns
      ) {
        queue.shift();
        continue;
      }

      const newR = queue[0].r;
      const newC = queue[0].c;

      this.grid[newR][newC] = colorPicker.value;
      if (newR + 1 !== this.rows && this.grid[newR + 1][newC] === srcBg) {
        queue.push({
          r: newR + 1,
          c: newC,
        });
      }
      if (newR - 1 >= 0 && this.grid[newR - 1][newC] === srcBg) {
        queue.push({
          r: newR - 1,
          c: newC,
        });
      }
      if (newC - 1 >= 0 && this.grid[newR][newC - 1] === srcBg) {
        queue.push({
          r: newR,
          c: newC - 1,
        });
      }
      if (newC + 1 != this.columns && this.grid[newR][newC + 1] === srcBg) {
        queue.push({
          r: newR,
          c: newC + 1,
        });
      }
      queue.shift();
    }
    this.drawGrid();
    queue = [];
    console.log(maxlen);
  }

  setColor(e) {
    this.color = e.target.value;
  }
  getGrid() {
    return this.grid;
  }
}
const grid = new Grid(15, 15);

grid.drawGrid();

canvas.addEventListener("pointermove", (e) => grid.getPosition(e));
canvas.addEventListener("click", (e) => grid.floodfill(e));
canvas.addEventListener("click", (e) => grid.clicked(e));

colorPicker.addEventListener("input", (e) => grid.setColor(e));
