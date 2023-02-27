function analisarDados() {
  let fileInput = document.getElementById("fileInput");
  let file = fileInput.files[0];
  let reader = new FileReader();

  if  (!fileInput || !fileInput.files || fileInput.files.length === 0){
    alert("Selecione um arquivo.");

  } else if (file.type === "application/json" || file.type === "text/json" || file.type === "application/xml" || file.type === "text/xml") {
    reader.readAsText(file);

  } else {

  alert("Tipo de arquivo inválido. Selecione um arquivo JSON ou XML.");
    }

  reader.onload = function() {
    let data = reader.result;
    let fatDiario = parseData(data);
    let diasUteis = fatDiario.filter(valor => valor !== 0);
    let menorValor = Math.min(...diasUteis);
    let maiorValor = Math.max(...diasUteis);
    let mediaMensal = diasUteis.reduce((acc, val) => acc + val) / diasUteis.length;
    let diasAcimaMedia = diasUteis.filter(valor => valor > mediaMensal).length;
    let outputMinValue = `Menor valor de faturamento diário: ${menorValor}`;
    let outputMaxValue = `Maior valor de faturamento diário: ${maiorValor}`;
    let outputDays = `Número de dias com faturamento acima da média mensal: ${diasAcimaMedia}`;
    document.getElementById("outputMinValue").textContent = outputMinValue;
    document.getElementById("outputMaxValue").textContent = outputMaxValue;
    document.getElementById("outputDays").textContent = outputDays;

  };
}

function parseData(data) {
  let fatDiario = [];
  let file = fileInput.files[0];

  if (file.type === "application/xml" || file.type === "text/xml") {
    try {
      let parser = new DOMParser();
      let xmlDoc = parser.parseFromString(`<root>${data}</root>`, "text/xml");
      
      let linhas = xmlDoc.getElementsByTagName("valor");
      for (let i = 0; i < linhas.length; i++) {
        fatDiario.push(parseFloat(linhas[i].textContent));
      }

    } catch (error) {
      console.error("Erro ao ler o arquivo XML: " + error);
    }

  } else {
    try{
      let jsonData = JSON.parse(data);
      
      for (let i = 0; i < jsonData.length; i++) {
        fatDiario.push(jsonData[i].valor);
      }
      
    } catch (error) {
      console.error("Erro ao ler o arquivo JSON: " + error)
    }
  }
  return fatDiario;
}
