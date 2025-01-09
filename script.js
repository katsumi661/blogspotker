document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("grid");
  const deleteModeBtn = document.getElementById("delete-mode-btn");
  const setGridBtn = document.getElementById("set-grid-btn");
  const rowInput = document.getElementById("row-input");
  const colInput = document.getElementById("col-input");

  let deleteMode = false;

  deleteModeBtn.addEventListener("click", () => {
    deleteMode = !deleteMode;
    deleteModeBtn.textContent = deleteMode ? "Exit Delete Mode" : "Delete Mode";
    deleteModeBtn.style.backgroundColor = deleteMode ? "#ffa07a" : "#ff4d4d";
  });

  setGridBtn.addEventListener("click", () => {
    const rows = parseInt(rowInput.value) || 1;
    const cols = parseInt(colInput.value) || 1;
    setGrid(rows, cols);
  });

  function setGrid(rows, cols) {
    grid.innerHTML = ""; 
    grid.style.gridTemplateRows = `repeat(${rows}, 100px)`;
    grid.style.gridTemplateColumns = `repeat(${cols}, 100px)`;

    for (let i = 0; i < rows * cols; i++) {
      const cell = document.createElement("div");
      cell.classList.add("grid-cell");
      cell.addEventListener("dragover", (e) => e.preventDefault());
      cell.addEventListener("drop", dropHandler);
      cell.addEventListener("click", () => {
        if (deleteMode && cell.firstChild) {
          cell.innerHTML = ""; 
          updateConnections(); 
        }
      });
      grid.appendChild(cell);
    }
  }

  const toolbarAssets = document.querySelectorAll(".asset");

  toolbarAssets.forEach((asset) => {
    asset.addEventListener("dragstart", dragStartHandler);
  });

  let draggedAsset = null;

  function dragStartHandler(e) {
    if (!deleteMode) {
      draggedAsset = this.dataset.type;
    }
  }

  function dropHandler(e) {
    if (!deleteMode && draggedAsset) {
      this.innerHTML = "";

      const placedAsset = document.createElement("div");
      placedAsset.classList.add("placed-asset");
      placedAsset.dataset.type = draggedAsset;

      if (draggedAsset === "fluid-tank") {
        placedAsset.textContent = "Tank";
      } else if (draggedAsset === "pipe") {
        placedAsset.textContent = "Pipe";
      } else {
        placedAsset.textContent = draggedAsset;
      }

      this.appendChild(placedAsset);

      if (draggedAsset === "pipe") {
        updateConnections();
      }

      draggedAsset = null;
    }
  }

  function updateConnections() {
    const cells = Array.from(grid.children);
    cells.forEach((cell, idx) => {
      const asset = cell.querySelector(".placed-asset");
      if (asset && asset.dataset.type === "pipe") {
        const neighbors = getNeighbors(cells, idx);
        const connected = neighbors.some((neighbor) => {
          const neighborAsset = neighbor?.querySelector(".placed-asset");
          return neighborAsset && ["pipe", "fluid-tank"].includes(neighborAsset.dataset.type);
        });
        asset.classList.toggle("pipe-connected", connected);
      }
    });
  }

  function getNeighbors(cells, idx) {
    const cols = parseInt(grid.style.gridTemplateColumns.split(" ").length);
    const neighbors = [];
    const isLeftEdge = idx % cols === 0;
    const isRightEdge = idx % cols === cols - 1;

    if (!isLeftEdge) neighbors.push(cells[idx - 1]); // Left
    if (!isRightEdge) neighbors.push(cells[idx + 1]); // Right
    if (idx - cols >= 0) neighbors.push(cells[idx - cols]); // Top
    if (idx + cols < cells.length) neighbors.push(cells[idx + cols]); // Bottom

    return neighbors;
  }

  setGrid(5, 5);
});
