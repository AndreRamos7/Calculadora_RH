/*
 ========================================= CÓDIGO PARA ALTERAR ABAS COM CLIQUE
*/
//iniciar_dados_vazios();
get_notifications();
document.getElementById("conteudo_folha2").style.display = "block";
document.getElementById("conteudo_folha1").style.display = "none";
document.getElementById("conteudo_folha3").style.display = "none";

document.getElementById("aba1").addEventListener("click", function(){
	document.getElementById("conteudo_folha3").style.display = "none";
	document.getElementById("conteudo_folha2").style.display = "none";
	document.getElementById("conteudo_folha1").style.display = "block";
	atualizar_tabela();
	get_notifications();
});
document.getElementById("aba2").addEventListener("click", function(){
	document.getElementById("conteudo_folha1").style.display = "none";
	document.getElementById("conteudo_folha2").style.display = "block";
	document.getElementById("conteudo_folha3").style.display = "none";
	atualizar_tabela();
	get_notifications();
});
document.getElementById("aba3").addEventListener("click", function(){
	document.getElementById("conteudo_folha1").style.display = "none";
	document.getElementById("conteudo_folha2").style.display = "none";
	document.getElementById("conteudo_folha3").style.display = "block";	
	atualizar_tabela();
	get_notifications();	
});
/*
 ===================================== SCRIPTS EXTERNOS
 */
const LIMITE_DADOS = parseInt(199);

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
