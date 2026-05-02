import mysql.connector
from mysql.connector import Error

def create_connection():
    try:
        connection = mysql.connector.connect(
            host='localhost',
            database='DigitalLibraryDB',
            user='root',
            password='root'
        )
        return connection
    except Error as e:
        print(f"Error connecting to MySQL database: {e}")
        return None

def add_book(title, genre, price, stock, location):
    conn = create_connection()
    if conn:
        try:
            cursor = conn.cursor()
            query = "INSERT INTO Books (title, genre, price, stock_level, location) VALUES (%s, %s, %s, %s, %s)"
            cursor.execute(query, (title, genre, price, stock, location))
            conn.commit()
            print(f"Successfully added book: {title}")
        except Error as e:
            print(f"Error adding book: {e}")
        finally:
            cursor.close()
            conn.close()

def update_book_stock(book_id, new_stock):
    conn = create_connection()
    if conn:
        try:
            cursor = conn.cursor()
            query = "UPDATE Books SET stock_level = %s WHERE book_id = %s"
            cursor.execute(query, (new_stock, book_id))
            conn.commit()
            print(f"Stock updated for book ID {book_id}.")
        except Error as e:
            print(f"Error updating stock: {e}")
        finally:
            cursor.close()
            conn.close()

def delete_book(book_id):
    conn = create_connection()
    if conn:
        try:
            cursor = conn.cursor()
            query = "DELETE FROM Books WHERE book_id = %s"
            cursor.execute(query, (book_id,))
            conn.commit()
            if cursor.rowcount > 0:
                print(f"Successfully deleted book ID {book_id}.")
            else:
                print(f"No book found with ID {book_id}.")
        except Error as e:
            print(f"Error deleting book: {e}")
        finally:
            cursor.close()
            conn.close()

def view_all_books():
    conn = create_connection()
    if conn:
        try:
            cursor = conn.cursor(dictionary=True)
            query = "SELECT * FROM Books"
            cursor.execute(query)
            results = cursor.fetchall()
            if not results:
                print("No books found in the library.")
                return
            print("\nAll Books:")
            for row in results:
                print(f"ID: {row['book_id']}, Title: {row['title']}, Genre: {row['genre']}, "
                      f"Price: ${row['price']}, Stock: {row['stock_level']}, Location: {row['location']}")
            print("")
        except Error as e:
            print(f"Error viewing books: {e}")
        finally:
            cursor.close()
            conn.close()

def search_book(search_term, by='title'):
    conn = create_connection()
    if conn:
        try:
            cursor = conn.cursor(dictionary=True)
            if by == 'title':
                query = "SELECT * FROM Books WHERE title LIKE %s"
                cursor.execute(query, ('%' + search_term + '%',))
            elif by == 'genre':
                query = "SELECT * FROM Books WHERE genre LIKE %s"
                cursor.execute(query, ('%' + search_term + '%',))
            elif by == 'author':
                query = """
                    SELECT b.* FROM Books b
                    JOIN BookAuthors ba ON b.book_id = ba.book_id
                    JOIN Authors a ON ba.author_id = a.author_id
                    WHERE a.name LIKE %s
                """
                cursor.execute(query, ('%' + search_term + '%',))
            
            results = cursor.fetchall()
            if not results:
                print(f"No books found for '{search_term}'.")
                return
            print(f"\nSearch Results for '{search_term}':")
            for row in results:
                 print(f"ID: {row['book_id']}, Title: {row['title']}, Stock: {row['stock_level']}")
            print("")
        except Error as e:
            print(f"Error searching books: {e}")
        finally:
            cursor.close()
            conn.close()

# --- Author Management ---
def add_author(name, bio, contact):
    conn = create_connection()
    if conn:
        try:
            cursor = conn.cursor()
            query = "INSERT INTO Authors (name, bio, contact_info) VALUES (%s, %s, %s)"
            cursor.execute(query, (name, bio, contact))
            conn.commit()
            print(f"Successfully added author: {name}")
        except Error as e:
            print(f"Error adding author: {e}")
        finally:
            cursor.close()
            conn.close()

def update_author_info(author_id, name, bio, contact):
    conn = create_connection()
    if conn:
        try:
            cursor = conn.cursor()
            query = "UPDATE Authors SET name = %s, bio = %s, contact_info = %s WHERE author_id = %s"
            cursor.execute(query, (name, bio, contact, author_id))
            conn.commit()
            print(f"Successfully updated author ID: {author_id}")
        except Error as e:
            print(f"Error updating author: {e}")
        finally:
            cursor.close()
            conn.close()

