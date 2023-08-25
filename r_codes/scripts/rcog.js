// Arrow marker
svg.append("svg:defs").append("svg:marker")
    .attr("id", "triangle")
    .attr("refX", 10)
    .attr("refY", 4)
    .attr("markerWidth", 10)
    .attr("markerHeight", 10)
    .attr("markerUnits","userSpaceOnUse")
    .attr("orient", "auto")
    .append("path")
    .attr("d", "M 0 0 L 0 8 L 10 4 L 0 0")
    .style("fill", "black");

// Axes
var margin = ({top: 5, right: 5, bottom: 25, left: 25})
var xOffset = `translate(${margin.left}, 0)`;
var yOffset = `translate(0, ${height - margin.bottom})`;
var xyOffset = `translate(${margin.left}, ${height - margin.bottom})`;

var x = d3.scaleLinear()
    .domain([0, height])
    .range([margin.left, height]);
var y = d3.scaleLinear()
    .domain([0, -height])
    .range([height - margin.bottom, 0]);

var yAxis = g => g
    .attr("transform", xOffset)
    .call(d3.axisLeft(y).ticks(5));
var xAxis = g => g
    .attr("transform", yOffset)
    .call(d3.axisBottom(x).ticks(5));

// Paths
var pathString = (x0, y0, x1, y1) => {
  const path = d3.path();
  path.moveTo(x0, -y0);
  path.lineTo(x1, -y1);
  return path.toString(); // eg. "M40,0A40,40,0,1,1,-40,0A40,40,0,1,1,40,0"
}

var vec = (g, id, x1, y1, x2, y2) => g
    .attr("transform", xyOffset)
    .append("path")
    .attr("id", id)
    .attr("fill", "black")
    .attr("stroke", "black")
    .attr("stroke-width", 1)
    .attr("d", pathString(x1,y1,x2,y2))
    .attr("marker-end", "url(#triangle)")

var vecText = (g, id) => g
    .attr("transform", xyOffset)
    .append("text")
    .attr("text-anchor", "middle")
    .attr("dy", "1em")
    .attr("font-size", "10")
      .append("textPath")
      .attr("xlink:href", '#' + id)
      .attr("startOffset", "45%")
      .text(id);

// Image
svg.append("g")
    .call(yAxis);
svg.append("g")
    .call(xAxis);

svg.append("g")
    .call(vec, "R1", 0, 0, 100, 120);
svg.append("g")
    .call(vecText, "R1");

svg.append("g")
    .call(vec, "R2", 0, 0, 150, 50);
svg.append("g")
    .call(vecText, "R2");

svg.append("g")
    .call(vec, "R", 100, 120, 150, 50);
svg.append("g")
    .call(vecText, "R");
    
svg.append("g")
    .call(vec, "COG", 0, 0, 116.7, 96.7);
svg.append("g")
    .call(vecText, "COG");
