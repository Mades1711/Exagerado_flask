var dados;

fetch('/tabela_dias')
  .then(response => response.json())
  .then(data => {
    dados = data;
   //console.log(dados);

   function reais(params) {
    if (typeof params.value !== 'number') {
      return params.value;
    }
    const formattedValue = `R$ ${params.value.toLocaleString('pt-BR')}`

    return formattedValue
  }
    

    const eGridDiv = document.getElementById("tabela_dias");
    const columnDefs = [
        { field: "Dia_semana", 
          rowGroupIndex: 0, 
          hide: true,
          cellRenderer: 'agGroupCellRenderer',
          lockPosition: true,
         }, 

        { headerName: "Total", 
          field: "valor_unitpro", 
          aggFunc: 'sum', 
          valueFormatter: reais,
          enableGroupTotal: true,
          enableValue: true,
          minWidth: 150, maxWidth: 150,
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
          minWidth: 100, maxWidth: 100,
          lockPosition: true 
         },

        { headerName: "Peças", 
          field:'qtd_peça', 
          aggFunc:'sum',
          minWidth: 100, maxWidth: 100,
          lockPosition: true
        },

        { headerName: "TKM", 
          valueGetter: function(params){
            var total = params.getValue('valor_unitpro')
            var vendas = params.getValue('first_occurrence')
            return total/vendas;
          },
         valueFormatter: params => `R$ ${params.value.toFixed(2).replace('.', ',').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')}`,
         minWidth: 100, maxWidth: 100,
         lockPosition: true
       }

    ];
    
    const gridOptions = {
        columnDefs: columnDefs,
        rowData: dados,
        animateRows: true,
        groupIncludeFooter: true,
        groupIncludeTotalFooter: true,
        suppressAggFuncInHeader: true,
        suppressColumnVirtualisation: true,
        autoGroupColumnDef:{
             field: 'os_id',
             pinned: 'left',
             cellRendererParams: {
                 suppressCount: true
             },
        },
        defaultColDef: {
          resizable: true,
          sortable: true,
          filter: true,
          enableValue: true,
          enableRowGroup: true,
          enablePivot: true,
          flex: 1,
          lockPosition: true,
          
        }

        
    };
    
    
    new agGrid.Grid(eGridDiv, gridOptions);
    
    //gridOptions.api.sizeColumnsToFit();

});