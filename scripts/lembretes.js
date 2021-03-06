/* ================================================================================== */
/* ==========================   LEMBRETES    ======================================== */
/* ================================================================================== */
atualizar_tabela();
var id_4_del = document.getElementById("id_4_del").value;

function atualizar_tabela(){
    get_notifications();	
	chrome.storage.sync.get('dados', function(result) {	
		if(result.dados !== undefined){
			atualizar_tabela_com_filtros(result.dados.lembretes);
		}
	});
}

function atualizar_tabela_com_filtros(dados){
	var elemento_tabela = document.getElementById("tabela");
	if(dados == undefined){
		return;
	}
	elemento_tabela.innerHTML = "<tr>" +
								"<th>Nº</th>" +
								"	<th>Descrição</th>" +
								"	<th>Início</th>" +
								"	<th>Fim</th>" +
								"	<th>Ver</th>" +
								"</tr>";
	var cores = ["#bfbfbf", "white"];
	
	dados.forEach(function(item, index, array) {
		//console.log("forEach", item, index);

		var linha = document.createElement("tr");
		linha.id = item.id;
		linha.className = "unselected";
		linha.style.backgroundColor = cores[index % 2];
		var coluna_ordem = document.createElement("td");
		coluna_ordem.innerText = index;
		linha.appendChild(coluna_ordem);

		var coluna_descricao = document.createElement("td");
		coluna_descricao.innerText = item.descricao.substr(0, 30 + Math.ceil(item.descricao.length * 0.4)) + "...";
		coluna_descricao.title = item.descricao;
		linha.appendChild(coluna_descricao);

		var coluna_inicio = document.createElement("td");
		coluna_inicio.innerText = item.inicio;
		linha.appendChild(coluna_inicio);

		var coluna_final = document.createElement("td");
		coluna_final.innerText = item.fim;
		linha.appendChild(coluna_final);

		var coluna_actions = document.createElement("td");
		var btn_ver = document.createElement("img");			
        btn_ver.src = "Icons/pen.png";	
        btn_ver.width = "20";
        btn_ver.height = "20";
		btn_ver.style.cursor = "pointer";
		btn_ver.id = "ver_" + index;
		
		coluna_actions.appendChild(btn_ver);
		linha.appendChild(coluna_actions);
		
		linha.style.cursor = "pointer";
		linha.addEventListener("click", function(event){
			console.log("ID do botao: ", event.target.parentNode.id);
			document.getElementById("id_4_del").value = item.id;
			mostrar_dados_por_id(item.id);				
		});
		elemento_tabela.appendChild(linha);

		console.log('lembrete.descricao:::', item.descricao);
	});
}

function filtrar(event){
	//console.log("FILTRNADO: ", event.target.value);
	var filter = document.forms["form_filter"].periodo.value;
	chrome.storage.sync.get('dados', function(result) {			
		if(result.dados != undefined){
			console.log(result.dados.lembretes.filter(isToday));
			if(filter === "hoje"){
				atualizar_tabela_com_filtros(result.dados.lembretes.filter(isToday));
			}else{
				atualizar_tabela_com_filtros(result.dados.lembretes);
			}
		}
	});
}

function filtrar_texto(event){
	console.log("filtrar_texto: ", event.target.value);
	//var filter = event.target.value;
	chrome.storage.sync.get('dados', function(result) {			
		if(result.dados != "undefined"){
			atualizar_tabela_com_filtros(result.dados.lembretes.filter(procura_data));			
		}
	});
}

document.getElementById("periodo_hoje").addEventListener("click", filtrar);
document.getElementById("periodo_todos").addEventListener("click", filtrar);
document.getElementById("pesquisar").addEventListener("keyup", filtrar_texto);

