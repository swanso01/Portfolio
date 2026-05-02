import db_manager as db

def manage_books_menu():
    while True:
        print("\nManage Books")
        print("1. Add a new book")
        print("2. Update book stock")
        print("3. Delete a book")
        print("4. View all books")
        print("5. Search book by title")
        print("6. Search book by genre")
        print("7. Search book by author")
        print("0. Back to Main Menu")
        
        choice = input("Enter your choice: ")
        try:
            if choice == '1':
                title = input("Enter title: ")
                genre = input("Enter genre: ")
                price = float(input("Enter price: "))
                stock = int(input("Enter stock level: "))
                location = input("Enter location (e.g., Aisle 5): ")
                db.add_book(title, genre, price, stock, location)
            elif choice == '2':
                book_id = int(input("Enter book ID to update stock: "))
                new_stock = int(input("Enter new stock level: "))
                db.update_book_stock(book_id, new_stock)
            elif choice == '3':
                book_id = int(input("Enter book ID to delete: "))
                db.delete_book(book_id)
            elif choice == '4':
                db.view_all_books()
            elif choice == '5':
                title = input("Enter title to search for: ")
                db.search_book(title, by='title')
            elif choice == '6':
                genre = input("Enter genre to search for: ")
                db.search_book(genre, by='genre')
            elif choice == '7':
                author = input("Enter author name to search for: ")
                db.search_book(author, by='author')
            elif choice == '0':
                break
            else:
                print("Invalid choice. Please try again.")
        except ValueError:
            print("Invalid input. Please enter numbers where required.")
        except Exception as e:
            print(f"An unexpected error occurred: {e}")

def manage_authors_menu():
    while True:
        print("\nManage Authors")
        print("1. Add new author")
        print("2. Update author info")
        print("3. View all authors")
        print("4. Assign book to author")
        print("0. Back to Main Menu")
        
        choice = input("Enter your choice: ")
        try:
            if choice == '1':
                name = input("Enter author name: ")
                bio = input("Enter bio: ")
                contact = input("Enter contact info: ")
                db.add_author(name, bio, contact)
            elif choice == '2':
                author_id = int(input("Enter author ID to update: "))
                name = input("Enter new name: ")
                bio = input("Enter new bio: ")
                contact = input("Enter new contact info: ")
                db.update_author_info(author_id, name, bio, contact)
            elif choice == '3':
                db.view_all_authors()
            elif choice == '4':
                book_id = int(input("Enter book ID: "))
                author_id = int(input("Enter author ID: "))
                db.assign_book_to_author(book_id, author_id)
            elif choice == '0':
                break
            else:
                print("Invalid choice.")
        except ValueError:
            print("Invalid input. Please enter numbers where required.")
        except Exception as e:
            print(f"An unexpected error occurred: {e}")

def manage_customers_menu():
    while True:
        print("\nManage Customers")
        print("1. Register new customer")
        print("2. View all customers")
        print("3. View customer purchase history")
        print("0. Back to Main Menu")
        
        choice = input("Enter your choice: ")
        try:
            if choice == '1':
                name = input("Enter customer name: ")
                email = input("Enter email: ")
                phone = input("Enter phone: ")
                db.register_customer(name, email, phone)
            elif choice == '2':
                db.view_all_customers()
            elif choice == '3':
                customer_id = int(input("Enter customer ID: "))
                db.view_customer_purchase_history(customer_id)
            elif choice == '0':
                break
            else:
                print("Invalid choice.")
        except ValueError:
            print("Invalid input. Please enter numbers where required.")
        except Exception as e:
            print(f"An unexpected error occurred: {e}")

