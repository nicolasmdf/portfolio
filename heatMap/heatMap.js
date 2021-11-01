function formatMonths(month) {
    const months = {
      1: 'January',
      2: 'February',
      3: 'March',
      4: 'April',
      5: 'May',
      6: 'June',
      7: 'July',
      8: 'August',
      9: 'September',
      10: 'October',
      11: 'November',
      12: 'December'
    };
    return months[month];
  }
  
  let tooltip = document.getElementById('tooltip');
  let legend = document.getElementById('legend');
  
  let colors = ['#0033ff', '#b5c3ff', '#b8f9bd', '#daff96', '#fbff9b', '#ffdc93', '#ffae00', '#ff1111', '#bc2929'];
  //label
  colors.forEach((c, i) => {
    let div = document.createElement('div');
    let label = document.createElement('label');
    div.id = 'color'+i;
    div.className = 'color';
    div.innerHTML = '&nbsp';
    div.style.color = c;
    div.style.backgroundColor = c;
    legend.appendChild(div);
  });
  
  let handleMouse = (d) => {
   tooltip.setAttribute('data-year', d.year); 
   tooltip.style.display = 'inline';
   tooltip.innerHTML = 'Year: ' + d.year + '<br/>' +
                       'Variance: ' + d.variance + '<br/>';
   tooltip.style.left = (d3.event.x < 1000) ? (d3.event.x+25) + 'px' : (d3.event.x-150) + 'px';
   tooltip.style.top = d3.event.y + 'px';
  };
  
  function process(data) {
    let graphData = data.monthlyVariance;
    
    //sizing
    const height = 500;
    const width = 1100;
    const padding = 70;  
    //scales
    const xScale = d3.scaleLinear().range([padding, width-padding]).domain(d3.extent(graphData, (d)=>d.year));
    const yScale = d3.scaleLinear().range([height-padding, padding]).domain(d3.extent(graphData, (d)=>d.month));
    const colorScale = d3.scaleQuantize().range(colors).domain(d3.extent(graphData, (d)=>d.variance));
    //the meat
    const svg = d3.select('#graph')
                .append('svg')
                .attr('height', height)
                .attr('width', width);
  
    svg.selectAll('rect')
       .data(graphData)
       .enter()
       .append('rect')
       .attr('class', 'cell')
       .attr('x', (d)=>xScale(d.year))
       .attr('y',(d)=>yScale(d.month))
       .attr('data-month', (d)=>d.month)
       .attr('data-year', (d)=>d.year)
       .attr('data-temp', (d)=>d.variance)
       .attr('width', 5)
       .attr('height',40)
       .on('mouseover', (d) => handleMouse(d))
       .on('mouseout', ()=>{ tooltip.style.display = 'none'; })
       .attr('fill', (d)=>colorScale(d.variance));
  
    //axes
   const xAxis = d3.axisBottom().scale(xScale).tickFormat(d3.format(".4"));
   const yAxis = d3.axisLeft().scale(yScale).tickFormat(formatMonths);
    
    svg.append('g')
       .call(xAxis)
       .attr('transform', 'translate(0,' + (height-padding+40) + ')')
       .attr('id', 'x-axis');
    
    svg.append('g')
       .call(yAxis)
       .attr('transform', 'translate(' + padding + ',20)')
       .attr('id', 'y-axis');
  }
  //get data
  function reqListener() {
    process(JSON.parse(this.response));
  }
  let req = new XMLHttpRequest();
  req.addEventListener('load', reqListener);
  req.open('GET', 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json');
  req.send();
  