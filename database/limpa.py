import mysql.connector

# =============================
# Conexão com o banco
# =============================
conn = mysql.connector.connect(
    host="localhost",
    user="root",
    password="SUA_SENHA",
    database="SEU_BANCO"
)

cursor = conn.cursor()

try:
    # =============================
    # Desabilita verificação de FK
    # =============================
    cursor.execute("SET FOREIGN_KEY_CHECKS = 0")

    # =============================
    # Lista de tabelas (ordem não importa agora)
    # =============================
    tabelas = [
        "Denuncia",
        "Administrador",
        "Comentario",
        "Topico",
        "Categoria",
        "Usuario"
    ]

    # =============================
    # Limpa todas as tabelas
    # =============================
    for tabela in tabelas:
        cursor.execute(f"TRUNCATE TABLE {tabela}")

    # =============================
    # Reativa verificação de FK
    # =============================
    cursor.execute("SET FOREIGN_KEY_CHECKS = 1")

    conn.commit()
    print("Banco de dados limpo com sucesso!")

except Exception as erro:
    conn.rollback()
    print("Erro ao limpar o banco:", erro)

finally:
    cursor.close()
    conn.close()