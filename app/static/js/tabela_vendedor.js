var dados;

fetch('/tabela_dias')
  .then(response => response.json())
  .then(data => {
    dados = data;
   //console.log(dados);

   function decimalFormatter(params) {
    // Defina o número de casas decimais desejado
    const decimalPlaces = 2;
  
    // Verifique se o valor é um número
    if (typeof params.value !== 'number') {
      return params.value;
    }
  
    // Formate o valor com o número fixo de casas decimais
    const formattedValue = params.value.toFixed(decimalPlaces);
  
    return formattedValue;
  }
    

    const eGridDiv = document.getElementById("tabela_vendedor");
    const columnDefs = [
        { headerName: "Vendedor",
          field: "first_name", 
          rowGroupIndex: 0, 
          hide: true,
          cellRenderer: 'agGroupCellRenderer',
          lockPosition: true,
          minWidth: 220, maxWidth: 220,
         },

         {headerName: 'Grupo',
          field:'grupo', 
          minWidth: 130, maxWidth: 130,
          lockPosition: true,
          hide: true
         },

        { headerName: "Dia",
         field: "Dia_semana", 
         rowGroupIndex: 1, 
         hide: true,
         cellRenderer: 'agGroupCellRenderer',
         lockPosition: true,
         minWidth: 220, maxWidth: 220,
        }, 

        { headerName: "Total", 
          field: "valor_unitpro", 
          aggFunc: 'sum', 
          //valueFormatter: params => `R$ ${params.value.toFixed(2).replace('.', ',').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')}`,
          enableGroupTotal: true,
          enableValue: true,
          minWidth: 220, maxWidth: 220,
          lockPosition: true
        },

        { field: "faixas",
          rowGroupIndex: 2, 
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
         valueFormatter: decimalFormatter,
         minWidth: 130, maxWidth: 130,
         lockPosition: true
       },



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
          
        },
        sideBar: {
          toolPanels: [
              {
                  id: 'filters',
                  labelDefault: 'Filters',
                  labelKey: 'filters',
                  iconKey: 'filter',
                  toolPanel: 'agFiltersToolPanel',
                  minWidth: 180,
                  maxWidth: 400,
                  width: 250
              },              
          ],
          position: 'left',
        },

        
    };
    
    
    new agGrid.Grid(eGridDiv, gridOptions);
    
    //gridOptions.api.sizeColumnsToFit();

});