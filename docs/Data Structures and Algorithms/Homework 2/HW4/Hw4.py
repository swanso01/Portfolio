## Task 1: Priority Queue (Sorted Linked List)

class PriorityQueue:
    class _Node:
        def __init__(self, key, value, next_node):
            self.key = key
            self.value = value
            self.next = next_node

    def __init__(self):
        self.head = None

    def is_empty(self):
        return self.head is None

    def insert(self, key, value):
        new_node = self._Node(key, value, None)
        if self.is_empty() or key < self.head.key:
            new_node.next = self.head
            self.head = new_node
        else:
            current = self.head
            while current.next is not None and current.next.key <= key:
                current = current.next
            new_node.next = current.next
            current.next = new_node

    def remove_min(self):
        if self.is_empty():
            raise Exception("Priority queue is empty")
        item = self.head.value
        self.head = self.head.next
        return item

    def __str__(self):
        items = []
        current = self.head
        while current:
            items.append(f"({current.key}: {current.value})")
            current = current.next
        return " -> ".join(items)

## Task 2: Deque

class Deque:
    class _DNode:
        def __init__(self, value, prev_node, next_node):
            self.value = value
            self.prev = prev_node
            self.next = next_node

    def __init__(self):
        self.head = None
        self.tail = None
        self.size = 0

    def is_empty(self):
        return self.size == 0

    def insert_front(self, value):
        new_node = self._DNode(value, None, self.head)
        if self.is_empty():
            self.head = self.tail = new_node
        else:
            self.head.prev = new_node
            self.head = new_node
        self.size += 1

    def insert_rear(self, value):
        new_node = self._DNode(value, self.tail, None)
        if self.is_empty():
            self.head = self.tail = new_node
        else:
            self.tail.next = new_node
            self.tail = new_node
        self.size += 1

    def remove_front(self):
        if self.is_empty():
            raise Exception("Deque is empty")
        value = self.head.value
        if self.size == 1:
            self.head = self.tail = None
        else:
            self.head = self.head.next
            self.head.prev = None
        self.size -= 1
        return value

    def remove_rear(self):
        if self.is_empty():
            raise Exception("Deque is empty")
        value = self.tail.value
        if self.size == 1:
            self.head = self.tail = None
        else:
            self.tail = self.tail.prev
            self.tail.next = None
        self.size -= 1
        return value

    def __str__(self):
        items = []
        current = self.head
        while current:
            items.append(str(current.value))
            current = current.next
        return " <-> ".join(items)

## Task 3: Circular List

class CircularList:
    class _CNode:
        def __init__(self, value, next_node):
            self.value = value
            self.next = next_node

    def __init__(self):
        self.current = None

    def is_empty(self):
        return self.current is None

    def step(self):
        if not self.is_empty():
            self.current = self.current.next

    def insert(self, value):
        new_node = self._CNode(value, None)
        if self.is_empty():
            self.current = new_node
            new_node.next = self.current
        else:
            new_node.next = self.current.next
            self.current.next = new_node

    def find(self, value):
        if self.is_empty():
            return False

        temp = self.current.next
        while True:
            if temp.value == value:
                return True
            if temp == self.current:
                return False
            temp = temp.next

    def delete_next(self):
        if self.is_empty():
            raise Exception("List is empty")

        node_to_delete = self.current.next
        value = node_to_delete.value
        
        if self.current == self.current.next: # Only one node
            self.current = None
        else:
            self.current.next = node_to_delete.next
        
        return value

    def display(self):
        if self.is_empty():
            print("[Empty]")
            return

        items = []
        start = self.current
        temp = self.current

        while True:
            items.append(str(temp.value))
            temp = temp.next
            if temp == start:
                break
        print(f"Current: {self.current.value} | List: " + " -> ".join(items) + " -> (back to start)")

## Task 4: Stack (based on Circular List)

class CircularStack:
    def __init__(self):
        self.list = CircularList()

    def is_empty(self):
        return self.list.is_empty()

    def push(self, value):
        # Inserts *after* current.
        self.list.insert(value)

    def pop(self):
        # Deletes the node *after* current.
        return self.list.delete_next()

    def peek(self):
        if self.is_empty():
            raise Exception("Stack is empty")
        # "Top" is the node after current
        return self.list.current.next.value

    def __str__(self):
        if self.is_empty():
            return "Stack: [Empty]"

        items = []
        temp = self.list.current.next
        start = self.list.current

        while True:
            items.append(str(temp.value))
            if temp == start:
                break
            temp = temp.next
        return f"Stack (Top to Bottom): {items}"


## Test Script
if __name__ == "__main__":

    print("Task 1: Priority Queue (Sorted List)")
    pq = PriorityQueue()
    pq.insert(5, 'task C')
    pq.insert(2, 'task A')
    pq.insert(7, 'task D')
    pq.insert(3, 'task B')
    print(f"Queue: {pq}")
    print(f"Removed: {pq.remove_min()}")
    print(f"Removed: {pq.remove_min()}")
    print(f"Queue: {pq}")

    print("Task 2: Deque (Doubly Linked List)")
    dq = Deque()
    dq.insert_front(10)
    dq.insert_rear(20)
    dq.insert_front(5)
    dq.insert_rear(30)
    print(f"Deque: {dq}")
    print(f"Removed front: {dq.remove_front()}")
    print(f"Removed rear: {dq.remove_rear()}")
    print(f"Deque: {dq}")

    print("\nTask 3: Circular List")
    cl = CircularList()
    cl.insert(1)
    cl.insert(2)
    cl.insert(3)
    cl.display()

    cl.step()
    cl.display()

    print(f"Find 2: {cl.find(2)}")
    print(f"Find 9: {cl.find(9)}")

    print(f"Deleting node after current: {cl.delete_next()}")
    cl.display()

    print("\nTask 4: Stack (from Circular List)")
    s = CircularStack()
    s.push(100)
    s.push(200)
    s.push(300)
    print(f"Peek: {s.peek()}")
    print(f"Popped: {s.pop()}")
    print(f"Peek: {s.peek()}")
    print(f"Popped: {s.pop()}")
    print(f"Popped: {s.pop()}")
    print(f"Is empty: {s.is_empty()}")