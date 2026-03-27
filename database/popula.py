import mysql.connector
from faker import Faker
import random

fake = Faker("pt_BR")

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

# =============================
# Popular Usuario
# =============================
usuarios = []
for i in range(1, 21):
    usuario = (
        i,
        fake.user_name(),
        fake.unique.email(),
        fake.password(length=10),
        f"avatar{i}.png",
        ",".join(fake.words(3))
    )
    usuarios.append(usuario)

cursor.executemany("""
    INSERT INTO Usuario 
    (User_ID, nomeUsuario, email, senha, avatar, tags)
    VALUES (%s, %s, %s, %s, %s, %s)
""", usuarios)

# =============================
# Popular Categoria
# =============================
categorias = []
for i in range(1, 6):
    categoria = (
        i,
        fake.unique.word().capitalize(),
        fake.sentence(),
        f"categoria{i}.jpg"
    )
    categorias.append(categoria)

cursor.executemany("""
    INSERT INTO Categoria
    (Categoria_ID, nomeCategoria, descricao, imagemCapa)
    VALUES (%s, %s, %s, %s)
""", categorias)

# =============================
# Popular Topico
# =============================
topicos = []
for i in range(1, 16):
    topico = (
        i,
        fake.sentence(nb_words=5),
        fake.text(max_nb_chars=200),
        random.randint(0, 100),
        random.choice(["ativo", "inativo"])
    )
    topicos.append(topico)

cursor.executemany("""
    INSERT INTO Topico
    (Topico_ID, tituloTopico, conteudo, quantidadeLikes, status)
    VALUES (%s, %s, %s, %s, %s)
""", topicos)

# =============================
# Popular Comentario
# =============================
comentarios = []
for i in range(1, 31):
    comentario = (
        i,
        fake.sentence(nb_words=12),
    )
    comentarios.append(comentario)

cursor.executemany("""
    INSERT INTO Comentario
    (Comentario_ID, conteudo)
    VALUES (%s, %s)
""", comentarios)

# =============================
# Popular Administrador
# =============================
admins = []
for admin_id in random.sample(range(1, 21), 3):
    admins.append((admin_id, random.randint(1, 3)))

cursor.executemany("""
    INSERT INTO Administrador
    (Admin_ID, nivelAcesso)
    VALUES (%s, %s)
""", admins)

# =============================
# Popular Denuncia
# =============================
denuncias = []
for i in range(1, 6):
    denuncia = (
        i,
        fake.sentence(),
        random.choice(["pendente", "resolvida", "rejeitada"])
    )
    denuncias.append(denuncia)

cursor.executemany("""
    INSERT INTO Denuncia
    (Denuncia_ID, motivo, status)
    VALUES (%s, %s, %s)
""", denuncias)

# =============================
# Commit e fechamento
# =============================
conn.commit()
cursor.close()
conn.close()

print("Banco populado com sucesso!")