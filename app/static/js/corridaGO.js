var dados;

fetch('/corrida_go')
  .then(response => response.json())
  .then(data => {
    dados = data;
   //console.log(dados);


    const eGridDiv = document.getElementById("tabela_go");
    const columnDefs = [
        { headerName: "Código",
          field: "codpro_id",
          cellRenderer: 'agGroupCellRenderer',
          minWidth: 220, maxWidth: 220,        
         },

         { headerName: "tipo",
         field: "tipo",
         cellRenderer: 'agGroupCellRenderer',
         minWidth: 220, maxWidth: 220,
         rowGroupIndex: 1,         
        },

         { field: "grupo",
         cellRenderer: 'agGroupCellRenderer',
         minWidth: 220, maxWidth: 220,
         rowGroupIndex: 0, 
        },

       { field: "descricao",
        cellRenderer: 'agGroupCellRenderer',
        minWidth: 300, maxWidth: 300,
        rowGroupIndex: 2, 
       },


        { headerName: "Valor unitário",
          field: "valor_unitsis",
         // valueFormatter: params => `R$ ${params.value.toLocaleString('pt-BR')}`,
          enableGroupTotal: true,
          enableValue: true,
          minWidth: 220, maxWidth: 220,
         
        },

        

        { headerName: "Valor Promocional",
        field: "valor_unitpro",
       // valueFormatter: params => `R$ ${params.value.toLocaleString('pt-BR')}`,
        enableGroupTotal: true,
        enableValue: true,
        minWidth: 220, maxWidth: 220,
     
      },

        { headerName: "QTD Vendido",
          field:'num_ocorrencias',
          minWidth: 150, maxWidth: 150,
          aggFunc: 'sum',
          
        },

        { headerName: "Total",
        field: "valor_total",
       // valueFormatter: params => `R$ ${params.value.toLocaleString('pt-BR')}`,
        enableGroupTotal: true,
        enableValue: true,
        aggFunc: 'sum',
        minWidth: 220, maxWidth: 220,
        
      },

    ];

    const gridOptions = {
        columnDefs: columnDefs,

        rowData: dados,
        animateRows: true,
        groupIncludeFooter: true,
        groupIncludeTotalFooter: true,
        pivotMode: true,

        //defaultToolPanel: 'filters',

        defaultColDef: {
          resizable: true,
          sortable: true,
          filter: true,
          enableValue: true,
          enableRowGroup: true,
          enablePivot: true,
          flex: 1,
          lockPosition: true,
        },
        sideBar: {
          toolPanels: [
              {
                  id: 'columns',
                  labelDefault: 'Columns',
                  labelKey: 'columns',
                  iconKey: 'columns',
                  toolPanel: 'agColumnsToolPanel',
                  minWidth: 225,
                  maxWidth: 225,
                  width: 225
              },
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
  }

    new agGrid.Grid(eGridDiv, gridOptions);
    //gridOptions.api.sizeColumnsToFit();

});