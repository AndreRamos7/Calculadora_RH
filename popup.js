/*
 ========================================= CÓDIGO PARA ALTERAR ABAS COM CLIQUE
*/
document.getElementById("conteudo_folha2").style.display = "block";
document.getElementById("conteudo_folha1").style.display = "none";
document.getElementById("conteudo_folha3").style.display = "none";

document.getElementById("aba1").addEventListener("click", function(){
	document.getElementById("conteudo_folha3").style.display = "none";
	document.getElementById("conteudo_folha2").style.display = "none";
	document.getElementById("conteudo_folha1").style.display = "block";
});
document.getElementById("aba2").addEventListener("click", function(){
	document.getElementById("conteudo_folha1").style.display = "none";
	document.getElementById("conteudo_folha2").style.display = "block";
	document.getElementById("conteudo_folha3").style.display = "none";
});
document.getElementById("aba3").addEventListener("click", function(){
	document.getElementById("conteudo_folha1").style.display = "none";
	document.getElementById("conteudo_folha2").style.display = "none";
	document.getElementById("conteudo_folha3").style.display = "block";	
	atualizar_tabela();
	
});
/*
 ===================================== SCRIPTS EXTERNOS
 */
const LIMITE_DADOS = parseInt(5);
var passhash = CryptoJS.MD5("password").toString();
console.log(passhash);
// Called when the user clicks on the browser action.
chrome.browserAction.onClicked.addListener(function(tab) {
	// No tabs or host permissions needed!
	console.log('Turning ' + tab.url + ' red!');
	chrome.tabs.executeScript({
	  code: 'document.body.style.backgroundColor="red"'
	});
  });

/*
 ===================================== CÓDIGO PARA ABA DE CÁLCULO DE CH PROPORCIONAL
 */
var elemento_data_de_lotacao = document.getElementById("data_de_lotacao");
var elemento_ch_anterior = document.getElementById("ch_anterior");
var elemento_ch_nova = document.getElementById("nova_ch");
var elemento_ch_prop = document.getElementById("ch_prop");

elemento_data_de_lotacao.addEventListener("keyup", calcular_ch);
elemento_ch_anterior.addEventListener("keyup", calcular_ch);
elemento_ch_anterior.addEventListener("change", calcular_ch);

elemento_ch_nova.addEventListener("keyup", calcular_ch);
elemento_ch_nova.addEventListener("change", calcular_ch);

elemento_data_de_lotacao.focus();

function calcular_ch(event) {	
	var array_data_ltc = elemento_data_de_lotacao.value.split("/");            
		
	var dia = array_data_ltc[0];
	var mes = array_data_ltc[1];
	var ano = array_data_ltc[2];

	var data_ins = new Date( [mes, "/", dia, "/", ano].join('') );
	var hoje = new Date();
	var diferenca = Math.abs(data_ins.getTime() - hoje.getTime());
	var dias = Math.ceil(diferenca / (1000 * 60 * 60 * 24));

	var dias_restantes = 30 - dia + 1;     
	var difer_ch = Math.abs(elemento_ch_nova.value - elemento_ch_anterior.value);       
	var novo_valor = parseFloat((difer_ch/30)*dias_restantes);
	var ch_prop = novo_valor + parseInt(elemento_ch_anterior.value);
	elemento_ch_prop.value = (!isNaN(ch_prop))? Math.round(ch_prop):"";
}  
/*
  =================================  CÓDIGO PARA ABA DE CÁLCULO DE DATAS
*/

_elemento_data_atual = document.getElementById("data_atual");
elemento_data_inicial_qq = document.getElementById("data_inicial_qq");
elemento_data_inicial2 = document.getElementById("data_inicial2");

elemento_num_dias1 = document.getElementById("num_dias1");
elemento_num_dias2 = document.getElementById("num_dias2");
elemento_data_final = document.getElementById("data_final");

elemento_data_prevista1 = document.getElementById("data_prevista1");
elemento_data_prevista2 = document.getElementById("data_prevista2");
elemento_num_dias3 = document.getElementById("num_dias3");
elemento_msg = document.getElementById("msg");
calcular_diferenca_pra_hoje();

function mensagem(msg, color = "red"){
	elemento_msg.innerText = msg;
	elemento_msg.style.color = color;
}

function is_teclado_numerico(keyCode){
	if(keyCode >= 96 && keyCode <= 105){
		return true;
	}else if(keyCode >= 48 && keyCode <= 57){
		return true;
	}else{
		return false;
	}
}

function mascarar(valor){
	var mascarado = valor;	
	if(typeof valor === 'number'){
		console.log("é número!" + typeof valor);
	}
	console.log("!" + typeof valor);
	console.log(valor.length);
	if(valor.length == 2){
		mascarado = [valor, "/"].join('');
	}
	if(valor.length == 5){
		mascarado = [valor, "/"].join('');
	}		
	return mascarado;
}

