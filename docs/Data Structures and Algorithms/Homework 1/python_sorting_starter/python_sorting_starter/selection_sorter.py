from sorter import Sorter

class SelectionSorter(Sorter):
    def __init__(self, name):
        super().__init__("SelectionSort")

    def sort(self, data):
        n = len(data)
        for i in range(n):
            min_index = i
            for j in range(i + 1, n):
                if data[j] < data[min_index]:
                    min_index = j
            data[i], data[min_index] = data[min_index], data[i]
        return data

