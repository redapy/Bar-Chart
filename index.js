
const w = 800;
const h = 600;
const p = 45;

// append svg
const svg = d3.select('svg')
    .attr('width', w)
    .attr('height', h)

// add tooltip
const tooltip = d3.select("body")
    .append("div")
    .attr("id", "tooltip")
    .style("visibility", 'hidden');

d3.json('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json')
    .then(dataSet => {
        const data = dataSet.data;

        // height Scale 
        const max = d3.max(data, d => d[1])
        const heightScale = d3.scaleLinear()
            .domain([0, max])
            .range([0, h - (2 * p)])
        
        // X scale
        const xScale = d3.scaleLinear()
            .domain([0, data.length -1])
            .range([p, w-p])

        // x-axis 
        const dates = data.map(d => new Date(d[0]))
        const xAxisScale = d3.scaleTime()
            .domain([d3.min(dates), d3.max(dates)])
            .range([p, w-p])
        // y-axis
        const yAxisScale = d3.scaleLinear()
            .domain([0, max])
            .range([h-p, p])
        
        // create x-axis
        const xAxis = d3.axisBottom(xAxisScale)

        svg.append('g')
            .attr('id', 'x-axis')
            .call(xAxis)
            .attr('transform', 'translate(0,' + (h-p) + ')')
        
        // create y-axis
        const yAxis = d3.axisLeft(yAxisScale)

        svg.append('g')
            .attr('id', 'y-axis')
            .call(yAxis)
            .attr('transform', 'translate(' + p +',0)')




        const rect = svg.selectAll('rect')
            .data(data)
            .enter()
            .append('rect')
            .attr('class', 'bar')
            .attr('width', (w - (2 * p)) / data.length)
            .attr('height', d => heightScale(d[1]))
            .attr('x',  (d,i) => xScale(i))
            .attr('y', d => (h-p) - heightScale(d[1]))
            .attr('data-date', d => d[0])
            .attr('data-gdp', d => d[1])
            .on('mouseover', (a, d) => {
                tooltip.transition()
                    .style("visibility", 'visible');;
                
                tooltip.text(d[0]);
                document.getElementById('tooltip').setAttribute('data-date', d[0])
            })
            .on('mouseout', () => {
                tooltip.transition()
                    .style("visibility", 'hidden');              
            })

    })