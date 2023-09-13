// !preview r2d3 data=data.frame(m=c(1.0e26, 5.0e25), x=c(100, 150), y=c(120, 50))

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
    .attr("fill", "black");

// Axes
var margin = ({top: 5, right: 5, bottom: 25, left: 25})
var xOffset = `translate(${margin.left}, 0)`;
var yOffset = `translate(0, ${height - margin.bottom})`;
var xyOffset = `translate(${margin.left}, ${height - margin.bottom})`;

var maxMass = Math.max(...data.map(({ m }) => m));

var x = d3.scaleLinear()
    .domain([0, height])
    .range([margin.left, height + margin.left]);
var y = d3.scaleLinear()
    .domain([0, -height])
    .range([height - margin.bottom, -margin.bottom]);

var yAxis = g => g
    .attr("transform", xOffset)
    .call(d3.axisLeft(y).ticks(4));
var xAxis = g => g
    .attr("transform", yOffset)
    .call(d3.axisBottom(x).ticks(4));

// Paths
var pathString = (x0, y0, x1, y1) => {
    const path = d3.path();
    path.moveTo(x0, -y0);
    path.lineTo(x1, -y1);
    return path.toString(); // eg. "M40,0A40,40,0,1,1,-40,0A40,40,0,1,1,40,0"
}

// Image
svg.append("g").call(yAxis);
svg.append("g").call(xAxis);

var lines = svg.append("g")
  .attr("transform", xyOffset)
    .selectAll("path")
    .data(data).enter().append("path")
      .attr("id", function(d, i) { return "r" + i; })
      .attr("fill", "black")
      .attr("stroke", "black")
      .attr("stroke-width", 1)
      .attr("d", function(d) { return pathString(0, 0, d.x, d.y) })
      .attr("marker-end", "url(#triangle)")

var masses = svg.append("g")
  .attr("transform", xyOffset)
    .selectAll("circle")
    .data(data).enter().append("circle")
        .attr("id", function(d, i) { return "m" + i; })
        .attr("r", function(d) { return d.m / maxMass * 6; })
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return -d.y; })
        .attr("fill", "black");

var text = svg.append("g")
  .attr("transform", xyOffset)
    .selectAll("text")
    .data(data).enter().append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "1em")
      .attr("font-size", "10")
        .append("textPath")
        .attr("xlink:href",  function(d, i) { return "#r" + i; })
        .attr("startOffset", so = "45%")
        .text(function(d, i) { return "r" + i; });

var vec = (g, id, x1, y1, x2, y2) => g
    .attr("transform", xyOffset)
    .append("path")
    .attr("id", id)
    .attr("fill", "black")
    .attr("stroke", "black")
    .attr("stroke-width", 1)
    .attr("d", pathString(x1,y1,x2,y2))
    .attr("marker-end", "url(#triangle)");

var vecText = (g, id, so="45%") => g
    .attr("transform", xyOffset)
    .append("text")
    .attr("text-anchor", "middle")
    .attr("dy", "1em")
    .attr("font-size", "10")
      .append("textPath")
      .attr("xlink:href", '#' + id)
      .attr("startOffset", so)
      .text(id);

var mass = (g, id, m, x, y) => g
    .attr("transform", xyOffset)
    .append("circle")
    .attr("fill", "black")
    .attr("id", id)
    .attr("r", m)
    .attr("cx", x)
    .attr("cy", -y);

if(options.cog == "true") {
    // Hand generate relative vector and center of gravity
    svg.append("g").call(vec, "R", data[0].x, data[0].y, data[1].x, data[1].y);
    svg.append("g").call(vecText, "R", "55%");

    // TODO COG assumes just two particles
    // R_COG <- (m_1*R_1 + m_2*R_2) / (m_1 + m_2)
    svg.append("g").call(vec, "COG", 0, 0,
                                (data[0].m*data[0].x + data[1].m*data[1].x) / (data[0].m + data[1].m),
                                (data[0].m*data[0].y + data[1].m*data[1].y) / (data[0].m + data[1].m));
    svg.append("g").call(vecText, "COG");
}
