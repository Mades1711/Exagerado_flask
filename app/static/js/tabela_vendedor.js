var dados;

fetch('/tabela_dias')
  .then(response => response.json())
  .then(data => {
    dados = data;
   //console.log(dados);
    

    const eGridDiv = document.getElementById("tabela_vendedor");
    const columnDefs = [
        { field: "first_name", 
          rowGroupIndex: 0, 
          hide: true,
          cellRenderer: 'agGroupCellRenderer',
          lockPosition: true
         }, 

        { headerName: "Total", 
          field: "valor_unitpro", 
          aggFunc: 'sum', 
          valueFormatter: params => `R$ ${params.value.toFixed(2).replace('.', ',').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')}`,
          enableGroupTotal: true,
          enableValue: true,
          
          lockPosition: true
        },

        { field: "faixas",
          rowGroupIndex: 1, 
          hide: true,
          lockPosition: true
        },


        { headerName: "Vendas", 
          field: "first_occurrence", 
          aggFunc: 'sum',
          
          lockPosition: true 
         },

        { headerName: "Peças", 
          field:'qtd_peça', 
          aggFunc:'sum',
          
          lockPosition: true
        },

        { headerName: "TKM", 
          valueGetter: function(params){
            var total = params.getValue('valor_unitpro')
            var vendas = params.getValue('first_occurrence')
            return total/vendas;
          },
         valueFormatter: params => `R$ ${params.value.toFixed(2).replace('.', ',').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')}`,
         
         lockPosition: true
       }

    ];
    
    const gridOptions = {
        columnDefs: columnDefs,
        rowData: dados,
        animateRows: true,
        suppressColumnVirtualisation: true,
        suppressAggFuncInHeader: true,
        autoGroupColumnDef:{
             field: 'grupo',
             pinned: 'left',
             cellRendererParams: {
                 suppressCount: true
             },
        },
        defaultColDef: {
          resizable: true,
          sortable: true,
          filter: true,
          floatingFilter: true,
          
        }

        
    };
    
    
    new agGrid.Grid(eGridDiv, gridOptions);
    
    //gridOptions.api.sizeColumnsToFit();

});