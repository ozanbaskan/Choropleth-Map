"use strict";

const projectName = "Cloropleth Map";

const countyURL =
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json";
const educationURL =
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json";

const w = 1200;
const h = 650;
let countyData;
let educationData;
const svgHolder = d3
  .select(".holder")
  .append("svg")
  .attr("width", w)
  .attr("height", h);
const tooltip = d3
  .select(".holder")
  .append("div")
  .attr("width", 50)
  .attr("height", 50)
  .attr("id", "tooltip")
  .style("visibility", "hidden");
const drawMap = () => {
  svgHolder
    .selectAll("path")
    .data(countyData)
    .enter()
    .append("path")
    .attr("d", d3.geoPath())
    .attr("class", "county")
    .attr("fill", function (d, i) {
      const id = d.id;
      const county = educationData.find((item) => {
        return item.fips === id;
      });
      const percentage = county.bachelorsOrHigher;
      return (
        "rgba(255, " +
        2 * (100 - percentage) +
        ", " +
        2 * (100 - percentage) +
        ", 1)"
      );
    })
    .attr("data-fips", function (d, i) {
      const id = d.id;
      const county = educationData.find((item) => {
        return item.fips === id;
      });
      return county.fips;
    })
    .attr("data-education", function (d, i) {
      const id = d.id;
      const county = educationData.find((item) => {
        return item.fips === id;
      });
      return county.bachelorsOrHigher;
    })
    .attr("id", function (d, i) {
      return i;
    })
    .on("mouseover", function (event, d) {
      const id = d.id;
      const county = educationData.find((item) => {
        return item.fips === id;
      });
      const i = event.currentTarget.id;
      d3.select(this).transition().duration(10).style("opacity", 0.5);
      tooltip.transition().duration(10).style("visibility", "visible");
      tooltip
        .text(
          county.fips +
            " - " +
            county["area_name"] +
            ", " +
            county.state +
            " : " +
            county.bachelorsOrHigher +
            "%"
        )
        .style("margin-left", event.pageX + 30 + "px")
        .style("margin-top", event.pageY + "px")
        .attr("data-education", county.bachelorsOrHigher);
    })
    .on("mouseout", function (event, d) {
      const i = event.currentTarget.id;
      d3.select(this).transition().duration(10).style("opacity", 1);
      tooltip.transition().duration(10).style("visibility", "hidden");
    });
};
d3.json(countyURL).then((data, error) => {
  if (error) {
    console.log(log);
  } else {
    countyData = topojson.feature(data, data.objects.counties).features;
    console.log(countyData);
    d3.json(educationURL).then((data, error) => {
      if (error) {
        console.log(log);
      } else {
        educationData = data;
        console.log(educationData);
        drawMap();
        const defs = svgHolder.append("defs");
        const linearGradient = defs
          .append("linearGradient")
          .attr("id", "linear-gradient");
        linearGradient
          .attr("x1", "0%")
          .attr("y1", "0%")
          .attr("x2", "100%")
          .attr("y2", "0%");
        linearGradient
          .append("stop")
          .attr("offset", "0%")
          .attr("stop-color", "#ffffff");
        linearGradient
          .append("stop")
          .attr("offset", "100%")
          .attr("stop-color", "#ff0000");
        const legendContainer = d3
          .select(".holder")
          .append("svg")
          .attr("width", w / 5)
          .attr("height", 40)
          .attr("id", "legend");
        const legendScale = d3
          .scaleOrdinal()
          .domain(["0%", ""])
          .range([0, w / 5]);
        const legendAxis = d3.axisBottom().scale(legendScale);
        const redArray = ["#ffbaba", "#ff8f8f", "#ff6b6b", "#ff5454"];
        legendContainer
          .append("g")
          .call(legendAxis)
          .attr("transform", "translate(10,20)");
        legendContainer
          .selectAll("rect")
          .data(redArray)
          .enter()
          .append("rect")
          .attr("width", w / 20)
          .attr("height", 20)
          .style("fill", (d) => d)
          .attr("x", function (d, i) {
            return 10 + i * (w / 20);
          });
      }
    });
  }
});
