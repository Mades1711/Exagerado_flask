var dados;

fetch('/grafico_protunit')
  .then(response => response.json())
  .then(data => {
    dados = data;
    // console.log(dados);

    const densityCanvas = document.getElementById("grafico");
    
    const quantidadeArray = dados.map(objeto => objeto.quantidade);
    const valor_uniproArray = dados.map(objeto => objeto.valor_unitpro);
    Chart.defaults.color = '#fff';

    let densityData = {
       label: "Quantidade",
       data: quantidadeArray,
       backgroundColor:  "#F50707",
       borderWidth: 2,
       hoverBorderWidth: 2.5,
       hoverBackgroundColor: "darkgray",
       hoverBorderColor: "white",
       indexAxis: "y",
       barPercentage: 1,

       

    };

    let barChart = new Chart(densityCanvas, {
        type: "bar",
        data: {
          labels: valor_uniproArray,
          datasets: [densityData]
        },
        options: {
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              color: "white",
              text: 'Top 10 Quantidade vendida por preço unitário',
              font: {
                  size: 20
              },
            },
      
            legend: {
              labels: {
                color: "white"
              },
              display: false,
      
            },

          }
        },
        plugins:[ChartDataLabels], 
      });
      

    const subbox = document.querySelector('.subbox');
    subbox.style.height = '500px';
    if(barChart.data.labels.length > 7) {
        const newHeight =  ((barChart.data.labels.length - 7));
        subbox.style.height = '${newHeight}px';
    }

  });
