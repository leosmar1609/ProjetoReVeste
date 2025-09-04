document.addEventListener("DOMContentLoaded", () => {
  const url = new URLSearchParams(window.location.search);
  const idPedido = url.get("id") || "***";
  const idDoador = url.get("doadorId") || null; 
  const item = url.get("item") || "";
  const valor = Number(url.get("quant")) || 1;
  const doador = url.get("doador") || "";
  const chavePix = url.get("pix") || "";
  const cidadeParam = url.get("cidade") || "BRASIL";

  const detalhesDiv = document.getElementById("detalhes");
  const qrcodeContainer =
    document.getElementById("qrcode-container") ||
    document.getElementById("qrcode");
  const btnPagar = document.getElementById("btnPagar");
  const statusText = document.getElementById("status");
  const statusQrcode = document.getElementById("status-qrcode");
  const codigoPixTextarea = document.getElementById("codigoPix");

  const asciiUpper = (s, max) =>
    (s || "")
      .toString()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toUpperCase()
      .slice(0, max);

  const recebedorNome = asciiUpper(doador, 25);
  const cidade = asciiUpper(cidadeParam, 15);
  const txid = (idPedido || "***").toString().slice(0, 25);

  class PixBRCode {
    constructor({ key, name, city, txid, amount }) {
      if (!key) throw new Error("Chave PIX obrigatória!");
      this.key = key;
      this.name = name || "";
      this.city = city || "BRASIL";
      this.txid = txid || "***";
      this.amount =
        typeof amount === "number"
          ? amount.toFixed(2)
          : (Number(amount) || 0).toFixed(2);
    }

    _f(id, value) {
      const v = String(value ?? "");
      const len = v.length.toString().padStart(2, "0");
      return `${id}${len}${v}`;
    }

    _crc16(str) {
      let crc = 0xffff;
      for (let i = 0; i < str.length; i++) {
        crc ^= str.charCodeAt(i) << 8;
        for (let j = 0; j < 8; j++) {
          crc = (crc & 0x8000) ? ((crc << 1) ^ 0x1021) : (crc << 1);
          crc &= 0xffff;
        }
      }
      return crc.toString(16).toUpperCase().padStart(4, "0");
    }

    getPayload() {
      const payloadFormatIndicator = "000201";
      const poiMethod = "010211";

      const gui = this._f("00", "br.gov.bcb.pix");
      const key = this._f("01", this.key);
      const mai = this._f("26", gui + key);

      const mcc = "52040000";
      const currency = "5303986";
      const amount = Number(this.amount) > 0 ? this._f("54", this.amount) : "";
      const country = "5802BR";
      const name = this._f("59", this.name || "RECEBEDOR");
      const city = this._f("60", this.city || "BRASIL");

      const addData = this._f("62", this._f("05", this.txid));

      const partial =
        payloadFormatIndicator +
        poiMethod +
        mai +
        mcc +
        currency +
        amount +
        country +
        name +
        city +
        addData +
        "6304";

      const crc = this._crc16(partial);
      return partial + crc;
    }
  }

  if (detalhesDiv) {
    detalhesDiv.innerHTML = `
      <p><strong>Pedido ID:</strong> ${idPedido}</p>
      <p><strong>Item:</strong> ${item}</p>
      <p><strong>Valor (R$):</strong> ${valor.toFixed(2)}</p>
      <p><strong>Recebedor:</strong> ${recebedorNome || "N/A"}</p>
      <p><strong>Chave PIX:</strong> ${chavePix || "N/A"}</p>
      <p><strong>Cidade:</strong> ${cidade}</p>
    `;
  }

  function gerarQRCode() {
    if (!chavePix) {
      if (statusText) {
        statusText.textContent = "Erro: Nenhuma chave PIX encontrada na URL.";
        statusText.classList.add("error-message");
      }
      return;
    }
    if (typeof QRCode === "undefined") {
      if (statusText) {
        statusText.textContent =
          "Erro: biblioteca QRCode.js não encontrada. Inclua o script no HTML.";
        statusText.classList.add("error-message");
      }
      return;
    }

    try {
      if (statusText) {
        statusText.textContent = "Gerando QR Code PIX...";
        statusText.classList.remove("error-message");
      }

      const pix = new PixBRCode({
        key: chavePix,
        name: recebedorNome,
        city: cidade,
        txid: txid,
        amount: valor,
      });

      const payload = pix.getPayload();

      if (codigoPixTextarea) codigoPixTextarea.value = payload;
const copiarBtn = document.getElementById("copiarCodigo");
if (copiarBtn && codigoPixTextarea) {
  copiarBtn.onclick = () => {
    codigoPixTextarea.select();
    document.execCommand("copy");
    if (statusQrcode) statusQrcode.textContent = "Código PIX copiado para a área de transferência!";
  };
}

      if (!qrcodeContainer) {
        throw new Error(
          'Contêiner do QR Code não encontrado (#qrcode-container ou #qrcode).'
        );
      }
      qrcodeContainer.innerHTML = "";
      new QRCode(qrcodeContainer, {
        text: payload,
        width: 200,
        height: 200,
      });

      if (statusQrcode) {
        statusQrcode.textContent =
          "Código PIX gerado. Use o QR Code ou copie o código abaixo para pagar.";
      }
      if (statusText) statusText.textContent = "";
    } catch (err) {
      console.error(err);
      if (statusText) {
        statusText.textContent = `Erro ao gerar QR Code: ${err.message}`;
        statusText.classList.add("error-message");
      }
    }
  }

  if (btnPagar) btnPagar.addEventListener("click", gerarQRCode);

  if (chavePix) gerarQRCode();
});
