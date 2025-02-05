import json
from pathlib import Path

# Load the projects data
with open(r"C:\Users\May\Desktop\Website\json\projects.json", "r", encoding="utf-8") as f:
    projects = json.load(f)

# Template for project pages
project_template = '''<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>{name}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Ubuntu:wght@400&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="../../css/styles.css" />
</head>
<body>
  <div class="container" id="container"></div>
  <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
  <script src="../../js/utils.js"></script>
  <script src="../../js/template.js"></script>
  <script src="../../js/single.js"></script>
  <script>
    window.projectData = {{
      id: "{id}",
      name: "{name}",
      blurb: "{blurb}",
      date: "{date}",
      assets: JSON.parse('{assets}')
    }};

    function render() {{
      const container = document.getElementById("container");
      container.innerHTML = '';
      
      const height = window.innerHeight;
      const width = window.innerWidth;

      const fragment = document.createDocumentFragment();
      const elements = [
        ...templateElements(height, width, 'projects'),
        ...singleElements(height, width)
      ];
      elements.forEach((el) => fragment.appendChild(el));
      container.appendChild(fragment);
    }}

    render();
    window.addEventListener("resize", render);
  </script>
</body>
</html>'''

# Directory to store the generated HTML files
output_dir = Path(r"C:\Users\May\Desktop\Website\html\projects")
output_dir.mkdir(exist_ok=True)

# Generate HTML files for each project
for project in projects['bigProjects'] + projects['smallProjects']:
    # Use the old path format: "{id}.html"
    html_file_path = output_dir / (project["id"] + ".html")
    
    with open(html_file_path, "w", encoding="utf-8") as f:
        f.write(project_template.format(
            id=project['id'],
            name=project['name'],
            blurb=project['blurb'],
            date=project['date'],
            assets=json.dumps(project.get("assets", {}))
        ))