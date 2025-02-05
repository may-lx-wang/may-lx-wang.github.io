const singleDims = {
  buffer: 20,
};

function getAssetsBottom(assets) {
  const baseTop = dims.innerBorder + 120;

  if (!assets || (!assets.main && (!assets.additional || assets.additional.length === 0))) {
    return baseTop;
  }

  const assetsCount = (assets.main ? 1 : 0) + (assets.additional ? assets.additional.length : 0);
  const maxHeight = 300; // Max height of each asset
  const gap = 20; // Gap between assets

  const containerWidth = window.innerWidth - (2 * dims.innerBorder);
  const assetsPerRow = Math.floor(containerWidth / (maxHeight + gap));
  const rows = Math.ceil(assetsCount / assetsPerRow);

  const totalHeight = (maxHeight * rows) + (gap * (rows - 1));
  return baseTop + totalHeight + singleDims.buffer;
}

function singleElements(height, width) {
  const project = window.projectData;
  const assetsBottom = getAssetsBottom(project.assets);

  return new Promise((resolve) => {
    const elements = [
      createProjectTitle(project.name, project.date),
      createProjectAssets(project.assets, width, height),
    ];

    const description = createProjectDescription(project.id);
    elements.push(description);

    // Wait for markdown to load
    fetch(`../../assets/projects/${project.id}/${project.id}.md`)
      .then((response) => response.text())
      .then((markdown) => {
        description.innerHTML = marked.parse(markdown);

        // Calculate total height
        const markdownHeight = description.getBoundingClientRect().height;
        const totalHeight = assetsBottom + markdownHeight + singleDims.buffer;
        console.log(assetsBottom);
        console.log(markdownHeight);
        console.log(singleDims.buffer);
        resolve({ elements, height: totalHeight });
      })
      .catch((error) => {
        console.error("Failed to load markdown file:", error);
        description.textContent = "Markdown content not available.";
        resolve({ elements, height: assetsBottom + 200 }); // Fallback height
      });
  });
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

function createProjectAssets(assets) {
  const container = document.createElement("div");

  container.style.cssText = `
        position: absolute;
        top: ${dims.innerBorder + 120}px;
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
  const assetsBottom = getAssetsBottom(window.projectData.assets);

  container.style.cssText = `
      position: absolute;
      top: ${assetsBottom}px;
      left: ${dims.innerBorder}px;
      right: ${dims.innerBorder}px;
      font-family: "Ubuntu", sans-serif;
      white-space: pre-wrap;
      padding: 20px;
      border-radius: 10px;
  `;

  container.classList.add("markdown-content");

  fetch(`../../assets/projects/${projectId}/${projectId}.md`)
      .then((response) => response.text())
      .then((markdown) => {
          const html = marked.parse(markdown);
          container.innerHTML = html;
      })
      .catch((error) => {
          console.error("Failed to load markdown file:", error);
          container.textContent = "Markdown content not available.";
      });

  return container;
}