def manage_orders_menu():
    while True:
        print("\nCreate/View Orders")
        print("1. Create new order")
        print("2. View all orders")
        print("3. View pending orders")
        print("0. Back to Main Menu")
        
        choice = input("Enter your choice: ")
        try:
            if choice == '1':
                customer_id = int(input("Enter customer ID: "))
                book_list = {}
                while True:
                    book_id_str = input("Enter book ID to add (or 'done' to finish): ")
                    if book_id_str.lower() == 'done':
                        break
                    book_id = int(book_id_str)
                    quantity = int(input(f"Enter quantity for book {book_id}: "))
                    book_list[book_id] = quantity
                if book_list:
                    db.create_order(customer_id, book_list)
                else:
                    print("No books added to order.")
            elif choice == '2':
                db.view_all_orders()
            elif choice == '3':
                db.view_all_orders(by_status='Pending')
            elif choice == '0':
                break
            else:
                print("Invalid choice.")
        except ValueError:
            print("Invalid input. Please enter numbers where required.")
        except Exception as e:
            print(f"An unexpected error occurred: {e}")

def record_payments_menu():
    while True:
        print("\nRecord Payments")
        print("1. Record a new payment")
        print("0. Back to Main Menu")
        
        choice = input("Enter your choice: ")
        try:
            if choice == '1':
                order_id = int(input("Enter order ID for payment: "))
                amount = float(input("Enter payment amount: "))
                method = input("Enter payment method (e.g., Credit Card): ")
                db.record_payment(order_id, amount, method)
            elif choice == '0':
                break
            else:
                print("Invalid choice.")
        except ValueError:
            print("Invalid input. Please enter numbers where required.")
        except Exception as e:
            print(f"An unexpected error occurred: {e}")

def view_inventory_menu():
    while True:
        print("\nView Inventory")
        print("1. View all book inventory details")
        print("2. Generate low stock report")
        print("0. Back to Main Menu")
        
        choice = input("Enter your choice: ")
        try:
            if choice == '1':
                db.view_all_books()
            elif choice == '2':
                threshold = input("Enter low stock threshold (default 5): ")
                if not threshold:
                    db.generate_low_stock_report()
                else:
                    db.generate_low_stock_report(int(threshold))
            elif choice == '0':
                break
            else:
                print("Invalid choice.")
        except ValueError:
            print("Invalid input. Please enter numbers where required.")
        except Exception as e:
            print(f"An unexpected error occurred: {e}")

def manage_suppliers_menu():
    while True:
        print("\nManage Suppliers")
        print("1. Add new supplier")
        print("2. View all suppliers")
        print("3. Assign book to supplier")
        print("4. List books from a specific supplier")
        print("0. Back to Main Menu")
        
        choice = input("Enter your choice: ")
        try:
            if choice == '1':
                name = input("Enter supplier name: ")
                contact = input("Enter contact person: ")
                phone = input("Enter phone: ")
                db.add_supplier(name, contact, phone)
            elif choice == '2':
                db.view_all_suppliers()
            elif choice == '3':
                book_id = int(input("Enter book ID: "))
                supplier_id = int(input("Enter supplier ID: "))
                db.assign_book_to_supplier(book_id, supplier_id)
            elif choice == '4':
                supplier_id = int(input("Enter supplier ID: "))
                db.list_books_by_supplier(supplier_id)
            elif choice == '0':
                break
            else:
                print("Invalid choice.")
        except ValueError:
            print("Invalid input. Please enter numbers where required.")
        except Exception as e:
            print(f"An unexpected error occurred: {e}")


def main_menu():
    while True:
        print("\nWelcome to the Digital Library!")
        print("1. Manage Books")
        print("2. Manage Authors")
        print("3. Manage Customers")
        print("4. Create/View Orders")
        print("5. Record Payments")
        print("6. View Inventory")
        print("7. Manage Suppliers")
        print("0. Exit")
        
        choice = input("Enter your choice: ")
        
        if choice == '1':
            manage_books_menu()
        elif choice == '2':
            manage_authors_menu()
        elif choice == '3':
            manage_customers_menu()
        elif choice == '4':
            manage_orders_menu()
        elif choice == '5':
            record_payments_menu()
        elif choice == '6':
            view_inventory_menu()
        elif choice == '7':
            manage_suppliers_menu()
        elif choice == '0':
            print("Thank you for using the Digital Library. Goodbye!")
            break
        else:
            print("Invalid choice. Please enter a number from 0-7.")

if __name__ == "__main__":
    main_menu()

