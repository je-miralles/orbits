// !preview r2d3 data=data.frame(E = -2.65096e33, l = 2.66e40, m = 5.972e24, G = 6.67e-11, M = 1.99e30)
// data=data.frame(E, l, m, G, M)

var range = (start, stop, step) => Array.from({ length: (stop - start) / step + 1}, (_, i) => start + (i * step));

var mu_f = (G, M) => {
  return G * M;
};

var e_f = (E, l, m, mu) => {
  return Math.sqrt(1 + (2*E*(l**2) / (m**3 * mu**2)) );
};

var r_f = (l, m, mu, e, theta) => {
  return l**2 / (m**2 * mu) / (1 + e*Math.cos(Math.PI*theta/180));
};

var ellipse_coords = (E, l, m, G, M) => {
    var mu = mu_f(G, M);
    var e = e_f(E, l, m, mu);

    return range(0, 360, 1).map((theta) => {
        return ({
          "theta_r": Math.PI*theta/180,
          "r_f": r_f(l, m, mu, e, theta),
          "x": r_f(l, m, mu, e, theta)*Math.cos(Math.PI*theta/180),
          "y": r_f(l, m, mu, e, theta)*Math.sin(Math.PI*theta/180),
          "mu": mu,
          "e": e
        });
    });
};

var coords = ellipse_coords(data[0].E, data[0].l, data[0].m, data[0].G, data[0].M);

var max_coord = (coords) => {
  var xVals_abs = coords.map(function(coord) { return Math.abs(coord.x); });
  var yVals_abs = coords.map(function(coord) { return Math.abs(coord.y); });
  var maxX  = Math.max.apply(Math, xVals_abs);
  var maxY  = Math.max.apply(Math, yVals_abs);
  var max = Math.max.apply(Math, [maxX, maxY]);
  return max;
};

var maxCoord = max_coord(coords);

// Axes
var margin = ({top: 25, right: 25, bottom: 25, left: 25});
var xOffset = `translate(${(margin.left + height - margin.right)/2}, 0)`;
var yOffset = `translate(0, ${(margin.top + height - margin.bottom)/2})`;
var xyOffset = `translate(${(margin.left + height - margin.right)/2}, ${(margin.top + height - margin.bottom)/2})`;

var x = d3.scaleLinear()
    .domain([-maxCoord, maxCoord])
    .range([margin.left, height - margin.right]);
var y = d3.scaleLinear()
    .domain([-maxCoord, maxCoord])
    .range([margin.top, height - margin.bottom]);

var coords_scaled = coords.map((d) => ({x: x(d.x), y: y(d.y)}));

var yAxis = g => g
    .attr("transform", xOffset)
    .call(d3.axisLeft(y).tickValues([]).tickSizeOuter(0));
var xAxis = g => g
    .attr("transform", yOffset)
    .call(d3.axisBottom(x).ticks(3));

// Paths
var ellipse_path_string = (coords) =>{
  const path = d3.path();
  coords.forEach(function (v, i) {
      if (i == 0) {
        path.moveTo(v.x, v.y);
      } else {
        path.lineTo(v.x, v.y);
      }
  });
  return path.toString();
};

// Image
svg.append("g").call(yAxis);
svg.append("g").call(xAxis);

if(options.orbit == "true"){
    var orbit = svg.append("g").append("path")
        .attr("fill", "none")
        .attr("stroke", "black")
        .attr("stroke-width", 2)
        .attr("d", ellipse_path_string(coords_scaled));
};
