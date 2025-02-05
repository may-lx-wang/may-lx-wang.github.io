const singleDims = {
  buffer: 20,
};
function singleElements(height, width) {
  const project = window.projectData;

  const elements = [createProjectTitle(project.name, project.date), createProjectAssets(project.assets, width, height), createProjectDescription(project.id)];

  return elements;
}

function createProjectTitle(name, date) {
  const container = document.createElement("div");

  container.style.cssText = `
        position: absolute;
        top: ${dims.innerBorder + dims.upperGap + singleDims.buffer}px;
        left: ${dims.innerBorder + singleDims.buffer}px;
        font-family: "Ubuntu", sans-serif;
        text-align: left;
    `;

  const projectName = document.createElement("h1");
  projectName.textContent = name;
  projectName.style.cssText = `
        font-size: 36px;
        font-weight: bold;
        margin: 0;
    `;

  const projectDate = document.createElement("p");
  projectDate.textContent = date;
  projectDate.style.cssText = `
        font-size: 16px;
        font-style: italic;
        margin: 5px 0 0 0;
    `;

  container.appendChild(projectName);
  container.appendChild(projectDate);
  return container;
}

function createProjectAssets(assets, width, height) {
  const container = document.createElement("div");

  container.style.cssText = `
        position: absolute;
        top: ${dims.innerBorder + 100}px;
        left: ${dims.innerBorder}px;
        right: ${dims.innerBorder}px;
        display: flex;
        flex-wrap: wrap;
        gap: 20px;
        justify-content: center;
    `;

  // Add main asset
  if (assets.main) {
    const mainAsset = createAssetElement(assets.main);
    container.appendChild(mainAsset);
  }

  // Add additional assets
  if (assets.additional && assets.additional.length > 0) {
    assets.additional.forEach((asset) => {
      const additionalAsset = createAssetElement(asset);
      container.appendChild(additionalAsset);
    });
  }

  return container;
}

function createAssetElement(assetName) {
  const assetElement = document.createElement("img");
  assetElement.src = `../../assets/projects/${window.projectData.id}/${assetName}`;
  assetElement.style.cssText = `
        max-height: 300px;
        object-fit: contain;
        border-radius: 5px;
    `;
  return assetElement;
}

function createProjectDescription(projectId) {
    const container = document.createElement("div");

    container.style.cssText = `
        position: absolute;
        top: ${dims.innerBorder + 400}px;
        left: ${dims.innerBorder}px;
        right: ${dims.innerBorder}px;
        font-family: "Ubuntu", sans-serif;
        white-space: pre-wrap;
        padding: 20px;
        border-radius: 10px;
    `;

    container.classList.add("markdown-content"); // Add this line

    fetch(`../../assets/projects/${projectId}/${projectId}.md`)
        .then((response) => response.text())
        .then((markdown) => {
            // Convert markdown to HTML using marked
            const html = marked.parse(markdown);
            container.innerHTML = html;
        })
        .catch((error) => {
            console.error("Failed to load markdown file:", error);
            container.textContent = "Markdown content not available.";
        });

    return container;
}
