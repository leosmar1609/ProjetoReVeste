const mysql = require('mysql2');


const connection = mysql.createConnection({
  host: 'localhost',
  user: 'usuario',
  password: 'senha',
  database: 'Beneficiarios'
});

// Conectar ao banco de dados
connection.connect(function(err) {
  if (err) {
    console.error('Erro ao conectar ao banco de dados: ' + err.stack);
    return;
  }
  console.log('Conectado ao banco de dados com ID ' + connection.threadId);
});

// Executando o script SQL
const sql = `
CREATE TABLE IF NOT EXISTS Instituicao_Beneficiaria (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    cnpj VARCHAR(20) NOT NULL,
    location VARCHAR(255),
    history TEXT
);

CREATE TABLE IF NOT EXISTS Pessoa_Beneficiaria (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    cpf VARCHAR(20) NOT NULL,
    history TEXT,
    instituicao_beneficiaria_id INT,
    FOREIGN KEY (instituicao_beneficiaria_id) REFERENCES Instituicao_Beneficiaria(id)
);

CREATE TABLE IF NOT EXISTS Pedidos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name_item VARCHAR(255),
    description TEXT,
    quantity_item INT NOT NULL, 
    category VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'open',
    urgencia_enum ENUM('Baixa', 'Média', 'Alta', 'Urgente') NOT NULL,
    locate VARCHAR(255) NOT NULL,
    opened_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    pessoa_beneficiaria_id INT,
    instituicao_id INT,
    FOREIGN KEY (pessoa_beneficiaria_id) REFERENCES Pessoa_Beneficiaria(id),
    FOREIGN KEY (instituicao_id) REFERENCES Instituicao_Beneficiaria(id),
    CHECK (category IN ('roupas', 'alimentos', 'móveis', 'eletrônicos', 'brinquedos')),
    CHECK (status IN ('open', 'in_progress', 'closed', 'cancelled'))
);
`;

connection.query(sql, function(err, results) {
  if (err) {
    console.log('Erro ao executar a consulta:', err);
  } else {
    console.log('Tabelas criadas com sucesso:', results);
  }
});

// Fecha a conexão
connection.end();