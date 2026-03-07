import pyodbc
import pyperclip

# region Connection Controls

def connection_open():
    driver = '{ODBC Driver 18 for SQL Server}'
    server = 'SERVER_NAME'
    username = 'USER_NAME'
    password = 'A_PASSWORD'
    database = 'A_DATABASE'

    conn_str = f'DRIVER={driver};SERVER={server};DATABASE={database};UID={username};PWD={password};TrustServerCertificate=yes'

    conn = pyodbc.connect(conn_str)
    cursor = conn.cursor()
    return [cursor, conn]

def connection_close(cursor, conn):
    cursor.close()
    conn.close()

# endregion

# region Queries

def query_db_scalar(sql: str):
    connection_data = connection_open()
    cursor = connection_data[0]
    conn = connection_data[1]

    cursor.execute(sql)
    result = cursor.fetchone()[0]

    connection_close(cursor, conn)

    return result

def query_db_list(sql: str):
    connection_data = connection_open()
    cursor = connection_data[0]
    conn = connection_data[1]

    cursor.execute(sql)
    rows = cursor.fetchall()
    results = [row[0] for row in rows]

    connection_close(cursor, conn)

    return results

# endregion

# region Menu Actions

def get_password(account: str):
    sql = f"SELECT TOP 1 Password FROM Passwords WHERE Account = '{account}'"
    return query_db_scalar(sql)

def get_all_accounts():
    sql = f"SELECT Account FROM Passwords"
    accounts = query_db_list(sql)
    return accounts

# endregion

# region Main Loop 

def main_loop():
    user_input = input("What to do? ")

    if user_input == "options":
        print("see accounts | get password | options | exit")
    elif user_input == "get password":
        account_query = input("What account?: ")
        password = get_password(account_query)
        pyperclip.copy(password)
        print("Copied to clipboard!")
    elif user_input == "see accounts":
        accounts = get_all_accounts()
        accounts.sort()
        print("\n")
        for account in accounts:
            print(account)
        print("\n")
    elif user_input == "exit":
        return None
    
    main_loop()

# endregion

# Entry Point

main_loop()

