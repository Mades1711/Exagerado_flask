var dados;

fetch('/tabela_dias')
  .then(response => response.json())
  .then(data => {
    dados = data;
   //console.log(dados);
    

    const eGridDiv = document.getElementById("tabela_produtos");
    const columnDefs = [
        { field: "first_name", 
          rowGroupIndex: 0, 
          hide: true,
          cellRenderer: 'agGroupCellRenderer',
          lockPosition: true,
          minWidth: 220, maxWidth: 220,
         }, 

        { headerName: "Total", 
          field: "valor_unitpro", 
          aggFunc: 'sum', 
          valueFormatter: params => `R$ ${params.value.toFixed(2).replace('.', ',').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')}`,
          enableGroupTotal: true,
          enableValue: true,
          minWidth: 220, maxWidth: 220,
          lockPosition: true
        },

        { field: "faixas",
          rowGroupIndex: 1, 
          hide: true,
          lockPosition: true,
          minWidth: 130, maxWidth: 130,
        },


        { headerName: "Vendas", 
          field: "first_occurrence", 
          aggFunc: 'sum',
          minWidth: 130, maxWidth: 130,
          lockPosition: true 
         },

        { headerName: "Peças", 
          field:'qtd_peça', 
          aggFunc:'sum',
          minWidth: 130, maxWidth: 130,
          lockPosition: true
        },

        { headerName: "TKM", 
          valueGetter: function(params){
            var total = params.getValue('valor_unitpro')
            var vendas = params.getValue('first_occurrence')
            return total/vendas;
          },
         valueFormatter: params => `R$ ${params.value.toFixed(2).replace('.', ',').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')}`,
         minWidth: 130, maxWidth: 130,
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