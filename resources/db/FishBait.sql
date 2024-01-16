-- CREAZIONE DELLA STRUTTURA DEL DATABASE

CREATE DATABASE IF NOT EXISTS fishbait;

CREATE USER 'secureUser'@'localhost' IDENTIFIED BY 'SeCuRePaSsWoRd123456?!%';
GRANT SELECT, INSERT, UPDATE, DELETE ON `fishbait`.* TO 'secureUser'@'localhost';

CREATE TABLE utenti(
    Email VARCHAR(50) NOT NULL PRIMARY KEY,
    Pwd CHAR(128) NOT NULL,
    Salt CHAR(128) NOT NULL,
    Username VARCHAR(30) NOT NULL,
    Nome VARCHAR(50),
    Cognome VARCHAR(50),
    FotoProfilo VARCHAR(255),
    DataNascita DATE,
    Descrizione TEXT
);

CREATE TABLE post(
    ID INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    EmailUtente VARCHAR(50) NOT NULL,
    Foto VARCHAR(255),
    DataPubblicazione DATETIME NOT NULL,
    Luogo VARCHAR(30),
    Descrizione VARCHAR(50),
    FOREIGN KEY (EmailUtente) REFERENCES utenti(Email)
);

CREATE TABLE commenti(
    ID INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    IDPost INT NOT NULL,
    EmailUtente VARCHAR(50) NOT NULL,
    Contenuto VARCHAR(100) NOT NULL,
    DataPubblicazione DATE NOT NULL,
    FOREIGN KEY (IDPost) REFERENCES post(IDPost),
    FOREIGN KEY (EmailUtente) REFERENCES utenti(Email)
);

CREATE TABLE follow(
    EmailUtente VARCHAR(50) NOT NULL,
    EmailUtenteSeguito VARCHAR(50) NOT NULL,
    PRIMARY KEY (EmailUtente, EmailUtenteSeguito)
);

CREATE TABLE notifiche(
    IDNotifica INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    EmailRicevente VARCHAR(50) NOT NULL,
    EmailRiferimento VARCHAR(50) NOT NULL,
    IDPost INT,
    DataRicevimento DATE,
    Descrizione VARCHAR(50),
    Visualizzato TINYINT(1) DEFAULT FALSE,
    FOREIGN KEY (EmailRicevente) REFERENCES utenti(Email),
    FOREIGN KEY (EmailRiferimento) REFERENCES utenti(Email),
    FOREIGN KEY (IDPost) REFERENCES post(ID)
);

CREATE TABLE like(
    EmailUtente VARCHAR(50) NOT NULL,
    IDPost INT NOT NULL,
    PRIMARY KEY (EmailUtente, IDPost)
    FOREIGN KEY (EmailUtente) REFERENCES utenti(Email),
    FOREIGN KEY (IDPost) REFERENCES post (ID)
);

CREATE TABLE tentativi_login(
    EmailUtente VARCHAR(50) NOT NULL,
    DataOra VARCHAR(30) NOT NULL
);

-- INSERIMENTO DI VALORI NEL DATABASE

INSERT INTO utenti(Email, Pwd, Salt, Username, Nome, Cognome, FotoProfilo, Descrizione)
VALUES ("mario.rossi@gmail.com", )