document.getElementById("btn_novo").addEventListener("click", function(){	
	document.getElementById("id_4_del").value = "undefined";
	document.getElementById("lembrete_campo_descricao").focus();
	limpar_campos_lembretes();
});
document.getElementById("btn_lembrar").addEventListener("click", function(){	
	atualizar_tabela();	
	var id_4_del = document.getElementById("id_4_del").value;
	console.log("id_4_del: ", id_4_del);
	chrome.storage.sync.get('dados', function(result) {	
		if(result.dados != undefined){
			var idx_do_id = result.dados.lembretes.findIndex(tem_esse_Id);
			if(result.dados.lembretes.length <= LIMITE_DADOS){
				var lembrete_campo_descricao = document.getElementById("lembrete_campo_descricao").value;
				var lembrete_campo_data_ini = document.getElementById("lembrete_campo_data_ini").value;
				var lembrete_campo_data_fim = document.getElementById("lembrete_campo_data_fim").value;
				//console.log("idx_do_id: ", idx_do_id);
				if(idx_do_id != -1 && id_4_del != undefined){
					result.dados.lembretes.splice(idx_do_id, 1, {"id": id_4_del, "descricao": lembrete_campo_descricao, "inicio": lembrete_campo_data_ini, "fim": lembrete_campo_data_fim});			
					chrome.storage.sync.set({dados: result.dados}, function() {});
				}else{
					result.dados.lembretes.push({"id": getTIMESTAMP(), "descricao": lembrete_campo_descricao, "inicio": lembrete_campo_data_ini, "fim": lembrete_campo_data_fim});			
					chrome.storage.sync.set({dados: result.dados}, function() {});
				}
				atualizar_tabela();
			}else if(result.dados.lembretes.length >= LIMITE_DADOS){
				alert("A quantidade de lembretes excedeu o limite de " + LIMITE_DADOS + ". Exclua alguns deles");
			}
		}else if(result.dados == undefined){
			var lembrete_campo_descricao = document.getElementById("lembrete_campo_descricao").value;
			var lembrete_campo_data_ini = document.getElementById("lembrete_campo_data_ini").value;
			var lembrete_campo_data_fim = document.getElementById("lembrete_campo_data_fim").value;
			result = {dados: {"lembretes": []}};
			result.dados.lembretes.push({"id": getTIMESTAMP(), "descricao": lembrete_campo_descricao, "inicio": lembrete_campo_data_ini, "fim": lembrete_campo_data_fim});			
			chrome.storage.sync.set({dados: result.dados}, function() {
				atualizar_tabela();
			});
		}
    });
});
document.getElementById("btn_del").addEventListener("click", function(){
	id_4_del = document.getElementById("id_4_del").value;
    if(id_4_del != "undefined"){
        var confirmado = confirm("Item " + id_4_del + " será excluido! ok?");
        if(confirmado){
            chrome.storage.sync.get('dados', function(result) {			
                if(result != undefined){
					var idx_do_id = result.dados.lembretes.findIndex(tem_esse_Id);
                    result.dados.lembretes.splice(idx_do_id, 1);
                    chrome.storage.sync.set({dados: result.dados}, function() {});
                    atualizar_tabela();
                    limpar_campos_lembretes();
                }else{
                    alert("sem dados");
                }		
            });
            
        }else{
            //mensagem();
        }
    }else{
        alert("Primeiro clique sobre a linha para selecioná-la.");
    }
});

function tem_esse_Id(element, index, array) {
	var id_4_del = document.getElementById("id_4_del").value;
	if(element.id === id_4_del){
		return true;
	}
	return false;	
}

function mostrar_dados_por_id(id){
	var lembrete_campo_descricao = document.getElementById("lembrete_campo_descricao");
	var lembrete_campo_data_ini = document.getElementById("lembrete_campo_data_ini");
	var lembrete_campo_data_fim = document.getElementById("lembrete_campo_data_fim");

	chrome.storage.sync.get('dados', function(result) {		
		var dadoComID = result.dados.lembretes.findIndex(tem_esse_Id);	
		if(result != undefined && dadoComID != -1){			
			console.log(dadoComID);
			lembrete_campo_descricao.value = result.dados.lembretes[dadoComID].descricao;
			lembrete_campo_data_ini.value = result.dados.lembretes[dadoComID].inicio;
			lembrete_campo_data_fim.value = result.dados.lembretes[dadoComID].fim;
		}else{			
			alert("Dados não encontrado!");
		}
	});	
}

