import datetime
from app import app
from flask import jsonify, render_template
import mysql.connector
from decouple import config
import pandas as pd
import locale
import warnings
import numpy as np

warnings.filterwarnings('ignore')
locale.setlocale(locale.LC_ALL, 'pt_BR.UTF-8')

sql = """
select 
   os_id,
   codpro_id,
   grupo,
   vcv.valor_unitpro,
   vv.create_at,
   hour_at,
   first_name
from vendas_corpo_venda vcv
inner join produtos_produto pp
   on pp.codigo = vcv.codpro_id
inner join vendas_venda vv
   on vcv.os_id = vv.ordem
inner join vendas_formapagamento vf
	on vf.key_id = vv.ordem
inner join users_user uu
   on uu.id = vv.vendedor_id
where vv.status = 'f' and vf.forma <> 'FO'

"""

sql2 = """
select 
	codpro_id,
	grupo,
	descricao,
	vcv.valor_unitsis,
	vcv.valor_unitpro
from vendas_corpo_venda vcv
inner join produtos_produto pp
	on pp.codigo = vcv.codpro_id
inner join vendas_venda vv
	on vcv.os_id = vv.ordem
inner join vendas_formapagamento vf
	on vf.key_id = vv.ordem
where vv.status = 'f' and vf.forma <> "FO"

"""
# and create_at < 20221018

def Connect():
  conn = mysql.connector.connect(
    host=config("MSSQL_HOST"),
    user=config("MSSQL_USER"),
    database=config("MSSQL_DATABASE"),
    passwd = config("MSSQL_PASS")
    )
  return conn

def produto():
   df = pd.read_sql(sql2,Connect())
   df= df.groupby(['codpro_id', 'descricao']).apply(lambda x: x.assign(num_ocorrencias=len(x))).reset_index(drop=True)
   df = df.drop_duplicates(subset=['codpro_id'])
   df['valor_total'] = df['valor_unitpro'] * df['num_ocorrencias']
   df['tipo'] = df['descricao'].str.slice(0,2)
   
   return df

def Base_dados():
  df = pd.read_sql(sql,Connect())
  df["Numero Semana"] = pd.to_datetime(df['create_at']).dt.isocalendar().week
  df["Dia semana"] = pd.to_datetime(df['create_at']).dt.strftime('%A')
  return df

def data_atual(df):
    df = df.copy()
    df['create_at'] = pd.to_datetime(df['create_at'])
    df.drop(['hour_at'], axis=1, inplace=True)  
    df = df[df['create_at'] == df['create_at'].max()] 
    return df

@app.route ("/grafico_protunit")
def obter_dados():
    df = Base_dados()
    dfvu = df.groupby('valor_unitpro').count().reset_index()
    dfvu = dfvu.loc[:, ['valor_unitpro', 'os_id']]
    dfvu = dfvu.rename(columns={'os_id': 'quantidade'})
    dfvu = dfvu.sort_values('quantidade', ascending=False)
    dfvu['ranking'] = range(1, len(dfvu) + 1)
    dfvu.loc[dfvu['ranking'] > 10, 'legenda'] = 'outros'
    top_10 = dfvu[dfvu['ranking'] <= 10]
    outros = dfvu[dfvu['legenda'] == 'outros']
    dfvu = pd.concat([top_10, outros.groupby('legenda').sum()]).reset_index(drop=True)
    dfvu= dfvu.drop('legenda',axis=1)
    dfvu.at[10, 'valor_unitpro'] = 'Outros'

    return jsonify(dfvu.to_dict(orient='records'))

@app.route("/tabela_produtos")
def dados_produtos():
   df = produto()
   return jsonify(df.to_dict(orient='records'))

@app.route ("/tabela_dias")
def consulta_tabela_dias():
   df = Base_dados()
   df['hour_at'] = df['hour_at'].astype('timedelta64[s]')
   df ['horas'] = df['hour_at'].dt.components['hours']
   faixas = [ 9, 11, 13 , 15, 17, 19, 21, 23, 25]
   labels = ['09h~12h', '12h~14h', '14h~16h', '16h~18h', '18h~20h', '20h~22h','22h~24h','24h~00h']
   df['faixas'] = pd.cut(df['horas'], bins=faixas, labels=labels)
   df = df.drop(['hour_at','Numero Semana', 'create_at','horas'], axis=1)
   df = df.rename({'Dia semana': 'Dia_semana'}, axis = 1)
   df['first_occurrence'] = df.groupby('os_id').cumcount() == 0
   df['first_occurrence'] = df['first_occurrence'].astype(int)
   df['qtd_peça'] = 1
   return jsonify(df.to_dict(orient='records'))

@app.route ("/vendedor")
def vendedor():
   return render_template('vendedor.html')

@app.route ("/produtos")
def produtos():
   return render_template('produtos.html')

@app.route ("/")
def index():
    df = Base_dados()

    #dados do dia
    dfa = data_atual(df)
    Total_vendido_ultimodia = dfa['valor_unitpro'].sum()
    Total_vendido_ultimodia_formatado = locale.currency(Total_vendido_ultimodia, grouping=True, symbol=None)

    Quantidade_venda_ultimodia = dfa['os_id'].nunique()

    Quantidade_produto_ultimodia = dfa['codpro_id'].count()

    TKM_ultimodia = Total_vendido_ultimodia/Quantidade_venda_ultimodia
    TKM_ultimodia_formatado = locale.currency(TKM_ultimodia, grouping=True, symbol=None)

    #total
    Total_vendido = df['valor_unitpro'].sum()
    Total_vendido_formatado = locale.currency(Total_vendido, grouping=True, symbol=None)

    Quantidade_venda = df['os_id'].nunique()

    Quantidade_produto = df['codpro_id'].count()

    TKM = Total_vendido/Quantidade_venda
    TKM_formatado = locale.currency(TKM, grouping=True, symbol=None)


    return render_template('index.html',
                          Total_vendido_ultimodia_formatado = Total_vendido_ultimodia_formatado,
                          Quantidade_venda_ultimodia = Quantidade_venda_ultimodia,
                          Quantidade_produto_ultimodia = Quantidade_produto_ultimodia,
                          TKM_ultimodia_formatado = TKM_ultimodia_formatado,
                          Total_vendido_formatado = Total_vendido_formatado,
                          Quantidade_venda = Quantidade_venda,
                          Quantidade_produto = Quantidade_produto,
                          TKM_formatado = TKM_formatado,
                          )

