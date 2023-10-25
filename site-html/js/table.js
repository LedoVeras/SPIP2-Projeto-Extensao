$(document).ready(function () {
	$.ajax({
		url: 'backend/get_data.php',
		type: 'GET',
		dataType: 'json',
		success: function (data) {
			// console.log(data);
			populateDataTable(data);
		},
		error: function (xhr, status, error) {
			console.error('Erro ao obter dados:', status, error);
		}
	});

	function populateDataTable(data) {
		if ($.fn.DataTable.isDataTable('#dataTable')) {
			// 	$('#dataTable').DataTable().destroy();
			// 	table.clear();
			// 	table.ajax.reload();
			table.clear().destroy();
		}

		var table = $('#dataTable').DataTable({
			// autoWidth: false,
			paging: true,
			language: {
				"sEmptyTable": "Nenhum dado encontrado",
				"sInfo": "Mostrando de _START_ até _END_ de _TOTAL_ registros",
				"sInfoEmpty": "Mostrando 0 até 0 de 0 registros",
				"sInfoFiltered": "(Filtrados de _MAX_ registros)",
				"sInfoPostFix": "",
				"sInfoThousands": ".",
				"sLengthMenu": "_MENU_ resultados por página",
				"sLoadingRecords": "Carregando...",
				"sProcessing": "Processando...",
				"sZeroRecords": "Nenhum registro encontrado",
				"sSearch": "Pesquisar",
				"oPaginate": {
					"sNext": "Próximo",
					"sPrevious": "Anterior",
					"sFirst": "Primeiro",
					"sLast": "Último"
				},
				"oAria": {
					"sSortAscending": ": Ordenar colunas de forma ascendente",
					"sSortDescending": ": Ordenar colunas de forma descendente"
				}
			},
			data: data,
			columns: [
				// {
				// 	data: 'data',
				// 	title: 'Data',
				// 	render: function (data, type, row) {
				// 		if (type === 'display' || type === 'sort') {
				// 			var parts = data.split('/');
				// 			if (parts.length === 3) {
				// 				return parts[2] + '/' + parts[1] + '/' + parts[0];
				// 			}
				// 		}
				// 		return data;
				// 	}
				// },
				{
					data: 'data',
					title: 'Data',
					// width: '15%',
					render: function (data, type, row, meta) {
						if (type === 'sort') {
							return moment(data, 'DD/MM/YYYY').format('YYYY/MM/DD');
						}
						return data;
					}
				},
				// { data: 'nome', title: 'Nome', width: '18%' },
				// { data: 'sintomas', title: 'Sintomas', width: '30%' },
				// { data: 'comorbidades', title: 'Comorbidades', width: '15%' },
				// { data: 'municipio', title: 'Município', width: '12%' },
				// { data: 'leito', title: 'Leito', width: '10%' }
				{ data: 'nome', title: 'Nome' },
				{ data: 'sintomas', title: 'Sintomas' },
				{ data: 'comorbidades', title: 'Comorbidades' },
				{ data: 'municipio', title: 'Município' },
				{ data: 'leito', title: 'Leito' }
			],
			scrollX: true,
			responsive: {
				details: {
					type: 'column'
				}
			},
			columnDefs: [
				{
					targets: '_all',
					width: 150,
					render: function (data, type, row, meta) {
						var isLongText = type === 'display' && data.length > 60;
						var displayText = isLongText ? data.substr(0, 60) + ' <strong>(...)</strong>' : data;
						var cssClass = isLongText ? 'expandable' : '';
						return `<span class="${cssClass}" title="${data}">${displayText}</span>`;
					}
				}
			],
			createdRow: function (row, data, index) {
				$(row).addClass('collapsed-row');
				$(row).attr('data-toggle', 'tooltip');
				$(row).attr('title', 'Clique para expandir/colapsar');
				var button = $('<span class="expand-button">▶️ </span>');
				$(row).find('td:first-child').prepend(button);

				button.click(function (e) {
					e.stopPropagation();
					var tr = $(this).closest('tr');
					var row = table.row(tr);

					if (tr.hasClass('collapsed')) {
						tr.removeClass('collapsed');
						row.child.show();
					} else {
						tr.addClass('collapsed');
						row.child.hide();
					}

					updateExpandIcon(button, tr.hasClass('collapsed'));
				});
				// },
				// initComplete: function (settings, json) {
				// 	var dateColumns = [0];
				// 	dateColumns.forEach(function (index) {
				// 		var cells = table.column(index).nodes();
				// 		cells.each(function () {
				// 			var originalDate = $(this).text();
				// 			var formattedDate = formatarData(originalDate);
				// 			$(this).text(formattedDate);
				// 		});
				// 	});
			}
		});
		// table.rows.add(data).draw();
		table.order([0, 'desc']).draw();
		table.rows().every(function () {
			var rowData = this.data();
			var detailsHtml = '<div class="details-container">';
			detailsHtml += '<strong>Sexo:</strong> ' + rowData.sexo + '<br>';
			detailsHtml += '<strong>Idade:</strong> ' + rowData.idade + '<br>';
			detailsHtml += '<strong>Vacina:</strong> ' + rowData.vacina + '<br>';
			detailsHtml += '<strong>Data dos Sintomas:</strong> ' + rowData.data_sintomas + '<br>';
			detailsHtml += '<strong>Exames:</strong> ' + rowData.exames + '<br>';
			detailsHtml += '<strong>Hipótese Diagnóstica:</strong> ' + rowData.hipotese_diagnostica + '<br>';
			// detailsHtml += '<strong>Cotificações:</strong> ' + (rowData.cotificacoes ? 'Sim' : 'Não') + '<br>';
			detailsHtml += '<strong>Cotificações:</strong> ' + rowData.cotificacoes + '<br>';
			detailsHtml += '<strong>Data de Atualização:</strong> ' + rowData.data_de_atualizacao + '<br>';
			// detailsHtml += '<strong>Status:</strong> ' + (rowData.status ? 'Sim' : 'Não') + '<br>';
			detailsHtml += '<strong>Status:</strong> ' + rowData.status + '<br>';
			detailsHtml += '</div>';

			this.child(detailsHtml).hide();
		});

		table.rows().every(function () {
			$(this.node()).addClass('parent-row');
			if (this.child.isShown()) {
				$(this.node()).removeClass('collapsed');
				updateExpandIcon($(this.node()).find('.expand-button'), false);
			} else {
				updateExpandIcon($(this.node()).find('.expand-button'), true);
			}
		});

		$('.expandable').click(function () {
			var content = $(this).attr('title');
			$(this).html(content);
		});
	}

	function updateExpandIcon(button, collapsed) {
		button.text(collapsed ? '▶️ ' : '🔽 ');
	}
});