// ADICIONA EVENTOS AOS CAMPOS DE TEXTO
elemento_data_inicial_qq.addEventListener("keyup", (event) => {
	//if(is_teclado_numerico(event.keyCode)){
		calcular_data_qq_mais_dias(event);
	/*	mensagem("");
	}else{
		mensagem("Digite apenas valores numéricos. A '/' é automática.");
	}*/
});
elemento_num_dias2.addEventListener("keyup", (event) => {	
	calcular_data_qq_mais_dias();
});
elemento_num_dias2.addEventListener("change", (event) => {	
	calcular_data_qq_mais_dias();
});

elemento_data_prevista2.addEventListener("keyup", (event) => {
	calcular_data_qq_mais_dias();
});
elemento_data_inicial2.addEventListener("keyup", (event) => {	
	calcular_duas_datas();
});

elemento_num_dias3.addEventListener("keyup", (event) => {
	calcular_duas_datas();
});
elemento_num_dias3.addEventListener("change", (event) => {
	calcular_duas_datas();
});

elemento_data_final.addEventListener("keyup", (event) => {
	calcular_duas_datas();
});

elemento_num_dias1.addEventListener('keyup', (event) => {
	calcular_diferenca_pra_hoje();
});
elemento_num_dias1.addEventListener('change', (event) => {
	calcular_diferenca_pra_hoje();
});


function calcular_diferenca_pra_hoje() {
	// pega a data de hoje e mostra no campo de texto
	var data_atual = new Date();
	var dia = data_atual.getDate();
	var mes = data_atual.getMonth() + 1;
	var ano = data_atual.getFullYear();
	var agora = new Date([mes-1, "/" , dia, "/" , ano].join(''));            
	_elemento_data_atual.value = [dia, "/" , mes, "/" , ano].join('');
	
	var num_dias1 = parseInt(elemento_num_dias1.value);
	data_atual.setDate(data_atual.getDate() + num_dias1 - 1);
	dia = (!isNaN(data_atual.getDate()))? data_atual.getDate(): "";
	mes = (!isNaN(data_atual.getMonth() + 1))? data_atual.getMonth() + 1: "";
	ano = (!isNaN(data_atual.getFullYear()))? data_atual.getFullYear(): "";

	var data_prevista1 = [dia, "/", mes, "/", ano].join('');
	elemento_data_prevista1.value = data_prevista1;
}

function calcular_data_qq_mais_dias(event) {
	var valor = (elemento_data_inicial_qq.value);
	//elemento_data_inicial_qq.value = valor;
	var array_data_inicial_qq = valor.split("/");   
	var dia = array_data_inicial_qq[0];
	var mes = array_data_inicial_qq[1];
	var ano = array_data_inicial_qq[2];
				
	var num_dias2 = parseInt(elemento_num_dias2.value);
	var data_ins = new Date( [mes, "/", dia, "/", ano].join('') );            
	data_ins.setDate(data_ins.getDate() + num_dias2 - 1);  
	dia = (!isNaN(data_ins.getDate()))? data_ins.getDate(): "";
	mes = (!isNaN(data_ins.getMonth() + 1))? data_ins.getMonth() + 1: "";
	ano = (!isNaN(data_ins.getFullYear()))? data_ins.getFullYear(): "";
	var data_prevista2 = [dia, "/", mes, "/", ano].join('');
	elemento_data_prevista2.value = data_prevista2;
   
}

function calcular_duas_datas() {
	var valor_data1 = mascarar(elemento_data_inicial2.value);
	//elemento_data_inicial2.value = valor_data1;
	var array_data_inicial2 = valor_data1.split("/");   
	var dia_ini = array_data_inicial2[0];
	var mes_ini = array_data_inicial2[1];
	var ano_ini = array_data_inicial2[2];

	var valor_data2 = mascarar(elemento_data_final.value);
	//elemento_data_final.value = valor_data2;
	var array_data_final = valor_data2.split("/");   
	var dia_fim = array_data_final[0];
	var mes_fim = array_data_final[1];
	var ano_fim = array_data_final[2];
	
	var data_ini = new Date( [mes_ini, "/", dia_ini, "/", ano_ini].join('') );            
	var data_fim = new Date( [mes_fim, "/", dia_fim, "/", ano_fim].join('') );            

	var diferenca = Math.abs(data_fim.getTime() - data_ini.getTime());
	var dias = Math.ceil(diferenca / (1000 * 60 * 60 * 24));
	elemento_num_dias3.value = !isNaN(dias)? dias+1: "--";

}

