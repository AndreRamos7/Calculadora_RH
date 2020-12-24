'use strict';
const menuItems = {
    'diff_hoje': 'Quantidade de dias?'
};

function getTIMESTAMP() {
	var date = new Date();
	var year = date.getFullYear();
	var month = ("0" + (date.getMonth() + 1)).substr(-2);
	var day = ("0" + date.getDate()).substr(-2);
	var hour = ("0" + date.getHours()).substr(-2);
	var minutes = ("0" + date.getMinutes()).substr(-2);
	var seconds = ("0" + date.getSeconds()).substr(-2);
	var carimbo = year + "-" + month + "-" + day + " " + hour + ":" + minutes + ":" + seconds;	
	return carimbo;
}

chrome.runtime.onInstalled.addListener(function() { 
	console.log("iniciado/instalado");  
	for (let key of Object.keys(menuItems)) {
		chrome.contextMenus.create({
		  id: key,
		  title: menuItems[key],
		  type: 'normal',
		  contexts: ['selection'],
		});
	  }

});
get_notifications();

chrome.alarms.create("teste",{delayInMinutes: 120});

chrome.alarms.onAlarm.addListener(function() {
	chrome.storage.sync.get('dados', function(result) {			
		if(result.dados != undefined){
			var qtd_lembrete = result.dados.lembretes.filter(isToday).length
			console.log("Atualizando notificações..");
			/* 
			var options = {
				type: "basic",
				title: "Lembretes",
				message: "Existem " + qtd_lembrete + " lembretes para hoje. Verifique na extensão!",
				iconUrl: "images/get_started128.png"
			  };
			chrome.notifications.create("" + getTIMESTAMP(), options, function(){});
			*/
			notificacoes(qtd_lembrete, result.dados.lembretes.length); 
		}else{
			console.log("Atualizando notificações..sem nada");
		}
	});
});

chrome.runtime.onStartup.addListener(function() {  
  	get_notifications();
});


function get_notifications() {
	chrome.storage.sync.get('dados', function(result) {			
		if(result.dados != undefined){
      		console.log("Atualizando notificações..");
			notificacoes(result.dados.lembretes.filter(isToday).length, result.dados.lembretes.length); 
		}else{
			console.log("Atualizando notificações..sem nada");
		}
	});
}
  
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
	var qtd_vencidos = [qtd % 9, ""].join('') ;	
	if(parseInt(qtd) >= 1){
		chrome.browserAction.setBadgeText({text: qtd_vencidos}, () => { });
	}else{
		chrome.browserAction.setBadgeText({text: ""}, () => { });
	}
}

chrome.storage.onChanged.addListener(function(changes, namespace) {
  console.log('TESTETSETSETTETESTE');
  for (var key in changes) {
    var storageChange = changes[key];
    console.log('Storage key "%s" in namespace "%s" changed. ' +
                'Old value was "%s", new value is "%s".',
                key,
                namespace,
                storageChange.oldValue,
                storageChange.newValue);
  }
});


function calcular_dias_decorridos(data_selecionada) {
    // pega a data de hoje e mostra no campo de texto
    var array_data_selecionada = data_selecionada.split("/");   
    var dia_ini = array_data_selecionada[0];
    var mes_ini = array_data_selecionada[1];
    var ano_ini = array_data_selecionada[2];
  
    var data_atual = new Date();
    var dia_fim = data_atual.getDate();
    var mes_fim = data_atual.getMonth() + 1;
    var ano_fim = data_atual.getFullYear();
    //var agora = new Date([mes-1, "/" , dia, "/" , ano].join(''));        
    
    var data_ini = new Date( [mes_ini, "/", dia_ini, "/", ano_ini].join('') );            
    var data_fim = new Date( [mes_fim, "/", dia_fim, "/", ano_fim].join('') );            
  
    var diferenca = Math.abs(data_fim.getTime() - data_ini.getTime());
    var dias = Math.ceil(diferenca / (1000 * 60 * 60 * 24));
    return dias;
  }
  
  
chrome.contextMenus.onClicked.addListener((result) => {	
	console.log("contextMenus ", result.menuItemId);
	var qtd_dias = undefined;
	if(result.menuItemId == "diff_hoje"){
		var qtd_dias = calcular_dias_decorridos(result.selectionText);
	}
	alert("A diferença de " + result.selectionText + " para hoje = " + qtd_dias + " dias.");
});

  