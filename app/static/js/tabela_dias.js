var dados;

fetch('/tabela_dias')
  .then(response => response.json())
  .then(data => {
    dados = data;
   //console.log(dados);
    

    const eGridDiv = document.getElementById("tabela_dias");
    const columnDefs = [
        { field: "Dia_semana", 
          rowGroupIndex: 0, 
          hide: true,
          cellRenderer: 'agGroupCellRenderer',
         }, 

        { headerName: "Total", 
          field: "valor_unitpro", 
          aggFunc: 'sum', 
          valueFormatter: params => `R$ ${params.value.toFixed(2).replace('.', ',').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')}`,
          enableGroupTotal: true
        },

        { field: "faixas",
          rowGroupIndex: 1, 
          hide: true,
        },


        { headerName: "Vendas", 
          field: "first_occurrence", 
          aggFunc: 'sum'
         },

        { headerName: "QTD Peças", 
          field:'qtd_peça', 
          aggFunc:'sum' 
        },

        { headerName: "TKM", 
          valueGetter: function(params){
            var total = params.getValue('valor_unitpro')
            var vendas = params.getValue('first_occurrence')
            return total/vendas;
          },
         valueFormatter: params => `R$ ${params.value.toFixed(2).replace('.', ',').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')}`,
       }

    ];
    
    const gridOptions = {
        columnDefs: columnDefs,
        rowData: dados,
        animateRows: true,
        suppressColumnVirtualisation: true,
        autoGroupColumnDef:{
             field: 'os_id',
             cellRendererParams: {
                 suppressCount: true
             },
        },
        defaultColDef: {
          sortable: true,
          filter: true,
          
        }

        
    };
    
    
    new agGrid.Grid(eGridDiv, gridOptions);
    
    //gridOptions.api.sizeColumnsToFit();

});