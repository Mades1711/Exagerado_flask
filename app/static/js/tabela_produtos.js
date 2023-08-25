var dados;

fetch('/tabela_produtos')
  .then(response => response.json())
  .then(data => {
    dados = data;
    //console.log(dados);
    function decimalFormatter(params) {
      const decimalPlaces = 2;

      if (typeof params.value !== 'number') {
        return params.value;
      }

      const formattedValue = params.value.toFixed(decimalPlaces);

      return formattedValue;
    }

    function reais(params) {
      if (typeof params.value !== 'number') {
        return params.value;
      }
      const formattedValue = `R$ ${params.value.toLocaleString('pt-BR')}`

      return formattedValue
    }
    function TKM(params) {
      var total = params.getValue('valor_total')
      var vendas = params.getValue('num_ocorrencias')
      return total / vendas;
    }

    const eGridDiv = document.getElementById("tabela_produtos");
    const columnDefs = [
      {
        field: "grupo",
        cellRenderer: 'agGroupCellRenderer',
        minWidth: 220, maxWidth: 220,
        rowGroupIndex: 0,
        hide: true
      },

      {
        headerName: "tipo",
        field: "tipo",
        cellRenderer: 'agGroupCellRenderer',
        minWidth: 220, maxWidth: 220,
        rowGroupIndex: 1,
        hide: true
      },

      {
        field: "descricao",
        cellRenderer: 'agGroupCellRenderer',
        minWidth: 300, maxWidth: 300,
        rowGroupIndex: 2,
        hide: true
      },

      {
        headerName: "Código",
        field: "codpro_id",
        cellRenderer: 'agGroupCellRenderer',
        minWidth: 220, maxWidth: 220,
        hide: true
      },

      {
        headerName: "Valor unitário",
        field: "valor_unitsis",
        // valueFormatter: params => `R$ ${params.value.toLocaleString('pt-BR')}`,
        enableGroupTotal: true,
        enableValue: true,
        minWidth: 220, maxWidth: 220,
        hide: true

      },

      {
        headerName: "Valor Promocional",
        field: "valor_unitpro",
        // valueFormatter: params => `R$ ${params.value.toLocaleString('pt-BR')}`,
        enableGroupTotal: true,
        enableValue: true,
        minWidth: 220, maxWidth: 220,
        hide: true

      },

      {
        headerName: "QTD Vendido",
        field: 'num_ocorrencias',
        minWidth: 200, maxWidth: 200,
        aggFunc: 'sum',
      },

      {
        headerName: "Total",
        field: "valor_total",
        valueFormatter: reais,
        enableGroupTotal: true,
        enableValue: true,
        aggFunc: 'sum',
        minWidth: 200, maxWidth: 200,
        sort: 'desc',

      },
      {
        headerName: "TKM",
        valueGetter: TKM,
        valueFormatter: decimalFormatter,
        minWidth: 130, maxWidth: 130,
        lockPosition: true,
        enableGroupTotal: true,
        enableValue: true,


      },

    ];

    const gridOptions = {
      columnDefs: columnDefs,
      rowData: dados,
      animateRows: true,
      groupIncludeFooter: true,
      groupIncludeTotalFooter: true,
      suppressAggFuncInHeader: true,
      suppressColumnVirtualisation: true,

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