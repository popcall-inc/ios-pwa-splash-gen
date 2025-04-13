// Pase into the console of https://www.ios-resolution.com/

(() => {
  const rows = document.querySelectorAll("table.devices tbody tr");
  const data = Array.from(rows).map((row) => {
    const cells = row.querySelectorAll("td");
    return {
      model: cells[0].innerText.trim(),
      logicalWidth: parseInt(cells[1].innerText),
      logicalHeight: parseInt(cells[2].innerText),
      physicalWidth: parseInt(cells[3].innerText),
      physicalHeight: parseInt(cells[4].innerText),
      ppi: parseInt(cells[5].innerText),
      scaleFactor: parseFloat(cells[6].innerText),
      diagonal: cells[7].innerText.replace(/"/g, ""),
      aspectRatio: cells[8].innerText.trim(),
      releaseDate: cells[9].innerText.trim(),
    };
  });
  console.log(JSON.stringify(data, null, 2));
})();