def view_all_authors():
    conn = create_connection()
    if conn:
        try:
            cursor = conn.cursor(dictionary=True)
            query = "SELECT * FROM Authors"
            cursor.execute(query)
            results = cursor.fetchall()
            if not results:
                print("No authors found.")
                return
            print("\nAll Authors:")
            for row in results:
                print(f"ID: {row['author_id']}, Name: {row['name']}, Contact: {row['contact_info']}")
            print("")
        except Error as e:
            print(f"Error viewing authors: {e}")
        finally:
            cursor.close()
            conn.close()

def assign_book_to_author(book_id, author_id):
    conn = create_connection()
    if conn:
        try:
            cursor = conn.cursor()
            query = "INSERT INTO BookAuthors (book_id, author_id) VALUES (%s, %s)"
            cursor.execute(query, (book_id, author_id))
            conn.commit()
            print(f"Successfully assigned book {book_id} to author {author_id}")
        except Error as e:
            print(f"Error assigning book: {e}")
        finally:
            cursor.close()
            conn.close()

# --- Customer Management ---
def register_customer(name, email, phone):
    conn = create_connection()
    if conn:
        try:
            cursor = conn.cursor()
            query = "INSERT INTO Customers (name, email, phone) VALUES (%s, %s, %s)"
            cursor.execute(query, (name, email, phone))
            conn.commit()
            print(f"Successfully registered customer: {name}")
        except Error as e:
            print(f"Error registering customer: {e}")
        finally:
            cursor.close()
            conn.close()

def view_customer_purchase_history(customer_id):
    conn = create_connection()
    if conn:
        try:
            cursor = conn.cursor(dictionary=True)
            query = """
                SELECT o.order_id, o.order_date, o.status, b.title, od.quantity, od.price_at_purchase
                FROM Orders o
                JOIN OrderDetails od ON o.order_id = od.order_id
                JOIN Books b ON od.book_id = b.book_id
                WHERE o.customer_id = %s
            """
            cursor.execute(query, (customer_id,))
            results = cursor.fetchall()
            if not results:
                print(f"No purchase history found for customer ID {customer_id}.")
                return
            print(f"\nPurchase History for Customer ID {customer_id}:")
            for row in results:
                print(f"Order ID: {row['order_id']}, Date: {row['order_date']}, Status: {row['status']}, "
                      f"Book: {row['title']}, Qty: {row['quantity']}, Price: ${row['price_at_purchase']}")
            print("")
        except Error as e:
            print(f"Error viewing purchase history: {e}")
        finally:
            cursor.close()
            conn.close()
            
def view_all_customers():
    conn = create_connection()
    if conn:
        try:
            cursor = conn.cursor(dictionary=True)
            query = "SELECT * FROM Customers"
            cursor.execute(query)
            results = cursor.fetchall()
            if not results:
                print("No customers found.")
                return
            print("\nAll Customers:")
            for row in results:
                print(f"ID: {row['customer_id']}, Name: {row['name']}, Email: {row['email']}, Phone: {row['phone']}")
            print("")
        except Error as e:
            print(f"Error viewing customers: {e}")
        finally:
            cursor.close()
            conn.close()

def create_order(customer_id, book_list):
    conn = create_connection()
    if not conn:
        return
    
    try:
        cursor = conn.cursor(dictionary=True)
        conn.start_transaction()
        
        order_query = "INSERT INTO Orders (customer_id, status) VALUES (%s, 'Pending')"
        cursor.execute(order_query, (customer_id,))
        order_id = cursor.lastrowid
        print(f"Created order {order_id}.")

        for book_id, quantity in book_list.items():

            cursor.execute("SELECT price, stock_level FROM Books WHERE book_id = %s", (book_id,))
            book_data = cursor.fetchone()
            if not book_data:
                raise Exception(f"Book ID {book_id} not found.")
            
            if book_data['stock_level'] < quantity:
                raise Exception(f"Not enough stock for Book ID {book_id}. "
                                f"Requested: {quantity}, Available: {book_data['stock_level']}")
            
            price = book_data['price']
            detail_query = "INSERT INTO OrderDetails (order_id, book_id, quantity, price_at_purchase) VALUES (%s, %s, %s, %s)"
            cursor.execute(detail_query, (order_id, book_id, quantity, price))
            
            new_stock = book_data['stock_level'] - quantity
            stock_query = "UPDATE Books SET stock_level = %s WHERE book_id = %s"
            cursor.execute(stock_query, (new_stock, book_id))

        conn.commit()
        print(f"Successfully created order {order_id} for customer {customer_id}.")
    except Exception as e:
        conn.rollback()
        print(f"Error creating order: {e}. Transaction rolled back.")
    finally:
        cursor.close()
        conn.close()