/* ================================================================================== */
/* ==========================   LEMBRETES    ======================================== */
/* ================================================================================== */
function atualizar_tabela(){
	var elemento_tabela = document.getElementById("tabela");
	elemento_tabela.innerHTML = "<tr>" +
								"<th>Nº</th>" +
								"	<th>Descrição</th>" +
								"	<th>Início</th>" +
								"	<th>Fim</th>" +
								"	<th>Ver</th>" +
								"</tr>";
	chrome.storage.sync.get('dados', function(result) {		
		var cores = ["#bfbfbf", "white"];
		result.dados.lembretes.forEach(function(item, index, array) {
			console.log(item, index);

			var linha = document.createElement("tr");
			linha.className = "unselected";
			linha.style.backgroundColor = cores[index % 2];
			var coluna_ordem = document.createElement("td");
			coluna_ordem.innerText = index;
			linha.appendChild(coluna_ordem);

			var coluna_descricao = document.createElement("td");
			coluna_descricao.innerText = item.descricao.substr(Math.ceil(item.descricao.length * 0.4)) + "...";
			coluna_descricao.title = item.descricao;
			linha.appendChild(coluna_descricao);

			var coluna_inicio = document.createElement("td");
			coluna_inicio.innerText = item.inicio;
			linha.appendChild(coluna_inicio);

			var coluna_final = document.createElement("td");
			coluna_final.innerText = item.fim;
			linha.appendChild(coluna_final);

			var coluna_actions = document.createElement("td");
			var btn_ver = document.createElement("input");			
			btn_ver.type = "checkbox";			
			btn_ver.style.cursor = "pointer";
			btn_ver.id = "ver_" + index;
			
			coluna_actions.appendChild(btn_ver);
			linha.appendChild(coluna_actions);
			
			linha.style.cursor = "pointer";
			linha.addEventListener("click", function(event){
				console.log("ID do botao: ", event.target.id);
				document.getElementById("id_4_del").value = index;
				document.getElementById("id_4_save").value = index;
				mostrar_dados_por_id(index);				
			});
			elemento_tabela.appendChild(linha);

			console.log('lembrete.descricao:::', item.descricao);
		});
	});
}

document.getElementById("btn_novo").addEventListener("click", function(){	
	document.getElementById("id_4_save").value = "undefined";
	limpar_campos_lembretes();
});

document.getElementById("btn_lembrar").addEventListener("click", function(){	
	var id_4_save = document.getElementById("id_4_save").value;
	console.log("id_4_save: ", id_4_save);
	chrome.storage.sync.get('dados', function(result) {			
		if(result !== undefined && result.dados.lembretes.length <= LIMITE_DADOS){
			var lembrete_campo_descricao = document.getElementById("lembrete_campo_descricao").value;
			var lembrete_campo_data_ini = document.getElementById("lembrete_campo_data_ini").value;
			var lembrete_campo_data_fim = document.getElementById("lembrete_campo_data_fim").value;
			
			if(id_4_save !== "undefined"){
				result.dados.lembretes.splice(id_4_save, 1, {"descricao": lembrete_campo_descricao, "inicio": lembrete_campo_data_ini, "fim": lembrete_campo_data_fim});			
				chrome.storage.sync.set({dados: result.dados}, function() {});
			}else{
				result.dados.lembretes.push({"descricao": lembrete_campo_descricao, "inicio": lembrete_campo_data_ini, "fim": lembrete_campo_data_fim});			
				chrome.storage.sync.set({dados: result.dados}, function() {});
			}
			atualizar_tabela();
		}else if(result.dados.lembretes.length >= LIMITE_DADOS){
			alert("A quantidade de lembretes excedeu o limite de " + LIMITE_DADOS + ". Exclua alguns deles");
		}else if(result === undefined){
			var value = {lembretes: [{"descricao": "descricao padrao 2", "inicio": "12/12/2020", "fim": "12/05/2021"}]};			
			chrome.storage.sync.set({dados: value}, function() {});
		}
    });
});

document.getElementById("btn_del").addEventListener("click", function(){
	var id_4_del = document.getElementById("id_4_del").value;

	var confirmado = confirm("Será excluido. ok?");
	if(confirmado){
		chrome.storage.sync.get('dados', function(result) {			
			if(result !== undefined){
				result.dados.lembretes.splice(id_4_del, 1);
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
});

function mostrar_dados_por_id(id){
	var lembrete_campo_descricao = document.getElementById("lembrete_campo_descricao");
	var lembrete_campo_data_ini = document.getElementById("lembrete_campo_data_ini");
	var lembrete_campo_data_fim = document.getElementById("lembrete_campo_data_fim");

	chrome.storage.sync.get('dados', function(result) {			
		if(result !== undefined){
			lembrete_campo_descricao.value = result.dados.lembretes[id].descricao;
			lembrete_campo_data_ini.value = result.dados.lembretes[id].inicio;
			lembrete_campo_data_fim.value = result.dados.lembretes[id].fim;
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
	id_4_del = undefined;

}

chrome.storage.sync.get('dados', function(result) {			
	if(result !== undefined){
		notificacoes(result.dados.lembretes.filter(isToday).length, result.dados.lembretes.length); 
	}
});
  
function isToday(value) {
	var data_atual = new Date();
	var dia = data_atual.getDate();
	var mes = data_atual.getMonth()+1;
	var ano = data_atual.getFullYear();
	//var agora = new Date([mes-1, "/" , dia, "/" , ano].join(''));            
	var hoje = [dia, "/" , mes, "/" , ano].join('');
	return value.fim === hoje;
}

function notificacoes(qtd, tt){
	document.getElementById("aba3").innerText = "Lembretes(" + qtd + "/" + tt + ")";
	var qtd_vencidos = [qtd % 9, "+"].join('') ;	
	if(parseInt(qtd) >= 1){
		chrome.browserAction.setBadgeText({text: qtd_vencidos}, () => { });
	}
	

}
  