function limpar_campos_lembretes(){
	var lembrete_campo_descricao = document.getElementById("lembrete_campo_descricao");
	var lembrete_campo_data_ini = document.getElementById("lembrete_campo_data_ini");
	var lembrete_campo_data_fim = document.getElementById("lembrete_campo_data_fim");
	var id_4_del = document.getElementById("id_4_del");

	lembrete_campo_descricao.value = "";
	lembrete_campo_data_ini.value =  "";
	lembrete_campo_data_fim.value =  "";
	id_4_del.value = "undefined";
}
function get_notifications() {
	chrome.storage.sync.get('dados', function(result) {			
		if(result.dados != undefined){
			notificacoes(result.dados.lembretes.filter(isToday).length, result.dados.lembretes.length); 
		}
	});
}
  
function procura_data(value) {	
    var filter = document.forms["form_filter"].search.value;
	return value.fim === filter;
}

function isToday(value) {
	var data_atual = new Date();
	var dia = data_atual.getDate();
	var mes = data_atual.getMonth()+1;
	var ano = data_atual.getFullYear();
	//var agora = new Date([mes-1, "/" , dia, "/" , ano].join(''));            
	var hoje = [dia, "/" , mes, "/" , ano].join('');
	return calcular_datas(hoje, value.fim);
}

function calcular_datas(valor_data1, valor_data2) {
	//var valor_data1 = ;
	var array_data_inicial2 = valor_data1.split("/");   
	var dia_ini = array_data_inicial2[0];
	var mes_ini = array_data_inicial2[1];
	var ano_ini = array_data_inicial2[2];

	//var valor_data2 = ;	
	var array_data_final = valor_data2.split("/");   
	var dia_fim = array_data_final[0];
	var mes_fim = array_data_final[1];
	var ano_fim = array_data_final[2];
	
	var data_ini = new Date( [mes_ini, "/", dia_ini, "/", ano_ini].join('') );            
	var data_fim = new Date( [mes_fim, "/", dia_fim, "/", ano_fim].join('') );            

	var diferenca = Math.abs(data_fim.getTime() - data_ini.getTime());
	
	var dias = Math.ceil(diferenca / (1000 * 60 * 60 * 24));
	var qtd_dias = !isNaN(dias)? dias + 1: "undefined";
	if(qtd_dias != "undefined"){		
		return qtd_dias == 1;
	}
}

/*
exibe notificações no ícone
*/
function notificacoes(qtd, tt){
	document.getElementById("aba3").innerText = "Lembretes(" + qtd + "/" + tt + ")";
	var qtd_vencidos = [qtd, ""].join('') ;	
	if(parseInt(qtd) >= 1){
		chrome.browserAction.setBadgeText({text: qtd_vencidos}, () => { });
	}else{
		chrome.browserAction.setBadgeText({text: ""}, () => { });
	}
}

/*
iniciar_dados_vazios TVZ NÃO PRECISE DESTA FUNÇÃO
*/
function iniciar_dados_vazios(){
	chrome.storage.sync.get('dados', function(result) {			
		console.log("iniciar_dados_vazios result:: ", result.dados);
		if(result.dados != undefined){
			if(result.dados.lembretes.length == 0){			
				var lembrete_campo_descricao = "nada";
				var lembrete_campo_data_ini = "nada";
				var lembrete_campo_data_fim = "nada";
				result = {dados: {"lembretes": []}};
				result.dados.lembretes.push({"descricao": lembrete_campo_descricao, "inicio": lembrete_campo_data_ini, "fim": lembrete_campo_data_fim});			
				chrome.storage.sync.set({dados: result.dados}, function() {
					atualizar_tabela();
				});
			}
		}else if(result.dados == undefined){
			console.log("result vazio");
		}
    });
}