def record_payment(order_id, amount, method):
    conn = create_connection()
    if not conn:
        return
        
    try:
        cursor = conn.cursor()
        conn.start_transaction()
        
        payment_query = "INSERT INTO Payments (order_id, amount, payment_method) VALUES (%s, %s, %s)"
        cursor.execute(payment_query, (order_id, amount, method))
        
        status_query = "UPDATE Orders SET status = 'Paid' WHERE order_id = %s"
        cursor.execute(status_query, (order_id,))
        
        conn.commit()
        print(f"Successfully recorded payment for order {order_id}.")
    except Error as e:
        conn.rollback()
        print(f"Error recording payment: {e}")
    finally:
        cursor.close()
        conn.close()

def view_all_orders(by_status=''):
    conn = create_connection()
    if conn:
        try:
            cursor = conn.cursor(dictionary=True)
            if by_status:
                query = "SELECT o.*, c.name FROM Orders o JOIN Customers c ON o.customer_id = c.customer_id WHERE o.status = %s"
                cursor.execute(query, (by_status,))
            else:
                query = "SELECT o.*, c.name FROM Orders o JOIN Customers c ON o.customer_id = c.customer_id"
                cursor.execute(query)
                
            results = cursor.fetchall()
            if not results:
                print("No orders found.")
                return
            print("\nAll Orders:")
            for row in results:
                print(f"ID: {row['order_id']}, Customer: {row['name']}, Date: {row['order_date']}, Status: {row['status']}")
            print("")
        except Error as e:
            print(f"Error viewing orders: {e}")
        finally:
            cursor.close()
            conn.close()

def generate_low_stock_report(threshold=5):
    conn = create_connection()
    if conn:
        try:
            cursor = conn.cursor(dictionary=True)
            query = "SELECT book_id, title, stock_level FROM Books WHERE stock_level <= %s"
            cursor.execute(query, (threshold,))
            results = cursor.fetchall()
            if not results:
                print(f"No books at or below stock level {threshold}.")
                return
            print(f"\nLow Stock Report (Threshold: {threshold}):")
            for row in results:
                print(f"ID: {row['book_id']}, Title: {row['title']}, Stock: {row['stock_level']}")
            print("")
        except Error as e:
            print(f"Error generating report: {e}")
        finally:
            cursor.close()
            conn.close()

def add_supplier(name, contact, phone):
    conn = create_connection()
    if conn:
        try:
            cursor = conn.cursor()
            query = "INSERT INTO Suppliers (name, contact_person, phone) VALUES (%s, %s, %s)"
            cursor.execute(query, (name, contact, phone))
            conn.commit()
            print(f"Successfully added supplier: {name}")
        except Error as e:
            print(f"Error adding supplier: {e}")
        finally:
            cursor.close()
            conn.close()

def view_all_suppliers():
    conn = create_connection()
    if conn:
        try:
            cursor = conn.cursor(dictionary=True)
            query = "SELECT * FROM Suppliers"
            cursor.execute(query)
            results = cursor.fetchall()
            if not results:
                print("No suppliers found.")
                return
            print("\nAll Suppliers:")
            for row in results:
                print(f"ID: {row['supplier_id']}, Name: {row['name']}, Contact: {row['contact_person']}, Phone: {row['phone']}")
            print("")
        except Error as e:
            print(f"Error viewing suppliers: {e}")
        finally:
            cursor.close()
            conn.close()

def assign_book_to_supplier(book_id, supplier_id):
    conn = create_connection()
    if conn:
        try:
            cursor = conn.cursor()
            query = "INSERT INTO BookSuppliers (book_id, supplier_id) VALUES (%s, %s)"
            cursor.execute(query, (book_id, supplier_id))
            conn.commit()
            print(f"Successfully assigned book {book_id} to supplier {supplier_id}")
        except Error as e:
            print(f"Error assigning book to supplier: {e}")
        finally:
            cursor.close()
            conn.close()

def list_books_by_supplier(supplier_id):
    conn = create_connection()
    if conn:
        try:
            cursor = conn.cursor(dictionary=True)
            query = """
                SELECT b.book_id, b.title, b.stock_level FROM Books b
                JOIN BookSuppliers bs ON b.book_id = bs.book_id
                WHERE bs.supplier_id = %s
            """
            cursor.execute(query, (supplier_id,))
            results = cursor.fetchall()
            if not results:
                print(f"No books found for supplier ID {supplier_id}.")
                return
            print(f"\nBooks from Supplier ID {supplier_id}:")
            for row in results:
                print(f"ID: {row['book_id']}, Title: {row['title']}, Stock: {row['stock_level']}")
            print("")
        except Error as e:
            print(f"Error getting books by supplier: {e}")
        finally:
            cursor.close()
            conn.close()

