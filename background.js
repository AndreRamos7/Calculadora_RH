'use strict';

chrome.runtime.onInstalled.addListener(function() { 
  console.log("iniciado/instalado");  
});
get_notifications();
chrome.runtime.onSuspend.addListener(function() {  
  get_notifications();
});


function get_notifications() {
	chrome.storage.sync.get('dados', function(result) {			
		if(result.dados != undefined){
      console.log("Atualizando notificações..");
			notificacoes(result.dados.lembretes.filter(isToday).length, result.dados.lembretes.length); 
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
